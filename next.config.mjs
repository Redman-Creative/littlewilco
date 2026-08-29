/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/email", destination: "/#subscribe", permanent: false },
    ];
  },
};

export default nextConfig;
