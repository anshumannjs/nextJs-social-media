/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    logging: {
        fetches: {
            fullUrl: true,
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "**"
            }
        ]
    },
    crossOrigin: "anonymous"
}

module.exports = nextConfig
