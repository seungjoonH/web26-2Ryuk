export interface ProfileProps {
  nickname: string;
  profileImage?: string;
}

export interface AvatarProps {
  profileImage?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface AvatarCountProps {
  count: number;
  onClick?: () => void;
}

export interface AvatarsProps {
  profileImages: string[];
  viewCount?: number;
}
