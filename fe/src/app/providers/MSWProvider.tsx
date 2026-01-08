'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import IS from '@/utils/is';

export default function MSWProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (IS.undefined(window) || process.env.NODE_ENV !== 'development') return;
    (async () => {
      const { worker } = await import('@/mocks/browser');
      await worker.start({
        onUnhandledRequest: (request, print) => {
          const url = new URL(request.url);
          if (
            url.pathname.startsWith('/__nextjs_') ||
            url.pathname.startsWith('/_next/') ||
            url.pathname === '/favicon.ico' ||
            url.pathname === '/manifest.json'
          )
            return;
          print.warning();
        },
      });
    })();
  }, []);

  return <>{children}</>;
}
