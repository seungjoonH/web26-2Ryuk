import { GlobalChatData } from '@/app/features/chat/dtos/type';
import { ChatChannel } from './type';
import globalChatMock from '@/mocks/data/globalChat.json';
import { GlobalChatConverter } from '../dtos/Chat';

export class GlobalChatService implements ChatChannel {
  async getGlobalChats(): Promise<GlobalChatData> {
    // TODO: WebSocket을 통한 초기 메시지 로드
    return GlobalChatConverter.toData(globalChatMock);
  }

  sendMessage(message: string): void {
    // TODO: WebSocketService를 통해 전역 채팅 메시지 전송
  }

  subscribe(): void {
    // TODO: WebSocketService를 통해 전역 채팅 구독
  }

  unsubscribe(): void {
    // TODO: WebSocketService를 통해 전역 채팅 구독 해제
  }
}

export const globalChatService = new GlobalChatService();
