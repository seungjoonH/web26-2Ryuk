import '@/mocks/server';
import RoomChatModal from './RoomChatModal';
import { roomChatService } from '../services/RoomChatService';
import roomService from '@/app/features/room/services/RoomService';
import { RoomConverter } from '@/app/features/room/dtos/Room';

interface RoomChatModalServerProps {
  roomId: string;
  myUserId: string;
}

export default async function RoomChatModalServer({ roomId, myUserId }: RoomChatModalServerProps) {
  // TODO: 웹소켓 연결로 대체
  const [roomDto, chats] = await Promise.all([
    roomService.getRoom(roomId),
    roomChatService.getChats(roomId),
  ]);

  const roomData = RoomConverter.toData(roomDto);

  return <RoomChatModal participantCount={roomData.currentParticipants} chats={chats} />;
}
