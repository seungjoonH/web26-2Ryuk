import styles from './logo.module.css';
import Image from 'next/image';
import Paths from '@/app/shared/path';
import { LogoImageProps, LogoSize, LogoProps } from './type';
import CSSUtil from '@/app/utils/css';

const SIZE_MAP: Record<LogoSize, number> = { small: 36, medium: 60, large: 100 };

export function LogoImage({ variant, size }: LogoImageProps) {
  const path = Paths.images(`logo_${variant}`);
  const imageSize = SIZE_MAP[size];
  return <Image src={path} alt="logo" width={imageSize} height={imageSize} />;
}

export function Logo({ size, onClick }: LogoProps) {
  const className = CSSUtil.buildCls(
    styles.logo,
    onClick && styles.clickable,
    size && styles[size],
  );

  return (
    <div className={className} onClick={onClick}>
      <LogoImage variant="circle" size={size} />
      <span className={styles.title}>물방울톡</span>
    </div>
  );
}
