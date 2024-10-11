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
        
    },
};

export default nextConfig;
