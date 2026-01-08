'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserService, User } from '../services/UserService';
import IS from '@/utils/is';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  user: User | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (userId: string) => Promise<void>;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

function createInitializeAction(
  set: (partial: Partial<AuthState>) => void,
  get: () => AuthStore,
): () => Promise<void> {
  return async () => {
    const { token } = get();

    if (!token) {
      set({ isAuthenticated: false, userId: null, user: null });
      return;
    }

    try {
      const userData = await UserService.getMe(token);
      set({
        isAuthenticated: true,
        userId: userData.id,
        user: userData,
      });
    } catch {
      get().logout();
    }
  };
}

function createLoginAction(
  set: (partial: Partial<AuthState>) => void,
): (userId: string) => Promise<void> {
  return async (userId: string) => {
    const data = await UserService.mockLogin(userId);

    if (!data.success) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    set({
      isAuthenticated: true,
      userId: data.userId,
      token: data.token,
    });

    // BE 응답의 user 정보를 User 형식으로 변환
    const userData: User = {
      id: data.user.id,
      nickname: data.user.nickname,
      avatar: data.user.profile_image || '',
    };
    set({ user: userData });

    if (IS.undefined(window)) return;
    const { globalChatService } = await import('@/app/features/chat/services/GlobalChatService');
    globalChatService.subscribe();
  };
}

function createLogoutAction(set: (partial: Partial<AuthState>) => void): () => void {
  return () => {
    set({
      isAuthenticated: false,
      userId: null,
      token: null,
      user: null,
    });

    // 로그아웃 시 백엔드에 로그아웃 이벤트 전송 (WebSocket 연결은 유지)
    if (IS.undefined(window)) return;
    import('@/app/features/chat/services/GlobalChatService').then(({ globalChatService }) => {
      globalChatService.notifyLogout();
    });
  };
}

function createStorageChangeHandler(
  state: AuthStore,
  set: (partial: Partial<AuthState>) => void,
): (e: StorageEvent) => Promise<void> {
  return async (e: StorageEvent) => {
    if (e.key !== 'auth-storage') return;

    const newState = e.newValue ? JSON.parse(e.newValue) : null;
    if (!newState?.state?.token) {
      state.logout();
      return;
    }

    const { token, userId } = newState.state;
    if (token !== state.token) {
      set({ token, userId, isAuthenticated: true });

      try {
        const userData = await UserService.getMe(token);
        set({ user: userData });
      } catch {
        state.logout();
      }
    }
  };
}

function setupStorageSync(state: AuthStore) {
  state.initialize();

  const set = (partial: Partial<AuthState>) => {
    Object.assign(state, partial);
  };
  const handleStorageChange = createStorageChangeHandler(state, set);
  window.addEventListener('storage', handleStorageChange);
}

export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      token: null,
      user: null,
      initialize: createInitializeAction(set, get),
      login: createLoginAction(set),
      logout: createLogoutAction(set),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) setupStorageSync(state);
      },
    },
  ),
);
