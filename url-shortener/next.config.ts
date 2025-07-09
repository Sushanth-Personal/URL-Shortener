/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dtu64orvo/**", // Optional: Restrict to your Cloudinary account
      },
    ],
  },
};

export default nextConfig;