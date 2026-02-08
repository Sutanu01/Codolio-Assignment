/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid loading SWC binary; use Babel (.babelrc) and Terser instead
  swcMinify: false,
};

export default nextConfig;
