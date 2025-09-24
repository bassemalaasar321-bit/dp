/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  output: 'standalone',
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig