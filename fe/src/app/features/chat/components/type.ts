import { ChatReceiveData } from '@/app/features/chat/dtos/type';

export interface ChatBubblesProps {
  chats: ChatReceiveData[];
}

export interface ChatModalHeaderProps {
  iconName: string;
  title: string;
  participantCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
  headerChildren?: React.ReactNode;
  isConnected?: boolean;
}

export interface ChatModalBaseProps {
  iconName: string;
  title: string;
  participantCount: number;
  chats: ChatReceiveData[];
  onMessageSubmit?: (message: string) => void;
  headerChildren?: React.ReactNode;
  participantsAvatars?: React.ReactNode;
  isConnected?: boolean;
  disabled?: boolean;
}

export interface GlobalChatHeaderProps {
  onlineCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
}

export interface GlobalChatProps {
  chats: ChatReceiveData[];
  onlineCount: number;
  onMessageSubmit?: (message: string) => void;
  isConnected?: boolean;
}

export interface RoomChatModalProps {
  participantCount: number;
  chats: ChatReceiveData[];
  onMessageSubmit?: (message: string) => void;
  onMicToggle?: () => void;
  onSpeakerToggle?: () => void;
}
