'use client';

import { useEffect } from 'react';
import IS from '@/utils/is';

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (IS.nil(window) || process.env.NODE_ENV !== 'development') return;
    (async () => {
      const { worker } = await import('@/mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
    })();
  }, []);

  return <>{children}</>;
}
