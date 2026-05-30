/**
 * Site copy and lively-mode text
 *
 * Convention:
 * - Section headings (e.g. "About", "Contact", "Education", "Awards") are rendered as static DOM elements and NOT fed into Pretext.
 * - Body text, lists, contact items, etc. participate in the lively reflow via TextEscapeBlock.
 * - When static and lively share the same semantics, headings live in separate copy fields; the Pretext string must NOT include headings.
 */

/** 学校/机构官网（中英文界面均指向此站） */
export const INSTITUTION_OFFICIAL_URL = "https://example.edu/";

/** 自我介绍拆段：中间段为可链接校名 */
export const introBioSegments = {
  zh: {
    before: "墨站是一个",
    linkLabel: "个人网页框架",
    after: "，用于展示博客、项目、生活记录和友链。",
  },
  en: {
    before: "Inkpage is a ",
    linkLabel: "personal website framework",
    after: " for blogs, projects, life notes, and friend links.",
  },
} as const;

/** 灵动模式用：纯文本（无超链接） */
export const INTRO_BIO_LIVELY_PLAIN = {
  zh:
    introBioSegments.zh.before +
    introBioSegments.zh.linkLabel +
    introBioSegments.zh.after,
  en:
    introBioSegments.en.before +
    introBioSegments.en.linkLabel +
    introBioSegments.en.after,
} as const;

/** 关于页下载资源（源文件位于 data/about_photos，由 API 路由读取） */
export const INTRO_CV_PATH = "/api/about/file/cv-placeholder.pdf";
export const INTRO_RESEARCH_PROPOSAL_PATH =
  "/api/about/file/research-proposal-placeholder.pdf";
export const INTRO_CET6_PATH =
  "/api/about/file/resource/cet6-placeholder.pdf";
export const INTRO_SUMMER_CAMP_RANK_PATH =
  "/api/about/file/resource/rank-placeholder.jpg";
export const INTRO_NATIONAL_SCHOLARSHIP_PATH =
  "/api/about/file/resource/scholarship-placeholder.jpg";
export const INTRO_COMPETITION_AWARD_PATH =
  "/api/about/file/resource/competition-placeholder.pdf";
export const INTRO_MATH_COMPETITION_AWARD_PATH =
  "/api/about/file/resource/math-competition-placeholder.jpg";

/** Contact placeholders (shared across locales) */
export const INTRO_CONTACT = {
  email: "your.email@example.com",
  phone: "+86 138-0000-0000",
} as const;

export const introCopy = {
  zh: {
    title: "介绍",
    sectionHeading: "关于我",
    photoAlt: "墨站",
    cvLinkLabel: "简历",
    researchPlanLinkLabel: "研究计划",
    profileHeading: "个人信息",
    profileSummerCampRank: "夏令营排名：[Your rank]",
    profileExpectedRecommendationRank: "预计排名：[Your rank]",
    profileProofLabel: "（下载证明）",
    profileEnglishLevelPrefix: "英语水平：",
    profileCET6Label: "CET-6 [Score]",
    profileAlgorithmLevel: "算法水平：[Your level]",
    contactHeading: "联系方式",
    contactEmailLabel: "邮件",
    contactPhoneLabel: "电话",
    educationHeading: "教育经历",
    educationColTime: "时间",
    educationColDegree: "学历",
    educationColSchool: "学校",
    awardsHeading: "奖项",
    awardsHonorHeading: "荣誉奖项",
    awardsCompetitionHeading: "竞赛奖项",
    awardsColTime: "时间",
    awardsColAward: "奖项",
    awardsProofLabel: "（下载证明）",
    researchHeading: "著作权",
    researchCopyrightHeading: "软件著作权",
    researchColTime: "时间",
    researchColAbbr: "简称",
    researchColName: "名字",
  },
  en: {
    title: "About",
    sectionHeading: "WHOAMI",
    photoAlt: "Inkpage",
    cvLinkLabel: "Curriculum Vitae (Resume)",
    researchPlanLinkLabel: "Research Plan",
    profileHeading: "Personal Info",
    profileSummerCampRank: "Summer camp rank: [Your rank]",
    profileExpectedRecommendationRank: "Expected rank: [Your rank]",
    profileProofLabel: "(proof)",
    profileEnglishLevelPrefix: "English level: ",
    profileCET6Label: "CET-6 [Score]",
    profileAlgorithmLevel: "Algorithm level: [Your level]",
    contactHeading: "Contact Info",
    contactEmailLabel: "Email",
    contactPhoneLabel: "Phone",
    educationHeading: "Education",
    educationColTime: "Period",
    educationColDegree: "Degree",
    educationColSchool: "School",
    awardsHeading: "Awards",
    awardsHonorHeading: "Honors",
    awardsCompetitionHeading: "Competitions",
    awardsColTime: "Period",
    awardsColAward: "Award",
    awardsProofLabel: "(proof)",
    researchHeading: "Copyright",
    researchCopyrightHeading: "Software copyright",
    researchColTime: "Date",
    researchColAbbr: "Short",
    researchColName: "Title",
  },
} as const;

