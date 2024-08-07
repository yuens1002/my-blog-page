// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '**.unsplash.com',
      },
      {
        hostname: 'dummyimage.com',
      },
    ],
  },
  // need fs to work in utils.ts file
  webpack: (config) => {
    config.resolve.fallback = { fs: false, os: false };

    return config;
  },
};

export default nextConfig;
