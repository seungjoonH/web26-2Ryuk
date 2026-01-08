'use client';

import { GhostTextButton } from './TextButton';
import { authStore, type AuthStore } from '@/app/features/user/stores/auth';

export default function LoginButton() {
  const login = authStore((state: AuthStore) => state.login);
  const isAuthenticated = authStore((state: AuthStore) => state.isAuthenticated);

  const handleLogin = async () => {
    if (isAuthenticated) return;
    // BE의 Mock 사용자 중 하나 랜덤 선택 (J001 ~ J307)
    const randomId = `J${String(Math.floor(Math.random() * 307) + 1).padStart(3, '0')}`;
    await login(randomId);
  };

  return <GhostTextButton text="로그인" size="small" onClick={handleLogin} />;
}
