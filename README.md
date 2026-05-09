<div align="center">

# 墨站 · inkpage

**A bilingual, password-protectable personal site template.**

[English](#english) · [中文](#中文)

</div>

---

<a name="english"></a>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS v4"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript"></a>
</p>

## ✨ Features

- 🔐 **Password protection** — Guard any page (intro, projects, etc.) with a simple password gate
- 🌐 **Bilingual i18n** — Chinese / English switch with a single click
- 🎨 **10 built-in themes** — Vercel, Linear, Cursor, Notion, Stripe, Supabase, Ollama, Raycast, Claude, Resend
- 🔤 **6 font choices** — Geist, System UI, Serif, Monospace, LXGW WenKai, Pixel (Zpix)
- ✍️ **Lively typography** — Optional Pretext-powered animated text reflow
- 📝 **Blog system** — Markdown-based posts with auto-generated static routes
- 🖼️ **Project showcase** — List + detail pages, with per-project password protection
- 📍 **Life moments & footprint** — Photo timeline + interactive China map
- 🔗 **Friends page** — Clean friend-links grid
- 📱 **Mobile-first** — Hamburger drawer menu, fully responsive
- 🐾 **Scroll progress bar** — Cute animated character that follows your scroll

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/yourname/inkpage.git

# 2. Install
cd inkpage
npm install

# 3. Configure
cp .env.example .env.local
# Edit .env.local with your own values

# 4. Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
inkpage/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (auth, file downloads)
│   ├── blog/                     # Blog list + post pages
│   ├── components/               # Reusable UI components
│   ├── friends/                  # Friends page
│   ├── intro/                    # About / intro page (password-guarded)
│   ├── life/                     # Life moments + China footprint map
│   ├── projects/                 # Project list + detail pages
│   ├── settings/                 # Theme & font settings
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage (landing)
├── data/                         # Your content goes here
│   ├── about_photos/             # CV, certificates, avatar
│   ├── blogs/                    # Markdown blog posts
│   ├── friends/                  # Friend avatars + link files
│   ├── life_photos/moments/      # Life moment photos
│   ├── life_photos/footprint.json # Province visit scores
│   └── projects/                 # Project assets (videos, images, JSON)
├── lib/                          # Utilities, copy text, types
├── public/                       # Static assets (logo, favicon)
└── scripts/                      # Build helpers
```

## ⚙️ Configuration

Create `.env.local` from `.env.example`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production domain |
| `SITE_PASSWORD` | Password for protected pages |
| `SITE_ACCESS_KEY` | Secret key for direct-access links (`/intro?key=xxx`) |

## 🎨 Customize Your Content

### 1. Personal info (Intro page)
Edit `lib/siteCopy.ts` — replace all `[Your ...]` placeholders with your real info.

### 2. Projects
Add a directory under `data/projects/<slug>/` containing:
- `<slug>.json` — project metadata & bilingual content
- `intro.mp4` (optional) — project demo video
- Any additional assets

Update `lib/projects.ts` to register the slug.

### 3. Blog posts
Add markdown files under `data/blogs/` in this structure:
```
data/blogs/
└── 2026/
    └── 05/
        └── 09/
            └── my-post/
                └── index.md
```

Frontmatter example:
```markdown
---
title: "Hello World"
date: "2026-05-09"
---

Your content here.
```

### 4. Friends
Add folders under `data/friends/<slug>/` with:
- `avatar.jpg` — friend avatar
- `link.md` — containing the URL (`[Name](https://example.com)`)

### 5. Life moments & footprint
- Photos: `data/life_photos/moments/<year>/<month>/<day>/<seq>/`
  - `01.jpg` ~ `09.jpg`
  - `meta.json` with `text` field
- Footprint map: edit `data/life_photos/footprint.json`

### 6. Logo & favicon
Replace `public/logo.png` with your own avatar/logo.

## 🌐 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or manually:

```bash
npm run build
```

Remember to set the environment variables in your hosting dashboard.

## 📜 License

MIT

## 🙏 Credits

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [LXGW WenKai](https://github.com/lxgw/LxgwWenKai) — open-source Chinese kai font
- [Zpix](https://github.com/SolidZORO/zpix-pixel-font) — bitmap pixel font
- [@chenglou/pretext](https://github.com/chenglou/pretext) — text reflow engine

---

<a name="中文"></a>

## 中文简介

**墨站（inkpage）** 是一个基于 Next.js 16 + React 19 + Tailwind CSS v4 的双语个人网站模板。

### 核心能力

- 🔐 页面级密码保护（介绍页、项目详情页等）
- 🌐 中英双语一键切换
- 🎨 10 套内置主题 + 6 种字体
- ✍️ 灵动模式文字动画（Pretext 驱动）
- 📝 Markdown 博客（自动生成静态路由）
- 🖼️ 项目展示（列表 + 详情 + 单项目密码保护）
- 📍 生活动态时间线 + 中国足迹地图
- 🔗 友链页
- 📱 移动端汉堡菜单
- 🐾 底部滚动进度条动画

### 快速开始

```bash
git clone https://github.com/yourname/inkpage.git
cd inkpage
npm install
cp .env.example .env.local
# 编辑 .env.local 填入你的配置
npm run dev
```

### 自定义内容

| 页面 | 修改位置 |
|---|---|
| 个人介绍 | `lib/siteCopy.ts` |
| 项目 | `data/projects/<slug>/` + `lib/projects.ts` |
| 博客 | `data/blogs/年/月/日/文章标题/index.md` |
| 友链 | `data/friends/<slug>/`（头像 + link.md）|
| 生活动态 | `data/life_photos/moments/` |
| 足迹地图 | `data/life_photos/footprint.json` |
| Logo | `public/logo.png` |

部署到 Vercel 时，记得在后台设置环境变量 `SITE_PASSWORD` 和 `SITE_ACCESS_KEY`。
