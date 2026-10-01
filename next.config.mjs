/** OpsDesk Next.js config: strict mode, no X-Powered-By, global security headers
 *  (nosniff, DENY framing, strict referrer). API no-store caching lives in
 *  vercel.json. See docs/SECURITY.md.
 *  @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

export default nextConfig;
