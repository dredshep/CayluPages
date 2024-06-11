/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      {
        protocol: "http",
        hostname: "192.168.22.118",
        port: "",
      },
    ],
  },
};

// export default nextConfig;
module.exports = nextConfig;
