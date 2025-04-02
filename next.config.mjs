/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: { appid: process.env.API_KEY },
};

export default nextConfig;
