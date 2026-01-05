/**
 * 서버 환경용 MSW 설정
 *
 * 서버 사이드(Next.js 서버 컴포넌트)에서 API 요청을 가로채기 위한 서버 설정
 * 모듈 레벨에서 자동으로 초기화되어 서버 컴포넌트 실행 전에 MSW 활성화
 *
 * Node.js의 fetch를 가로채서 핸들러에 정의된 모킹 응답 반환
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// 개발 환경에서 서버 컴포넌트 실행 전에 MSW 서버 초기화
if (process.env.NODE_ENV === 'development' && process.env.NEXT_RUNTIME === 'nodejs') {
  if (!server.listHandlers().length) server.listen({ onUnhandledRequest: 'bypass' });

  server.events.on('request:start', ({ request }) => {
    console.log('[MSW] Intercepted:', request.method, request.url);
  });

  server.events.on('request:match', ({ request }) => {
    console.log('[MSW] Matched handler:', request.method, request.url);
  });

  server.events.on('request:unhandled', ({ request }) => {
    console.warn('[MSW] Unhandled request:', request.method, request.url);
  });
}
