/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: "rzp_live_YtiQ6qK46f4hBQ",
    RAZORPAY_SECRET_ID: "tIagWiBTJnEayozSC7I1JGrK",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