/** 教育经历表格行（与灵动模式纯文本一致） */
export const INTRO_EDUCATION = {
  zh: [
    { time: "20XX -", degree: "本科", school: "[Your University]" },
    { time: "20XX - 20XX", degree: "高中", school: "[Your High School]" },
    { time: "20XX - 20XX", degree: "初中", school: "[Your Middle School]" },
    { time: "20XX - 20XX", degree: "小学", school: "[Your Primary School]" },
  ],
  en: [
    {
      time: "20XX -",
      degree: "Undergraduate",
      school: "[Your University]",
    },
    {
      time: "20XX - 20XX",
      degree: "High school",
      school: "[Your High School]",
    },
    {
      time: "20XX - 20XX",
      degree: "Middle school",
      school: "[Your Middle School]",
    },
    {
      time: "20XX - 20XX",
      degree: "Primary school",
      school: "[Your Primary School]",
    },
  ],
} as const;

/** Lively-mode plain text for contact items (heading excluded) */
export function getIntroContactLivelyPlain(locale: "zh" | "en"): string {
  const t = introCopy[locale];
  const c = INTRO_CONTACT;
  return `${t.contactEmailLabel} ${c.email}\n${t.contactPhoneLabel} ${c.phone}`;
}

/** 灵动模式：教育表格（不含「教育经历」标题） */
export function getIntroEducationLivelyPlain(locale: "zh" | "en"): string {
  const t = introCopy[locale];
  const rows = INTRO_EDUCATION[locale];
  const header = `${t.educationColTime}  ${t.educationColDegree}  ${t.educationColSchool}`;
  const body = rows
    .map((r) => `${r.time}  ${r.degree}  ${r.school}`)
    .join("\n");
  return `${header}\n${body}`;
}

/** 荣誉奖项（与竞赛奖项分列） */
export const INTRO_AWARDS_HONOR = {
  zh: [
    {
      date: "20XX.XX",
      title: "[Your Honor Award]",
      proofPath: INTRO_NATIONAL_SCHOLARSHIP_PATH,
      proofFilename: "scholarship-placeholder.jpg",
    },
    { date: "20XX.XX", title: "[Another Honor]" },
  ],
  en: [
    {
      date: "20XX.XX",
      title: "[Your Honor Award]",
      proofPath: INTRO_NATIONAL_SCHOLARSHIP_PATH,
      proofFilename: "scholarship-placeholder.jpg",
    },
    { date: "20XX.XX", title: "[Another Honor]" },
  ],
} as const;

/** 竞赛奖项 */
export const INTRO_AWARDS_COMPETITION: Record<
  "zh" | "en",
  { date: string; title: string; proofPath?: string; proofFilename?: string }[]
