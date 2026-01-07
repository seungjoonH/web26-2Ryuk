import { HttpService } from '@/app/services/http.service';
import { RoomDto } from '../dtos/type';

interface RoomsResponse {
  rooms: RoomDto[];
}

export class RoomService {
  async getRooms(): Promise<RoomsResponse> {
    // TODO: 실제 API 엔드포인트로 교체
    const response = await HttpService.get<RoomsResponse>('/api/rooms');

    return {
      rooms: response.rooms,
    };
  }
}

const roomService = new RoomService();
export default roomService;
