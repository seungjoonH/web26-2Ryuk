import { HttpService } from '@/app/services/http.service';
import { RoomDto, RoomCreationDto } from '../dtos/type';

interface RoomsApiResponse {
  success: boolean;
  message: string;
  data: {
    rooms: RoomDto[];
  };
}

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
    const response = await HttpService.get<RoomsApiResponse>('/api/rooms/all');
    return { rooms: response.data.rooms };
  }

  async getRoom(roomId: string): Promise<RoomDto> {
    // TODO: 실제 API 엔드포인트로 교체
    interface RoomDetailResponse {
      success: boolean;
      message: string;
      data: RoomDto;
    }
    const response = await HttpService.get<RoomDetailResponse>(`/api/rooms/${roomId}`);
    return response.data;
  }

  async createRoom(data: RoomCreationDto): Promise<RoomCreationResponse> {
    const response = await HttpService.post<RoomCreationResponse>('/api/rooms', data);
    return response;
  }
}

const roomService = new RoomService();
export default roomService;
