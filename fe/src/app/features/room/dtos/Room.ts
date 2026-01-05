import {
  RoomDto,
  RoomData,
  ParticipantDto,
  ParticipantData,
  RoomCreationDto,
  RoomCreationData,
} from './type';

export class RoomConverter {
  static toData(dto: RoomDto): RoomData {
    return {
      id: dto.id,
      title: dto.title,
      tags: dto.tags,
      currentCount: dto.currentCount,
      maxCount: dto.maxCount,
      participants: dto.participants.map((p) => ({
        id: p.id,
        avatar: p.avatar,
      })),
    };
  }

  static toDto(data: RoomData): RoomDto {
    return {
      id: data.id,
      title: data.title,
      tags: data.tags,
      currentCount: data.currentCount,
      maxCount: data.maxCount,
      participants: data.participants.map((p) => ({
        id: p.id,
        nickname: '', // TODO: nickname은 별도로 관리
        avatar: p.avatar,
      })),
    };
  }

  static creationToDto(data: RoomCreationData): RoomCreationDto {
    return {
      title: data.title,
      tags: data.tags,
      maxCount: data.maxCount,
      micEnabled: data.micEnabled,
      isPrivate: data.isPrivate,
      password: data.password,
    };
  }

  static creationToData(dto: RoomCreationDto): RoomCreationData {
    return {
      title: dto.title,
      tags: dto.tags,
      maxCount: dto.maxCount,
      micEnabled: dto.micEnabled,
      isPrivate: dto.isPrivate,
      password: dto.password,
    };
  }
}
