import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
