/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AWS_REGION: process.env.AWS_REGION || 'ap-southeast-2',
  },
}

module.exports = nextConfig 