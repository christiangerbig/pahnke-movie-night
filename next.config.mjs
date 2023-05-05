import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yzybkfpayferkdiafjdj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/posters/**",
      },
    ],
  },
};

export default nextConfig;
