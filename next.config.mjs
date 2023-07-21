import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US", "de-DE"],
    defaultLocale: "de-DE",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pkqfwvgswdthtmmgiaki.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/posters/**",
      },
    ],
  },
};

export default nextConfig;
