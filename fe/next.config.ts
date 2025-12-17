import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // 개발 환경 설정
  ...(process.env.NODE_ENV === 'development' && {
    // 개발 서버 설정
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
  }),

  // 리버스 프록시 설정 (Vite의 proxy와 유사)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? `http://server:3000/api/:path*`  // Docker Compose 서비스 이름 사용
          : '/api/:path*',  // 프로덕션에서는 같은 서버
      },
    ];
  },
};

export default nextConfig;
