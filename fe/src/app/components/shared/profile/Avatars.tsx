'use client';

import styles from './avatar.module.css';
import Avatar from './Avatar';
import AvatarCount from './AvatarCount';
import { AvatarsProps } from './type';

function Avatars({ profileImages = [], viewCount = 3 }: AvatarsProps) {
  const length = profileImages.length;
  const visibleImages = profileImages.slice(0, viewCount);
  const rest = length - viewCount;

  return (
    <div className={styles.avatars}>
      {visibleImages.map((profileImage, index) => (
        <Avatar key={`avatar-${index}`} profileImage={profileImage} />
      ))}
      {rest > 0 && <AvatarCount count={rest} />}
    </div>
  );
}

export default Avatars;
