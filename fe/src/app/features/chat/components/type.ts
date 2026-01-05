import { ChatData } from '@/app/features/chat/dtos/type';

export interface ChatBubblesProps {
  chats: ChatData[];
}

export interface GlobalChatHeaderProps {
  onlineCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
}

export interface GlobalChatProps {
  chats: ChatData[];
  onlineCount: number;
  onMessageSubmit?: (message: string) => void;
}
