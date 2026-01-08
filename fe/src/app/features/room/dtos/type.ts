export interface ParticipantDto {
  id: string;
  nickname: string;
  profile_image: string;
}

export interface RoomDto {
  id: string;
  title: string;
  tags: string[];
  current_participants: number;
  max_participants: number;
  is_mic_available: boolean;
  is_private: boolean;
  participant_profile_images?: string[];
  create_date: string;
}

export interface ParticipantData {
  id: string;
  nickname: string;
  profile_image: string;
}

export interface RoomData {
  id: string;
  title: string;
  tags: string[];
  currentParticipants: number;
  maxParticipants: number;
  isMicAvailable: boolean;
  isPrivate: boolean;
  participantProfileImages?: string[];
  createDate: Date;
}

export interface RoomCreationDto {
  title: string;
  tags: string[];
  max_participants: number;
  is_mic_available: boolean;
  is_private: boolean;
  password?: string;
}

export interface RoomCreationData {
  title: string;
  tags: string[];
  maxParticipants: number;
  isMicAvailable: boolean;
  isPrivate: boolean;
  password?: string;
}
