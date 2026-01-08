/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  devIndicators: { position: 'bottom-right' },

  // 리버스 프록시 설정
  async rewrites() {
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
