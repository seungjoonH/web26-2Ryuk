'use client';

import { GhostTextButton } from './TextButton';
import { authStore, type AuthStore } from '@/app/features/user/stores/auth';

export default function LogoutButton() {
  const logout = authStore((state: AuthStore) => state.logout);

  return <GhostTextButton text="로그아웃" size="small" onClick={logout} />;
}
