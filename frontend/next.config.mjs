/** @type {import('next').NextConfig} */
const isProd=process.env.NODE_ENV==="production";
let apiOrigin="https://api.xlimegear.com";
try{apiOrigin=new URL(process.env.NEXT_PUBLIC_API_URL||apiOrigin).origin}catch{}
const csp=[
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `connect-src 'self' ${apiOrigin}`,
  "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://res.cloudinary.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests"
].join("; ");

const commonHeaders=[
  {key:"X-Content-Type-Options",value:"nosniff"},
  {key:"X-Frame-Options",value:"DENY"},
  {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
  {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), payment=(), usb=()"},
  {key:"Cross-Origin-Opener-Policy",value:"same-origin"},
  {key:"X-DNS-Prefetch-Control",value:"on"},
  ...(isProd?[{key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains; preload"},{key:"Content-Security-Policy",value:csp}]:[])
];

const nextConfig={
  poweredByHeader:false,
  compress:true,
  reactStrictMode:true,
  turbopack:{root:process.cwd()},
  images:{qualities:[75,82],formats:["image/avif","image/webp"],minimumCacheTTL:86400,remotePatterns:[
    {protocol:"https",hostname:"images.unsplash.com",pathname:"/**"},
    {protocol:"https",hostname:"images.pexels.com",pathname:"/**"},
    {protocol:"https",hostname:"res.cloudinary.com",pathname:"/**"}
  ]},
  async headers(){return [{source:"/:path*",headers:commonHeaders}]}
};
export default nextConfig;
