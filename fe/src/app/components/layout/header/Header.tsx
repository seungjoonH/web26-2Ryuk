'use client';

import styles from './header.module.css';
import { Logo } from '@/app/components/sprite/logo/Logo';
import { OutlineIconButton } from '@/app/components/shared/icon/IconButton';
import Profile from '@/app/components/shared/profile/Profile';
import useNavigation from '@/app/hooks/useNavigation';

export default function Header() {
  const { goHome } = useNavigation();
  const nickname = '강하늘';
  const avatar = 'https://i.pravatar.cc/150?img=1';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo size="small" onClick={goHome} />
        </div>
        <div className={styles.right}>
          <OutlineIconButton name="settings" size="small" />
          <div className={styles.separator} />
          <Profile nickname={nickname} profileImage={avatar} />
        </div>
      </div>
    </header>
  );
}
