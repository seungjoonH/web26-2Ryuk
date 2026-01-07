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
import { Logger, UsePipes, ValidationPipe, Inject, OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RoomService } from '@src/modules/room/room.service';
import { GlobalChatSendDto, RoomChatSendDto } from './dto/chat-message.dto';
import { RoomJoinDto, RoomLeaveDto } from '@src/modules/room/dto/room.dto';
import { REDIS_CLIENT } from '@src/providers/redis/redis.provider';
import { RedisClientType } from 'redis';
import { LOG, logMessage } from '@src/common/utils/log-messages';

@WebSocketGateway({ namespace: '/' })
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  onModuleInit() {
    // Redis 클라이언트를 RoomsService에 설정
    this.roomService.setRedisClient(this.redisClient);
  }

  /**
   * 클라이언트 연결 처리
   * - 글로벌 채팅에 자동 참여 (Socket.io room 사용)
   */
  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const isAuthenticated = client.data.authenticated;

    logMessage(this.logger, LOG.WS.CONNECT(client.id, userId));

    // 글로벌 채팅에 자동 참여 (모든 사용자)
    client.join('global');

    // 인증된 사용자의 경우 추가 초기화
    if (isAuthenticated && userId) logMessage(this.logger, LOG.WS.AUTH_CONNECT(userId));
    else logMessage(this.logger, LOG.WS.UNAUTH_CONNECT(client.id));
  }

  /**
   * 클라이언트 연결 해제 처리
   */
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const isAuthenticated = client.data.authenticated;

    logMessage(this.logger, LOG.WS.DISCONNECT(client.id, userId));

    // 모든 방에서 제거
    if (userId) await this.roomService.leaveAllRooms(userId);
  }

  /**
   * 글로벌 채팅 메시지 수신 및 브로드캐스트
   * 요구사항: 인증되지 않은 사용자는 송신 불가능
   */
  @SubscribeMessage('chat:global:send')
  async handleGlobalChat(@ConnectedSocket() client: Socket, @MessageBody() dto: GlobalChatSendDto) {
    const userId = client.data.userId;
    const isAuthenticated = client.data.authenticated;

    // 권한 검증: 인증되지 않은 사용자는 메시지 송신 불가능
    if (!isAuthenticated || !userId) {
      logMessage(this.logger, LOG.CHAT.UNAUTH_SEND(client.id));
      client.emit('error', { message: '인증이 필요합니다.' });
      return;
    }

    // 메시지 브로드캐스트
    await this.chatService.broadcastGlobalChat(this.server, userId, dto.message);
  }

  /**
   * 방 채팅 메시지 수신 및 브로드캐스트
   * 요구사항: 해당 방의 참여자만 메시지 송신 가능
   */
  @SubscribeMessage('chat:room:send')
  async handleRoomChat(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomChatSendDto) {
    const userId = client.data.userId;
    const isAuthenticated = client.data.authenticated;

    // 권한 검증: 인증되지 않은 사용자는 메시지 송신 불가능
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
  }

  /**
   * 방 입장 처리
   * 요구사항: 권한 검증 후 논리적 상태 변경 및 Socket.io room 참여
   */
  @SubscribeMessage('room:join')
  async handleRoomJoin(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomJoinDto) {
    const userId = client.data.userId;
    const isAuthenticated = client.data.authenticated;

    // 권한 검증: 인증되지 않은 사용자는 방 입장 불가능
    if (!isAuthenticated || !userId) {
      logMessage(this.logger, LOG.ROOM.UNAUTH_JOIN(client.id));
      client.emit('error', { message: '로그인이 필요합니다.' });
      return;
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

    // 이미 다른 로컬 방에 참여 중인지 확인
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

    // 논리적 상태 변경: 방에 참여
    await this.roomService.joinRoom(userId, dto.roomId, client.id);

    // Socket.io room에 참여 (브로드캐스트 최적화용)
    client.join(dto.roomId);

    // 클라이언트에 입장 성공 알림
    client.emit('room:joined', { roomId: dto.roomId });

    // 다른 참여자에게 알림
    await this.chatService.notifyUserJoined(this.server, dto.roomId, userId);

    logMessage(this.logger, LOG.ROOM.JOIN(userId, dto.roomId));
  }

  /**
   * 방 퇴장 처리
   * 요구사항: 논리적 상태 변경 및 Socket.io room에서 제거
   */
  @SubscribeMessage('room:leave')
  async handleRoomLeave(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomLeaveDto) {
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
  }
}
