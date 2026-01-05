import '@/mocks/server';
import GlobalChat from './GlobalChat';
import { globalChatService } from '../services/GlobalChatService';

export default async function GlobalChatModal() {
  // TODO: 웹소켓 연결로 대체
  const globalChatData = await globalChatService.getGlobalChats();
  return <GlobalChat {...globalChatData} />;
}
