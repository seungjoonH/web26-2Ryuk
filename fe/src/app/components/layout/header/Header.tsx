'use client';

import { useRouter } from 'next/navigation';
import styles from './header.module.css';
import { Logo } from '@/app/components/sprite/logo/Logo';
import { OutlineIconButton } from '@/app/components/shared/icon/IconButton';
import Profile from '@/app/components/shared/profile/Profile';
import LoginButton from '@/app/components/shared/button/LoginButton';
import { authStore, type AuthStore } from '@/app/features/user/stores/auth';
import { ROUTES } from '@/app/shared/routes';
import LogoutButton from '@/app/components/shared/button/LogoutButton';

export default function Header() {
  const router = useRouter();
  const user = authStore((state: AuthStore) => state.user);

  const goHome = () => router.push(ROUTES.HOME);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo size="small" onClick={goHome} />
        </div>
        <div className={styles.right}>
          <OutlineIconButton name="settings" size="small" />
          {user ? <LogoutButton /> : <LoginButton />}
          <div className={styles.separator} />
          {user && <Profile nickname={user.nickname} profileImage={user.avatar} />}
        </div>
      </div>
    </header>
  );
}
