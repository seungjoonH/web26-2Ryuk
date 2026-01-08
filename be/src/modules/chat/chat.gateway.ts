import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, UsePipes, ValidationPipe, BadRequestException, UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from '@src/common/filters/ws-exception.filter';
import { WsJsonParsePipe } from '@src/common/pipes/ws-json-parse.pipe';
import { ChatService } from './chat.service';
import { RoomService } from '@src/modules/room/room.service';
import { MockAuthService } from '@src/modules/auth/mock-auth.service';
import { GlobalChatSendDto, RoomChatSendDto } from './dto/chat-message.dto';
import { RoomJoinDto, RoomLeaveDto } from '@src/modules/room/dto/room.dto';
import { REDIS_CLIENT } from '@src/providers/redis/redis.provider';
import { RedisClientType } from 'redis';
import { LOG, logMessage } from '@src/common/utils/log-messages';
import { GLOBAL_ROOM_ID } from '@src/common/constants/constants';
import { ROOM_TYPE } from '@src/modules/room/room.type';

@UseFilters(new WsExceptionFilter()) // 필터
@WebSocketGateway({ namespace: '/' })
@UsePipes(
  new WsJsonParsePipe(), // 문자열 JSON을 객체로 파싱
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false, // WebSocket에서는 false로 설정
    skipMissingProperties: false,
    // exceptionFactory 제거: 기본 BadRequestException 사용
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly mockAuthService: MockAuthService,
  ) {}

  /**
   * 클라이언트 연결 처리
   * - 글로벌 채팅에 자동 참여 (Socket.io room 사용)
   */
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data?.userId;
      const isAuthenticated = client.data?.authenticated;

      try {
        logMessage(this.logger, LOG.WS.CONNECT(client.id, userId));
      } catch (logError) {
        this.logger.warn('연결 로그 실패', logError);
      }

      // GLOBAL 방의 roomId 조회 후 참여 (인증 여부와 관계없이 모든 사용자)
      // 우선 글로벌 방 하나만 있다고 가정...
      const globalRoomId = GLOBAL_ROOM_ID;
      const isUser = isAuthenticated && userId;

      if (globalRoomId) {
        // 모든 사용자 Socket.io room 참여 (브로드캐스트용) - 먼저 join
        try {
          await client.join(globalRoomId);
          if (isUser) logMessage(this.logger, LOG.WS.SOCKET_IO_JOIN_AUTH(userId, globalRoomId));
          else logMessage(this.logger, LOG.WS.SOCKET_IO_JOIN_UNAUTH(client.id, globalRoomId));
        } catch (joinError) {
          const errorMessage = joinError instanceof Error ? joinError.message : String(joinError);
          logMessage(this.logger, LOG.WS.SOCKET_IO_JOIN_ERROR(errorMessage));
        }

        // 인증된 사용자는 Redis에도 논리적 상태 저장 및 참여자 수 업데이트
        if (isUser) {
          try {
            const isInRoom = await this.roomService.isUserInRoom(userId, globalRoomId);
            if (!isInRoom) {
              try {
                await this.roomService.joinRoom(userId, globalRoomId);
                logMessage(this.logger, LOG.WS.REDIS_JOIN(userId, globalRoomId));

                // 참여자 수 조회 및 브로드캐스트 (인증된 사용자만 카운트)
                const currentParticipants = await this.roomService.getCurrentParticipants(globalRoomId);
                await this.chatService.notifyParticipantsUpdated(this.server, globalRoomId, currentParticipants);
              } catch (joinError) {
                const errorMessage = joinError instanceof Error ? joinError.message : String(joinError);
                logMessage(this.logger, LOG.WS.REDIS_JOIN_ERROR(errorMessage));
              }
            } else {
              // 이미 참여 중인 경우에도 현재 참여자 수 브로드캐스트
              const currentParticipants = await this.roomService.getCurrentParticipants(globalRoomId);
              await this.chatService.notifyParticipantsUpdated(this.server, globalRoomId, currentParticipants);
            }
          } catch (checkError) {
            const errorMessage = checkError instanceof Error ? checkError.message : String(checkError);
            logMessage(this.logger, LOG.WS.ROOM_PARTICIPATION_CHECK_ERROR(errorMessage));
          }
        }
      }

      // 로그 출력
      if (isAuthenticated && userId) {
        try {
          logMessage(this.logger, LOG.WS.AUTH_CONNECT(userId));
        } catch (logError) {
          this.logger.warn('인증 로그 실패', logError);
        }
      } else {
        try {
          logMessage(this.logger, LOG.WS.UNAUTH_CONNECT(client.id));
        } catch (logError) {
          this.logger.warn('비인증 로그 실패', logError);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logMessage(this.logger, LOG.WS.CONNECTION_HANDLE_ERROR(errorMessage, errorStack));
    }
  }

  // 웹소켓 연결 해제 처리
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const isAuthenticated = client.data.authenticated;

    logMessage(this.logger, LOG.WS.DISCONNECT(client.id, userId));

    const globalRoomId = GLOBAL_ROOM_ID;

    // 인증된 사용자가 글로벌 방에 참여 중인 경우 참여자 수 업데이트 및 브로드캐스트
    if (isAuthenticated && userId && globalRoomId) {
      try {
        const isInRoom = await this.roomService.isUserInRoom(userId, globalRoomId);
        if (isInRoom) {
          // 글로벌 방에서 제거 (참여자 수 감소)
          await this.roomService.leaveRoom(userId, globalRoomId);

          // 참여자 수 조회 및 브로드캐스트 (인증된 사용자만 카운트)
          const currentParticipants = await this.roomService.getCurrentParticipants(globalRoomId);
          await this.chatService.notifyParticipantsUpdated(this.server, globalRoomId, currentParticipants);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logMessage(this.logger, LOG.WS.GLOBAL_ROOM_LEAVE_ERROR(errorMessage));
      }
    }

    // 모든 방에서 제거 (글로벌 방은 이미 처리됨)
    if (userId) {
      try {
        await this.roomService.leaveAllRooms(userId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logMessage(this.logger, LOG.WS.GLOBAL_ROOM_LEAVE_ERROR(errorMessage));
      }
    }
  }

  // 글로벌 채팅 메시지 수신 및 브로드캐스트 (인증되지 않은 사용자는 수신만)
  @SubscribeMessage('chat:global:send')
  async handleGlobalChat(@ConnectedSocket() client: Socket, @MessageBody() dto: GlobalChatSendDto) {
    try {
      const userId = client.data.userId;
      const isAuthenticated = client.data.authenticated;

      // 권한 검증: 인증되지 않은 사용자는 메시지 송신 불가능
      if (!isAuthenticated || !userId) {
        logMessage(this.logger, LOG.CHAT.UNAUTH_SEND(client.id));
        client.emit('error', { message: '인증이 필요합니다.' });
        return;
      }

      // 사용자가 참여 중인 글로벌 방 찾기
      const globalRoomId = await this.roomService.getUserGlobalRoom(userId);
      if (!globalRoomId) {
        logMessage(this.logger, LOG.CHAT.NOT_MEMBER_SEND(userId, 'global'));
        client.emit('error', { message: '글로벌 채팅방에 참여하지 않았습니다.' });
        return;
      }

      // 사용자 정보 조회 (MockAuthService 사용, 나중에 UserService로 교체)
      const mockUser = this.mockAuthService?.getMockUserById(userId);
      if (!mockUser) {
        client.emit('error', { message: '사용자 정보를 찾을 수 없습니다.' });
        return;
      }

      const senderInfo = {
        role: mockUser.role,
        nickname: mockUser.nickname,
        profile_image: mockUser.profile_image,
      };

      // 메시지 브로드캐스트 (is_me 구분하여 전송)
      await this.chatService.broadcastGlobalChat(this.server, globalRoomId, userId, dto.message, senderInfo, client.id);
    } catch (error) {
      // ValidationPipe 에러 처리
      if (error instanceof BadRequestException) {
        const errorResponse = error.getResponse();
        const message =
          typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
            ? Array.isArray(errorResponse.message)
              ? errorResponse.message.join(', ')
              : errorResponse.message
            : '입력값이 올바르지 않습니다.';

        try {
          client.emit('error', { message: String(message) });
        } catch (emitError) {
          this.logger.warn('에러 메시지 전송 실패', emitError);
        }
        return;
      }

      // 기타 에러 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      logMessage(this.logger, LOG.WS.GLOBAL_CHAT_HANDLE_ERROR(errorMessage));
      try {
        client.emit('error', { message: '메시지 전송 중 문제가 발생했습니다.' });
      } catch (emitError) {
        this.logger.warn('에러 메시지 전송 실패', emitError);
      }
    }
  }

  // ----------------------------------------------- 로컬 방 (수정 필요) -----------------------------------------------

  /**
   * 방 채팅 메시지 수신 및 브로드캐스트
   * 요구사항: 해당 방의 참여자만 메시지 송신 가능
   */
  @SubscribeMessage('chat:room:send')
  async handleRoomChat(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomChatSendDto) {
    try {
      const userId = client.data.userId;
      const isAuthenticated = client.data.authenticated;

      // 권한 검증: 인증되지 않은 사용자는 메시지 송신 불가능
      console.log('isAuthenticated', isAuthenticated);
      if (!isAuthenticated || !userId) {
        logMessage(this.logger, LOG.CHAT.UNAUTH_ROOM_SEND(client.id));
        client.emit('error', { message: '인증이 필요합니다.' });
        return;
      }

      // 권한 검증: 해당 방의 참여자인지 확인
      const isInRoom = await this.roomService.isUserInRoom(userId, dto.roomId);
      if (!isInRoom) {
        logMessage(this.logger, LOG.CHAT.NOT_MEMBER_SEND(userId, dto.roomId));
        client.emit('error', { message: '해당 방에 참여하지 않았습니다.' });
        return;
      }

      // 메시지 브로드캐스트
      await this.chatService.broadcastRoomChat(this.server, dto.roomId, userId, dto.message);
    } catch (error) {
      // ValidationPipe 에러 처리
      if (error instanceof BadRequestException) {
        const errorResponse = error.getResponse();
        const message =
          typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
            ? Array.isArray(errorResponse.message)
              ? errorResponse.message.join(', ')
              : errorResponse.message
            : '입력값이 올바르지 않습니다.';

        try {
          client.emit('error', { message: String(message) });
        } catch (emitError) {
          this.logger.warn('에러 메시지 전송 실패', emitError);
        }
        return;
      }

      // 기타 에러 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      logMessage(this.logger, LOG.WS.ROOM_CHAT_HANDLE_ERROR(errorMessage));
      try {
        client.emit('error', { message: '메시지 전송 중 문제가 발생했습니다.' });
      } catch (emitError) {
        this.logger.warn('에러 메시지 전송 실패', emitError);
      }
    }
  }

  /**
   * 대화방 입장 처리
   * 요구사항: 권한 검증 후 논리적 상태 변경 및 Socket.io room 참여
   */
  @SubscribeMessage('room:join')
  async handleRoomJoin(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomJoinDto) {
    // 디버깅: 받은 데이터 로그
    logMessage(this.logger, LOG.WS.ROOM_JOIN_DTO_RECEIVED(JSON.stringify(dto), typeof dto));

    // 조인하려는 방의 타입 확인 (Redis에서 읽어온 값)
    const roomType = await this.roomService.getRoomType(dto.roomId);

    try {
      const userId = client.data.userId;
      const isAuthenticated = client.data.authenticated;

      // 로컬 방일때만 권한 검증
      if (roomType === ROOM_TYPE.LOCAL) {
        if (!isAuthenticated || !userId) {
          logMessage(this.logger, LOG.ROOM.UNAUTH_JOIN(client.id));
          client.emit('error', { message: '로그인이 필요합니다.' });
          return;
        }
      }

      // 권한 검증: 방 입장 권한 확인
      const canJoin = await this.roomService.canUserJoinRoom(userId, dto.roomId);
      if (!canJoin) {
        logMessage(this.logger, LOG.ROOM.NO_PERMISSION(userId, dto.roomId));
        client.emit('error', { message: '방 입장 권한이 없습니다.' });
        return;
      }

      // 이미 참여 중인지 확인
      const isInRoom = await this.roomService.isUserInRoom(userId, dto.roomId);
      if (isInRoom) {
        logMessage(this.logger, LOG.ROOM.ALREADY_IN(userId, dto.roomId));
        client.emit('room:joined', { roomId: dto.roomId });
        return;
      }

      // 방이 존재하지 않는 경우 처리
      if (roomType === null) {
        logMessage(this.logger, LOG.ROOM.NO_PERMISSION(userId, dto.roomId));
        client.emit('error', { message: '존재하지 않는 방입니다.' });
        return;
      }

      // GLOBAL 타입 방이 아닌 경우, 다른 로컬 방에 참여 중인지 확인
      if (roomType !== ROOM_TYPE.GLOBAL) {
        const existingLocalRoom = await this.roomService.getUserLocalRoom(userId);
        if (existingLocalRoom && existingLocalRoom !== dto.roomId) {
          // 기존 로컬 방에서 퇴장 처리
          logMessage(this.logger, LOG.ROOM.JOIN_SWITCH(userId, existingLocalRoom, dto.roomId));

          // 기존 방에서 제거
          await this.roomService.leaveRoom(userId, existingLocalRoom);
          client.leave(existingLocalRoom);

          // 다른 참여자에게 알림
          await this.chatService.notifyUserLeft(this.server, existingLocalRoom, userId);
        }
      }

      // 논리적 상태 변경: 방에 참여
      await this.roomService.joinRoom(userId, dto.roomId);

      // Socket.io room에 참여 (브로드캐스트 최적화용)
      client.join(dto.roomId);

      // 클라이언트에 입장 성공 알림
      client.emit('room:joined', { roomId: dto.roomId });

      // 다른 참여자에게 알림
      await this.chatService.notifyUserJoined(this.server, dto.roomId, userId);

      logMessage(this.logger, LOG.ROOM.JOIN(userId, dto.roomId));
    } catch (error) {
      // ValidationPipe 에러 처리
      if (error instanceof BadRequestException) {
        const errorResponse = error.getResponse();
        const message =
          typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
            ? Array.isArray(errorResponse.message)
              ? errorResponse.message.join(', ')
              : errorResponse.message
            : '입력값이 올바르지 않습니다.';

        try {
          client.emit('error', { message: String(message) });
        } catch (emitError) {
          this.logger.warn('에러 메시지 전송 실패', emitError);
        }
        return;
      }

      // Redis 연결 문제나 예상치 못한 에러 발생 시 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logMessage(this.logger, LOG.WS.ROOM_JOIN_HANDLE_ERROR(errorMessage, errorStack));

      try {
        client.emit('error', { message: '방 입장 처리 중 문제가 발생했습니다.' });
      } catch (emitError) {
        // emit 실패 시 무시
        this.logger.warn('에러 메시지 전송 실패', emitError);
      }
    }
  }

  /**
   * 로그아웃 처리
   * 인증 사용자 -> 익명 사용자 전환
   * WebSocket 연결은 유지하되, 참여자 수에서 제외
   */
  @SubscribeMessage('auth:logout')
  async handleLogout(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data.userId;
      const isAuthenticated = client.data.authenticated;

      // 인증된 사용자가 아닌 경우 early return
      if (!isAuthenticated || !userId) return;

      const globalRoomId = GLOBAL_ROOM_ID;
      if (!globalRoomId) return;

      const isInRoom = await this.roomService.isUserInRoom(userId, globalRoomId);
      if (!isInRoom) return;

      // 글로벌 방에서 제거 (참여자 수 감소)
      await this.roomService.leaveRoom(userId, globalRoomId);

      // 참여자 수 조회 및 브로드캐스트
      const currentParticipants = await this.roomService.getCurrentParticipants(globalRoomId);
      await this.chatService.notifyParticipantsUpdated(this.server, globalRoomId, currentParticipants);

      logMessage(this.logger, LOG.WS.LOGOUT(userId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logMessage(this.logger, LOG.WS.LOGOUT_ERROR(errorMessage));
    }
  }

  /**
   * 방 퇴장 처리
   * 요구사항: 논리적 상태 변경 및 Socket.io room에서 제거
   */
  @SubscribeMessage('room:leave')
  async handleRoomLeave(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomLeaveDto) {
    try {
      const userId = client.data.userId;
      const isAuthenticated = client.data.authenticated;

      // 권한 검증: 인증되지 않은 사용자는 방 퇴장 불가능
      if (!isAuthenticated || !userId) {
        logMessage(this.logger, LOG.ROOM.UNAUTH_LEAVE(client.id));
        client.emit('error', { message: '인증이 필요합니다.' });
        return;
      }

      // 참여 중인지 확인
      const isInRoom = await this.roomService.isUserInRoom(userId, dto.roomId);
      if (!isInRoom) {
        logMessage(this.logger, LOG.ROOM.NOT_IN(userId, dto.roomId));
        client.emit('error', { message: '해당 방에 참여하지 않았습니다.' });
        return;
      }

      // 논리적 상태 변경: 방에서 퇴장
      await this.roomService.leaveRoom(userId, dto.roomId);

      // Socket.io room에서 제거
      client.leave(dto.roomId);

      // 다른 참여자에게 알림
      await this.chatService.notifyUserLeft(this.server, dto.roomId, userId);

      logMessage(this.logger, LOG.ROOM.LEAVE(userId, dto.roomId));
    } catch (error) {
      // ValidationPipe 에러 처리
      if (error instanceof BadRequestException) {
        const errorResponse = error.getResponse();
        const message =
          typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
            ? Array.isArray(errorResponse.message)
              ? errorResponse.message.join(', ')
              : errorResponse.message
            : '입력값이 올바르지 않습니다.';

        try {
          client.emit('error', { message: String(message) });
        } catch (emitError) {
          this.logger.warn('에러 메시지 전송 실패', emitError);
        }
        return;
      }

      // 기타 에러 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logMessage(this.logger, LOG.WS.ROOM_LEAVE_HANDLE_ERROR(errorMessage, errorStack));

      try {
        client.emit('error', { message: '방 퇴장 처리 중 문제가 발생했습니다.' });
      } catch (emitError) {
        this.logger.warn('에러 메시지 전송 실패', emitError);
      }
    }
  }
}
