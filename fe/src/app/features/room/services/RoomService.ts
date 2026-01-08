import { HttpService } from '@/app/services/http.service';
import { RoomDto, RoomCreationDto } from '../dtos/type';

interface RoomsResponse {
  rooms: RoomDto[];
}

interface RoomCreationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    [key: string]: any;
  };
}

export class RoomService {
  async getRooms(): Promise<RoomsResponse> {
    // TODO: 실제 API 엔드포인트로 교체
    const response = await HttpService.get<RoomsResponse>('/api/rooms');

    return {
      rooms: response.rooms,
    };
  }

  async createRoom(data: RoomCreationDto): Promise<RoomCreationResponse> {
    const response = await HttpService.post<RoomCreationResponse>('/api/rooms', data);
    return response;
  }
}

const roomService = new RoomService();
export default roomService;
