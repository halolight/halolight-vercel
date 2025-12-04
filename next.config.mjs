import withPWA from "next-pwa";

// Vercel 环境检测
const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    // 本地字体缓存
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-font-assets",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-image-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      handler: "CacheFirst",
      options: {
        rangeRequests: true,
        cacheName: "static-audio-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp4)$/i,
      handler: "CacheFirst",
      options: {
        rangeRequests: true,
        cacheName: "static-video-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    // Next.js 带哈希的静态资源
    {
      urlPattern: /\/_next\/static\/.+\.(js|css)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // 非 _next/static 的 JS/CSS
    {
      urlPattern: ({ url }) => {
        const pathname = url.pathname;
        if (pathname.startsWith("/_next/static/")) return false;
        return /\.(js|css)$/i.test(pathname);
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "dynamic-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 3,
      },
    },
    // Next.js 页面数据
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-data",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 3,
      },
    },
    {
      urlPattern: /\.(?:json|xml|csv)$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "static-data-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        if (!isSameOrigin) return false;
        const pathname = url.pathname;
        if (pathname.startsWith("/api/")) return false;
        return true;
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        return !isSameOrigin;
      },
      handler: "NetworkOnly",
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 安全：移除 X-Powered-By 响应头
  poweredByHeader: false,

  // 打包优化
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "framer-motion",
      "@tanstack/react-query",
      "recharts",
      "date-fns",
      "zustand",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // 图片优化 - Vercel 原生支持
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },

  // 压缩优化
  compress: true,

  // 生产环境 source map 关闭
  productionBrowserSourceMaps: false,

  // 静态资源缓存（Next.js headers 配置，与 vercel.json 互补）
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/fonts/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  // 重定向规则
  async redirects() {
    return [];
  },

  // 在 CI 环境忽略构建时的 ESLint 错误
  eslint: {
    ignoreDuringBuilds: process.env.CI === "true",
  },

  // 在 CI 环境忽略 TypeScript 构建错误
  typescript: {
    ignoreBuildErrors: process.env.CI === "true",
  },

  // 暴露部署环境信息
  env: {
    NEXT_PUBLIC_DEPLOY_PLATFORM: isVercel ? "vercel" : "other",
    // Git 信息（仅在非生产环境或显式启用时暴露）
    ...((!isProduction || process.env.NEXT_PUBLIC_SHOW_GIT_INFO === "true") && {
      NEXT_PUBLIC_GIT_BRANCH: process.env.VERCEL_GIT_COMMIT_REF || "",
      NEXT_PUBLIC_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA
        ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
        : "",
    }),
  },
};

export default pwaConfig(nextConfig);
