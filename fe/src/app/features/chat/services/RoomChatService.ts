import { ChatReceiveData } from '@/app/features/chat/dtos/type';
import { ChatChannel } from './type';

export class RoomChatService implements ChatChannel {
  async getChats(roomId: string): Promise<ChatReceiveData[]> {
    // TODO: WebSocket을 통한 초기 메시지 로드
    return [];
  }

  sendMessage(message: string): void {
    // TODO: WebSocketService를 통해 특정 방 메시지 전송
  }

  subscribe(): void {
    // TODO: WebSocketService를 통해 특정 방 구독
  }

  unsubscribe(): void {
    // TODO: WebSocketService를 통해 특정 방 구독 해제
  }
}

export const roomChatService = new RoomChatService();
