export type LogoVariant = 'default' | 'square' | 'circle';
export type LogoSize = 'small' | 'medium' | 'large';

export interface LogoImageProps {
  variant: LogoVariant;
  size: LogoSize;
}

export interface LogoProps {
  size: LogoSize;
  onClick?: () => void;
}
