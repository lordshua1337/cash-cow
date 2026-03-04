import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/cash-cow',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
