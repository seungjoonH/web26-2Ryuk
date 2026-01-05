import '@/mocks/server';
import RealtimeRoomsSection from './RealtimeRoomsSection';
import roomService from '../services/RoomService';
import { RoomConverter } from '../dtos/Room';

export default async function RealtimeRoomsSectionServer() {
  const result = await roomService.getRooms();
  const roomDtos = result.rooms;

  const convertedRooms = roomDtos.map((room) => RoomConverter.toData(room));

  return <RealtimeRoomsSection rooms={convertedRooms} />;
}
