import path from 'path';

/** @type {import('next').NextConfig} */

const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          'https://dravon-api.onrender.com/api/:path*',
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
