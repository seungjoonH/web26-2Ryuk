'use client';

import { useEffect } from 'react';
import { authStore } from '../features/user/stores/auth';

/**
 * Auth Store 초기화 Provider
 * 앱 시작 시 localStorage 에서 토큰을 읽고 사용자 정보 조회
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // persist rehydration 완료 후 initialize 호출
    const unsubscribe = authStore.persist.onFinishHydration(() => {
      authStore.getState().initialize();
    });

    // 이미 rehydrated된 경우 직접 initialize 호출
    if (authStore.persist.hasHydrated()) {
      authStore.getState().initialize();
    }

    return unsubscribe;
  }, []);

  return <>{children}</>;
}
