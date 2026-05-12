/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1f30fvcr317rj.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
  const apiBase = process.env.API_PROXY_TARGET || 'https://api.kyndara.ai'
  return [
    {
      source: '/api-proxy/:path*',
      destination: `${apiBase}/:path*`,
    },
  ]
},
}

export default nextConfig