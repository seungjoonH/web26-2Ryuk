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
      hostId: dto.host_id,
      title: dto.title,
      tags: dto.tags,
      currentParticipants: dto.current_participants,
      maxParticipants: dto.max_participants,
      isMicAvailable: dto.is_mic_available,
      isPrivate: dto.is_private,
      participants: dto.participants.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        profile_image: p.profile_image,
      })),
      createDate: new Date(dto.create_date),
    };
  }

  static toDto(data: RoomData): RoomDto {
    return {
      id: data.id,
      host_id: data.hostId,
      title: data.title,
      tags: data.tags,
      current_participants: data.currentParticipants,
      max_participants: data.maxParticipants,
      is_mic_available: data.isMicAvailable,
      is_private: data.isPrivate,
      participants: data.participants.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        profile_image: p.profile_image,
      })),
      create_date: data.createDate.toISOString(),
    };
  }

  static creationToDto(data: RoomCreationData): RoomCreationDto {
    return {
      title: data.title,
      tags: data.tags,
      max_participants: data.maxParticipants,
      mic_enabled: data.micEnabled,
      is_private: data.isPrivate,
      password: data.password,
    };
  }

  static creationToData(dto: RoomCreationDto): RoomCreationData {
    return {
      title: dto.title,
      tags: dto.tags,
      maxParticipants: dto.max_participants,
      micEnabled: dto.mic_enabled,
      isPrivate: dto.is_private,
      password: dto.password,
    };
  }
}
