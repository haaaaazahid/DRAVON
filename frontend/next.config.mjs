import path from 'path';

/** @type {import('next').NextConfig} */
const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'https://dravon-api.onrender.com/api'
).replace(/\/$/, '');

const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
