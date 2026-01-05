import { MouseEventHandler } from 'react';

export type IconVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type IconSize = 'small' | 'medium' | 'large';

export interface IconProps {
  name: string;
  size: IconSize;
}

export interface IconCircleProps {
  name: string;
  size: IconSize;
  variant: IconVariant;
}

export interface IconButtonProps extends IconCircleProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}
