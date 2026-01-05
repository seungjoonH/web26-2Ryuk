'use client';

import styles from './avatar.module.css';
import Avatar from './Avatar';
import AvatarCount from './AvatarCount';
import { AvatarsProps } from './type';

function Avatars({ profileDataList, viewCount = 3 }: AvatarsProps) {
  const length = profileDataList.length;
  const visibleAvatars = profileDataList.slice(0, viewCount);
  const rest = length - viewCount;

  return (
    <div className={styles.avatars}>
      {visibleAvatars.map((profileData) => (
        <Avatar
          key={`avatar-${profileData.id}`}
          nickname={`User ${profileData.id}`}
          src={profileData.avatar}
        />
      ))}
      {rest > 0 && <AvatarCount count={rest} />}
    </div>
  );
}

export default Avatars;
