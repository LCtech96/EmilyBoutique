/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
    unoptimized: false,
  },
  typescript: {
    // Allow production builds to complete even with type errors during development
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to complete even with ESLint errors during development
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
