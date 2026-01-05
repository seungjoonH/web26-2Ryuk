'use client';

import { useEffect, useState } from 'react';
import IS from '@/app/utils/is';

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!IS.nil(window) && process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
        setMswReady(true);
      } else setMswReady(true);
    })();
  }, []);

  if (!mswReady) return null;
  return <>{children}</>;
}