> = {
  zh: [
    {
      date: "20XX",
      title: "[竞赛奖项示例]",
    },
    {
      date: "20XX.XX",
      title: "[另一项竞赛奖项]",
      proofPath: INTRO_COMPETITION_AWARD_PATH,
      proofFilename: "competition-placeholder.pdf",
    },
  ],
  en: [
    {
      date: "20XX",
      title: "[Competition Award Example]",
    },
    {
      date: "20XX.XX",
      title: "[Another Competition Award]",
      proofPath: INTRO_COMPETITION_AWARD_PATH,
      proofFilename: "competition-placeholder.pdf",
    },
  ],
};

/** 灵动模式：荣誉/竞赛列表（不含一级「奖项」标题；含二级小标题与「时间 / 奖项」表头行） */
export function getIntroAwardsLivelyPlain(locale: "zh" | "en"): string {
  const t = introCopy[locale];
  const headerLine = `${t.awardsColTime}  ${t.awardsColAward}`;
  const honor = INTRO_AWARDS_HONOR[locale]
    .map((row) => `${row.date}  ${row.title}`)
    .join("\n");
  const comp = INTRO_AWARDS_COMPETITION[locale]
    .map((row) => `${row.date}  ${row.title}`)
    .join("\n");
  const honorBlock = `${t.awardsHonorHeading}\n${headerLine}\n${honor}`;
  const compBlock =
    comp.length > 0
      ? `${t.awardsCompetitionHeading}\n${headerLine}\n${comp}`
      : `${t.awardsCompetitionHeading}\n${headerLine}\n`;
  return `${honorBlock}\n\n${compBlock}`.trimEnd();
}

/** 软件著作权（intro「著作权」一级区块） */
export const INTRO_RESEARCH_SOFTWARE: Record<
  "zh" | "en",
  readonly { date: string; abbr: string; name: string }[]
> = {
  zh: [
    {
      date: "20XX.XX",
      abbr: "示例项目",
      name: "示例项目 — 项目描述软件",
    },
    {
      date: "20XX.XX",
      abbr: "SampleApp",
      name: "示例应用软件",
    },
  ],
  en: [
    {
      date: "20XX.XX",
      abbr: "Example Project",
      name: "Example Project — Description Software",
    },
    {
      date: "20XX.XX",
      abbr: "SampleApp",
      name: "Sample Application Software",
    },
  ],
} as const;

/** 灵动模式：软件著作权表格（不含一级「著作权」标题） */
export function getIntroResearchLivelyPlain(locale: "zh" | "en"): string {
  const t = introCopy[locale];
  const headerLine = `${t.researchColTime}  ${t.researchColAbbr}  ${t.researchColName}`;
  const body = INTRO_RESEARCH_SOFTWARE[locale]
    .map((row) => `${row.date}  ${row.abbr}  ${row.name}`)
    .join("\n");
  return `${t.researchCopyrightHeading}\n${headerLine}\n${body}`;
}

export const projectsCopy = {
  zh: {
    title: "项目",
    detailTodo: "内容待定（TODO）。",
    backToProjects: "← 返回项目列表",
    detailFootnotesHeading: "术语与注释",
  },
  en: {
    title: "Projects",
    detailTodo: "Content to be added (TODO).",
    backToProjects: "← Back to projects",
    detailFootnotesHeading: "Glossary & notes",
  },
} as const;

