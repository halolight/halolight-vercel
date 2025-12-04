# HaloLight Vercel

[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg?logo=vercel)](https://halolight-vercel.h7ml.cn)
[![Next.js](https://img.shields.io/badge/Next.js-15-%23000000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-%2361DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)

HaloLight 后台管理系统的 **Vercel 优化部署版本**，基于 Next.js 15 App Router + React 19 构建，充分利用 Vercel 平台特性实现最佳性能。

- 在线预览：<https://halolight-vercel.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-vercel>

## 功能亮点

- **Vercel Edge Functions**：边缘计算，全球低延迟
- **Edge Middleware**：请求级别的边缘处理
- **ISR (Incremental Static Regeneration)**：增量静态再生成
- **Image Optimization**：自动图片优化和 WebP/AVIF 转换
- **Analytics & Speed Insights**：内置性能分析
- **Preview Deployments**：PR 自动预览部署
- **Serverless Functions**：无服务器 API 路由

## 与原版差异

| 特性 | 原版 (halolight) | Vercel 版 |
|------|------------------|-----------|
| 部署平台 | 通用 | Vercel 优化 |
| Edge Runtime | 可选 | 默认启用 |
| 图片优化 | 手动 | Vercel Image Optimization |
| 缓存策略 | 手动配置 | Vercel Edge Cache |
| 分析工具 | 第三方 | Vercel Analytics |
| 预览部署 | CI/CD 配置 | 自动 |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Vercel CLI（可选）

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/halolight/halolight-vercel.git
cd halolight-vercel

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 部署到 Vercel

#### 方式一：Git 集成（推荐）

1. 将仓库推送到 GitHub
2. 在 [Vercel Dashboard](https://vercel.com/new) 导入项目
3. Vercel 会自动检测 Next.js 并配置构建

#### 方式二：Vercel CLI

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录
vercel login

# 部署
vercel
```

## 常用脚本

```bash
pnpm dev          # 启动开发服务器 (Turbopack)
pnpm build        # 生产构建
pnpm start        # 启动生产服务器
pnpm lint         # ESLint 检查
pnpm type-check   # TypeScript 类型检查
```

## Vercel 特性配置

### vercel.json

```json
{
  "framework": "nextjs",
  "regions": ["hkg1", "sin1", "nrt1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Edge Runtime

```typescript
// src/app/api/edge/route.ts
export const runtime = 'edge';

export async function GET() {
  return Response.json({ message: 'Hello from Edge!' });
}
```

### ISR 配置

```typescript
// src/app/posts/[id]/page.tsx
export const revalidate = 60; // 60 秒重新验证

export async function generateStaticParams() {
  // 预生成静态页面
}
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | API 基础地址 | `/api` |
| `NEXT_PUBLIC_MOCK` | 启用 Mock 数据 | `false` |
| `VERCEL_URL` | Vercel 自动注入的部署 URL | - |

## 目录结构

```
halolight-vercel/
├── src/
│   ├── app/                    # App Router 页面
│   │   ├── api/                # API 路由
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/             # 组件
│   └── lib/                    # 工具函数
├── public/                     # 静态资源
├── vercel.json                 # Vercel 配置
└── next.config.ts              # Next.js 配置
```

## 相关链接

- [HaloLight 文档](https://halolight.docs.h7ml.cn)
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)

## 许可证

[MIT](LICENSE)
