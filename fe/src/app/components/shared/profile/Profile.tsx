'use client';

import Avatar from './Avatar';
import { ProfileProps } from './type';
import styles from './profile.module.css';

export default function Profile({ nickname, src }: ProfileProps) {
  return (
    <div className={styles.profile}>
      <Avatar nickname={nickname} src={src} />
      <span className={styles.nickname}>{nickname}</span>
    </div>
  );
}
