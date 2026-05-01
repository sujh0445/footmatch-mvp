const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akrebiz.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d26wss9rw703v0.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
