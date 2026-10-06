/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Blog pages re-render on the server after deploy (scheduled posts), so the
  // markdown files have to ship with the serverless functions.
  outputFileTracingIncludes: {
    "/": ["./content/posts/**/*"],
    "/**/*": ["./content/posts/**/*"],
  },
};

export default nextConfig;
