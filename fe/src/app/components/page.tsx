'use client';

import { useEffect } from 'react';
import useNavigation from '@/app/hooks/useNavigation';

/**
 * Components 페이지
 * `/components` -> `/components/shared`로 리다이렉트
 */
export default function ComponentsPage() {
  const { gotoComponents } = useNavigation();

  useEffect(() => gotoComponents('shared'), [gotoComponents]);

  return null;
}
