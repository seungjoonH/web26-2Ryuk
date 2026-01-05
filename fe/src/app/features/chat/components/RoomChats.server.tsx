import { ChatConverter } from '../dtos/Chat';
import ChatBubbles from './ChatBubbles';
import { roomChatService } from '../services/RoomChatService';

interface RoomChatsProps {
  roomId: string;
}

export default async function RoomChats({ roomId }: RoomChatsProps) {
  const chats = await roomChatService.getChats(roomId);

  return <ChatBubbles chats={chats.map(ChatConverter.toData)} />;
}
