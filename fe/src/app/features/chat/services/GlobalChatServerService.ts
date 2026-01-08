import { GlobalChatData } from '@/app/features/chat/dtos/type';
import globalChatMock from '@/mocks/data/globalChat.json';
import { GlobalChatConverter } from '../dtos/Chat';

/**
 * GlobalChat 서버 서비스
 * 서버 컴포넌트에서 초기 데이터 조회 담당
 */
export class GlobalChatServerService {
  /**
   * 서버 컴포넌트에서 초기 채팅 데이터 가져오기
   */
  async getGlobalChats(): Promise<GlobalChatData> {
    // 초기 데이터는 Mock에서 가져오고, 실시간 메시지는 WebSocket으로 수신
    return GlobalChatConverter.toData(globalChatMock);
  }
}

export const globalChatServerService = new GlobalChatServerService();
