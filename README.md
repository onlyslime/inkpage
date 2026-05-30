# 墨站 · inkpage

墨站是一个个人网页框架，基于 Next.js App Router、React 19、Tailwind CSS v4 和 TypeScript 构建。

## 项目说明

- 这是一个用于搭建个人主页、博客、项目、生活记录和友链页面的框架。
- 站点内容分为“框架代码”和“本地私密内容”两层。
- 本仓库只保留框架和空占位，不包含具体个人资料、证件、照片、头像、友链、项目正文或其他可识别内容。

## 目录约定

- `app/` 页面、路由和 UI 组件
- `lib/` 共享逻辑、加载器和站点文案
- `data/` 本地内容目录，只保留分类层和占位说明
- `public/` 静态资源
- `scripts/` 构建和生成脚本

## 本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 内容规则

- `data/blogs/` 仅保留目录约定，不提交具体文章内容
- `data/projects/` 仅保留目录约定，不提交具体项目数据
- `data/friends/` 仅保留目录约定，不提交具体友链条目
- `data/life_photos/` 仅保留目录约定，不提交具体生活素材
- `data/about_photos/` 仅保留目录约定，不提交私密文件
- `CLAUDE.md` 和 `AGENTS.md` 只保留本地使用，不会提交到 GitHub

## 配置

复制 `.env.example` 为 `.env.local` 后填写本地环境变量。

## 许可

MIT
