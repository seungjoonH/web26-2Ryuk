import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
  },

  // 개발 환경 설정
  ...(process.env.NODE_ENV === 'development' && {
    // 개발 서버 설정
    devIndicators: {
      position: 'bottom-right',
    },
  }),

  // 리버스 프록시 설정 (Vite의 proxy와 유사)
  // 주의: 개발 환경에서 MSW를 사용하는 경우 rewrites를 비활성화해야 합니다.
  // rewrites가 활성화되면 서버 사이드 요청도 프록시되어 MSW가 가로채지 못합니다.
  async rewrites() {
    // 개발 환경에서는 MSW를 사용하므로 rewrites 비활성화
    // 실제 API 서버가 필요한 경우 USE_REAL_API=true 환경 변수로 활성화 가능
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? `http://server:3000/api/:path*` // Docker Compose 서비스 이름 사용
            : '/api/:path*', // 프로덕션에서는 같은 서버
      },
    ];
  },
};

export default nextConfig;
