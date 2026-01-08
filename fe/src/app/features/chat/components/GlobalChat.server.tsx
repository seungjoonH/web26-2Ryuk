import '@/mocks/server';
import GlobalChat from './GlobalChat';
import { globalChatServerService } from '../services/GlobalChatServerService';

/**
 * GlobalChat 서버 컴포넌트
 * 초기 채팅 데이터를 서버에서 가져오고, WebSocket 연결 초기화
 */
export default async function GlobalChatModal() {
  // 서버에서 초기 채팅 데이터 가져오기
  const globalChatData = await globalChatServerService.getGlobalChats();

  // 클라이언트 컴포넌트로 전달 (WebSocket 연결 및 메시지 관리 포함)
  return <GlobalChat {...globalChatData} />;
}
