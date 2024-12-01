/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "utfs.io",
            "lh3.googleusercontent.com"
        ],
        remotePatterns: [
            {
               protocol: "https",
               hostname: "*.googleusercontent.com",
               port: "",
               pathname: "*",
            }
          ]
        
    }, eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
};

export default nextConfig;