export const settingsCopy = {
  zh: {
    title: "设置",
    subtitle:
      "选择界面风格，灵感来自 awesome-design-md 中的 DESIGN.md 集合。首次访问默认 Claude 主题。",
    currentLabel: "当前主题",
    fontHeading: "字体",
    fontSubtitle:
      "正文字体可单独切换；首次访问默认为霞鹜文楷。霞鹜文楷使用 Google Fonts 的 LXGW WenKai TC（繁体字形为主）。",
    currentFontLabel: "当前字体",
    fontNames: {
      geist: "Geist",
      system: "系统界面",
      serif: "衬线 / 宋体",
      mono: "等宽",
      wenkai: "霞鹜文楷",
      pixel: "像素（Zpix）",
    } as const,
    fontBlurbs: {
      geist: "无衬线，与 Next / Geist 文档气质接近。",
      system: "跟随操作系统 UI 字体，不额外加载西文字体。",
      serif: "思源宋体风格，长文略偏阅读感。",
      mono: "全站使用等宽，偏终端与代码排版。",
      wenkai:
        "开源楷体风格（LXGW WenKai TC）；与简体字形不完全一致处会回退系统楷/宋。",
      pixel:
        "Zpix（最像素）12px 点阵体，含简繁中文与日文；商业用途请遵守作者授权。",
    } as const,
    themeNames: {
      vercel: "Vercel",
      linear: "Linear",
      cursor: "Cursor",
      notion: "Notion",
      stripe: "Stripe",
      supabase: "Supabase",
      ollama: "Ollama",
      raycast: "Raycast",
      claude: "Claude",
      resend: "Resend",
    } as const,
    themeBlurbs: {
      vercel: "黑白精密，与 Next / Geist 栈一致。",
      linear: "深色底、紫点缀，工程向极简。",
      cursor: "AI 编辑器感，深色与渐变强调。",
      notion: "暖色纸感，适合长文阅读。",
      stripe: "浅底与紫色强调，偏正式作品集。",
      supabase: "深底翠绿，开源后端气质。",
      ollama: "终端单色、极简本地 LLM 感。",
      raycast: "深灰底与高饱和强调，工具感。",
      claude: "陶土暖色，区别于冷色 AI 站。",
      resend: "极简深黑与等宽气质，API 开发者向。",
    } as const,
  },
  en: {
    title: "Settings",
    subtitle:
      "Pick a UI style inspired by DESIGN.md entries from awesome-design-md. Defaults to Claude on first visit.",
    currentLabel: "Active theme",
    fontHeading: "Typography",
    fontSubtitle:
      "Body font is independent of theme. Defaults to Zpix. LXGW WenKai uses the Google Fonts TC cut (traditional forms).",
    currentFontLabel: "Active font",
    fontNames: {
      geist: "Geist",
      system: "System UI",
      serif: "Serif",
      mono: "Monospace",
      wenkai: "LXGW WenKai",
      pixel: "Pixel (Zpix)",
    } as const,
    fontBlurbs: {
      geist: "Sans; close to Next / Geist docs.",
      system: "Uses the OS UI font stack; no extra Latin webfont.",
      serif: "Noto Serif SC–leaning; a bit more editorial.",
      mono: "Site-wide monospace; terminal / code feel.",
      wenkai:
        "LXGW WenKai TC from Google Fonts; kai-style reading. Some SC glyphs may fall back.",
      pixel:
        "Zpix bitmap font (Latin + CJK). Check the author's license for commercial use.",
    } as const,
    themeNames: {
      vercel: "Vercel",
      linear: "Linear",
      cursor: "Cursor",
      notion: "Notion",
      stripe: "Stripe",
      supabase: "Supabase",
      ollama: "Ollama",
      raycast: "Raycast",
      claude: "Claude",
      resend: "Resend",
    } as const,
    themeBlurbs: {
      vercel: "Black-and-white precision; fits Next / Geist.",
      linear: "Dark UI with purple accent; engineering minimal.",
      cursor: "AI editor vibe; dark with gradient accents.",
      notion: "Warm paper-like surfaces; great for reading.",
      stripe: "Light canvas with purple; polished portfolio.",
      supabase: "Dark with emerald; open-source dev feel.",
      ollama: "Terminal monochrome; local LLM minimalism.",
      raycast: "Dark chrome with bold accents; utility polish.",
      claude: "Warm terracotta; distinct from cold AI blues.",
      resend: "Minimal black; monospace-forward API aesthetic.",
    } as const,
  },
} as const;

