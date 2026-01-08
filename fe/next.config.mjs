/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션 빌드 시 정적 export 활성화
  ...(process.env.NODE_ENV === 'production' && !process.env.USE_REAL_API
    ? { output: 'export' }
    : {}),
  images: { unoptimized: true },
  devIndicators: { position: 'bottom-right' },

  // 리버스 프록시 설정
  async rewrites() {
    // output: 'export' 모드에서는 rewrites 사용 불가
    if (process.env.NODE_ENV === 'production' && !process.env.USE_REAL_API) return [];
    if (!process.env.USE_REAL_API) return [];

    const apiServerUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || 'http://server:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiServerUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
