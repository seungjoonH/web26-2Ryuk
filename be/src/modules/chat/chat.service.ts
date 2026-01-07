import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { LOG, logMessage } from '@src/common/utils/log-messages';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  /**
   * 글로벌 채팅 메시지 브로드캐스트
   */
  async broadcastGlobalChat(server: Server, userId: string, message: string): Promise<void> {
    const data = {
      room: 'global',
      userId,
      message,
      timestamp: new Date().toISOString(),
    };

    // 글로벌 채팅은 모든 연결된 클라이언트에게 전송
    server.emit('chat:global:new-message', data);

    logMessage(this.logger, LOG.CHAT.GLOBAL_BROADCAST(userId, message));
  }

  /**
   * 방 채팅 메시지 브로드캐스트
   */
  async broadcastRoomChat(server: Server, roomId: string, userId: string, message: string): Promise<void> {
    const data = {
      roomId,
      userId,
      message,
      timestamp: new Date().toISOString(),
    };

    // Socket.io room을 사용하여 해당 방의 참여자에게만 전송
    server.to(roomId).emit('chat:room:new-message', data);

    logMessage(this.logger, LOG.CHAT.ROOM_BROADCAST(roomId, userId, message));
  }

  /**
   * 사용자 방 참여 알림 (다른 참여자에게)
   */
  async notifyUserJoined(server: Server, roomId: string, userId: string): Promise<void> {
    const data = { roomId, userId };

    server.to(roomId).emit('room:user-joined', data);
    logMessage(this.logger, LOG.CHAT.USER_JOINED(roomId, userId));
  }

  /**
   * 사용자 방 퇴장 알림 (다른 참여자에게)
   */
  async notifyUserLeft(server: Server, roomId: string, userId: string): Promise<void> {
    const data = { roomId, userId };

    server.to(roomId).emit('room:user-left', data);
    logMessage(this.logger, LOG.CHAT.USER_LEFT(roomId, userId));
  }
}
