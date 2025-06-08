/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ⬅️ prevents static export build errors
  reactStrictMode: true,
  experimental: {
    serverActions: true, // optional: only if you're using Server Actions
  },
};

export default nextConfig;
