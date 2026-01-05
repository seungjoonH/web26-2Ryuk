export interface ParticipantDto {
  id: string;
  nickname: string;
  avatar: string;
}

export interface RoomDto {
  id: string;
  title: string;
  tags: string[];
  currentCount: number;
  maxCount: number;
  participants: ParticipantDto[];
}

export interface ParticipantData {
  id: string;
  avatar: string;
}

export interface RoomData {
  id: string;
  title: string;
  tags: string[];
  currentCount: number;
  maxCount: number;
  participants: ParticipantData[];
}

export interface RoomCreationDto {
  title: string;
  tags: string[];
  maxCount: number;
  micEnabled: boolean;
  isPrivate: boolean;
  password?: string;
}

export interface RoomCreationData {
  title: string;
  tags: string[];
  maxCount: number;
  micEnabled: boolean;
  isPrivate: boolean;
  password?: string;
}
