/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ecommerce-work.vercel.app'],
    },
    env: {
        API_BASE_URL: process.env.API_BASE_URL,
    }
};

export default nextConfig;
