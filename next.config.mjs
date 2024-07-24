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
};

export default nextConfig;
