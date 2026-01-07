import './globals.css';
import MSWProvider from '@/app/providers/MSWProvider';
import Header from './components/layout/header/Header';
import { RootLayoutProps } from './type';

/**
 * 모든 페이지에 공통으로 적용
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <MSWProvider>
          <Header />
          {children}
        </MSWProvider>
      </body>
    </html>
  );
}
