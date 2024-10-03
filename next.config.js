/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js");

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
  i18n: {
    locales: ["default", "es", "en"],
    defaultLocale: "default",
    localeDetection: false,
  },
};

module.exports = nextConfig;
