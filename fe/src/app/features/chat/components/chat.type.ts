import { ChatReceiveData } from '@/app/features/chat/dtos/type';

export interface ChatBubbleProps {
  id: string;
  message: string;
  sender: {
    role: string;
    nickname: string;
    profileImage: string | null;
    isMe: boolean;
  };
  timestamp: Date;
}
