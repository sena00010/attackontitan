/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:  "static.wikia.nocookie.net",
                port: '',
            },
            {
                protocol: 'https',
                hostname:  "tinyjpg.com",
                port: '',
            },
            {
                protocol: 'https',
                hostname:  "images.rawpixel.com",
                port: '',
            },
            {
                protocol: 'https',
                hostname:  "firebasestorage.googleapis.com",
                port: '',
            },
        ],
    },

};

export default nextConfig;
