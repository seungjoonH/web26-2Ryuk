'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/shared/routes';
import IS from '@/utils/is';
import { ComponentCategory, getCategoryPath } from '@/app/components/helpers/type';

export default function useNavigation() {
  const router = useRouter();

  return {
    goHome: () => {
      router.push(ROUTES.HOME);
    },

    goBack: () => {
      if (!IS.undefined(window) && window.history.length > 1) router.back();
      else router.push(ROUTES.HOME);
    },

    gotoComponents: (category: ComponentCategory) => {
      router.push(getCategoryPath(category));
    },

    goToPost: (id: string | number) => {
      router.push(ROUTES.post(id));
    },

    goToRoom: (id: string | number) => {
      router.push(ROUTES.room(id));
    },
  };
}