export const blogCopy = {
  zh: {
    livelyPlain: `博客\n\n内容待定（TODO）。\n\n开启灵动模式时，本页可见文字会参与绕排。`,
    title: "博客",
    body: "暂无文章。可在 data/blogs 下按 年/月/日 目录添加 .md 文件。",
  },
  en: {
    livelyPlain: `Blog\n\nContent to be added (TODO).\n\nWith Lively mode on, text on this page participates in the reflow.`,
    title: "Blog",
    body: "No posts yet. Add .md files under data/blogs by year/month/day.",
  },
} as const;

export const lifeCopy = {
  zh: {
    livelyPlain: `生活动态\n\n开启灵动模式时，动态正文会随指针绕排；地图与足迹图例区域不参与。`,
    momentsPageTitle: "生活动态",
    footprintHeading: "我的足迹",
    feedHeading: "动态",
    displayName: "墨站",
    scoreLabel: "足迹分",
    legendLong: "久居 · 5 分",
    legendTour: "旅游 · 3 分",
    legendPass: "经过 · 1 分",
    legendPlan: "计划旅游 · 0 分",
    legendNone: "未去",
    feedEmpty: "暂无动态。可在本地 data/life_photos/moments 添加，或使用发布页。",
    postLinkAria: "发布动态",
    avatarAlt: "头像",
    profileMeBadge: "我",
    profileAvatarHint: "你的个性签名",
    imagePreviewDialog: "图片预览",
    imagePreviewOpen: "查看大图",
    imagePreviewClose: "关闭",
  },
  en: {
    livelyPlain: `Life Moments\n\nWith Lively mode on, feed text reflows around the pointer; the map and footprint legend are excluded.`,
    momentsPageTitle: "Life Moments",
    footprintHeading: "Footprint",
    feedHeading: "Feed",
    displayName: "Inkpage",
    scoreLabel: "Score",
    legendLong: "Lived · 5 pts",
    legendTour: "Travel · 3 pts",
    legendPass: "Passed · 1 pt",
    legendPlan: "Planned · 0 pts",
    legendNone: "Not visited",
    feedEmpty: "No posts yet. Add under data/life_photos/moments or use the post page.",
    postLinkAria: "New post",
    avatarAlt: "Avatar",
    profileMeBadge: "Me",
    profileAvatarHint: "Your personal tagline",
    imagePreviewDialog: "Image preview",
    imagePreviewOpen: "View full image",
    imagePreviewClose: "Close",
  },
} as const;

/** 发布页 copy */
export const lifePostCopy = {
  zh: {
    title: "发布动态",
    secretLabel: "发布密钥",
    secretHint: "与服务端环境变量 LIFE_POST_SECRET 一致",
    textLabel: "文字",
    imagesLabel: "图片（最多 9 张）",
    scheduleModeLabel: "发布方式",
    scheduleImmediate: "立即发布",
    scheduleLater: "定时发布（7 天内）",
    scheduleTimeLabel: "发布时间",
    scheduleHint: "须晚于当前时间，且不超过 7 天",
    submit: "发布",
    success: "已保存",
    successScheduled: "已保存。将于 {time} 发布",
    unauthorized: "密钥错误",
  },
  en: {
    title: "New moment",
    secretLabel: "Post secret",
    secretHint: "Must match LIFE_POST_SECRET on the server",
    textLabel: "Text",
    imagesLabel: "Images (max 9)",
    scheduleModeLabel: "When to publish",
    scheduleImmediate: "Publish now",
    scheduleLater: "Schedule (within 7 days)",
    scheduleTimeLabel: "Publish time",
    scheduleHint: "Must be in the future, within 7 days",
    submit: "Publish",
    success: "Saved",
    successScheduled: "Saved. Scheduled for {time}.",
    unauthorized: "Invalid secret",
  },
} as const;
