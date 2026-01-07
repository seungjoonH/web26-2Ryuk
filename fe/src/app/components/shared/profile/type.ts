export interface ProfileProps {
  nickname: string;
  src?: string;
}

export interface AvatarProps {
  nickname: string;
  src?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface AvatarCountProps {
  count: number;
  onClick?: () => void;
}

export interface AvatarsProps {
  profileDataList: Array<{ id: string; avatar?: string; nickname?: string }>;
  viewCount?: number;
}
