/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com', 'www.wifi4games.com'],
  },
  trailingSlash: true,
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  async rewrites() {
    return [
      {
        source: '/404',
        destination: '/not-found',
      },
    ]
  },
}

module.exports = nextConfig