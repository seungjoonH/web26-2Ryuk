'use client';

import styles from './avatar.module.css';
import Paths from '@/app/shared/path';
import Image from 'next/image';
import { AvatarProps } from './type';
import CSSUtil from '@/utils/css';

const DEFAULT_AVATAR = Paths.images('default_profile');

function Avatar({ nickname, src, isActive, onClick }: AvatarProps) {
  const className = CSSUtil.buildCls(styles.avatar, isActive && styles.active);
  const imageSrc = src || DEFAULT_AVATAR;

  return (
    <div className={className} onClick={onClick}>
      <Image
        src={imageSrc}
        alt={`avatar-${nickname}`}
        width={32}
        height={32}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== DEFAULT_AVATAR) target.src = DEFAULT_AVATAR;
        }}
      />
    </div>
  );
}

export default Avatar;
