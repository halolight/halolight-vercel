# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是 HaloLight 后台管理系统的 **Vercel 优化部署版本**，基于 Next.js 15 App Router + React 19 构建，充分利用 Vercel 平台特性实现最佳性能。

## 技术栈

- **框架**: Next.js 15 App Router + React 19 + TypeScript
- **样式**: Tailwind CSS 4、shadcn/ui (Radix UI)
- **部署**: Vercel (Edge Functions, ISR, Image Optimization)
- **构建工具**: pnpm、Turbopack (dev)

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (Turbopack)
pnpm build        # 生产构建
pnpm start        # 启动生产服务器
pnpm lint         # ESLint 检查
pnpm type-check   # TypeScript 类型检查
```

## Vercel 特性

### Edge Runtime

在 API 路由或页面中启用 Edge Runtime：

```typescript
export const runtime = 'edge';
```

### ISR (增量静态再生成)

```typescript
export const revalidate = 60; // 秒
```

### Edge Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 边缘处理逻辑
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // LCP 图片
/>
```

## 环境变量

### 本地开发

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_MOCK=true
```

### Vercel 环境变量

通过 Vercel Dashboard → Settings → Environment Variables 配置。

## 部署配置

### vercel.json

```json
{
  "framework": "nextjs",
  "regions": ["hkg1", "sin1", "nrt1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60, stale-while-revalidate" }
      ]
    }
  ]
}
```

## 目录结构

```
halolight-vercel/
├── src/
│   ├── app/                    # App Router 页面
│   │   ├── api/                # API 路由（Serverless/Edge）
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/             # 组件
│   └── lib/                    # 工具函数
├── public/                     # 静态资源
├── vercel.json                 # Vercel 配置
└── next.config.ts              # Next.js 配置
```

## 性能优化

1. **Edge Functions**: API 路由使用 `runtime = 'edge'` 减少冷启动
2. **ISR**: 静态页面使用 `revalidate` 实现增量更新
3. **Image Optimization**: 使用 `next/image` 自动优化
4. **Font Optimization**: 使用 `next/font` 优化字体加载
5. **Bundle Analysis**: 使用 `@next/bundle-analyzer` 分析包体积

## 与 HaloLight 原版的关系

本项目是 HaloLight 的 Vercel 平台优化版本，专注于：
- Vercel Edge Functions 集成
- Vercel 特有的缓存和 CDN 优化
- Vercel Analytics 和 Speed Insights
- 自动预览部署

核心业务逻辑与原版保持一致，便于同步更新。
