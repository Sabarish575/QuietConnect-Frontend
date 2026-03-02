/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',              // catches all /api/* requests
        destination: 'http://localhost:8080/:path*', // forwards to backend
      },
    ]
  },
}

export default nextConfig;
