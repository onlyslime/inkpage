/**
 * 项目详情：正文正常叙述；协议、算法等术语首次出现用 Unicode 上标 ¹²³ 标记，释义放在 detail.footnotes，由页面底部「术语与注释」区列出。
 * 文案数据文件：`data/projects/<slug>/<slug>.json`（见 `loadProjectFile`）。同目录可放介绍视频等，由 `/api/projects/asset/<slug>/...` 提供。块类型含 `text` / `code` / `table`（`table` 为 JSON 行列，非 Markdown）。
 */

/** 可选：章节内外链（Botzone 等） */
export type ProjectSectionLink = {
  href: string;
  label: string;
};

/** 正文块：可多段，段落之间用 \n\n 分隔 */
export type ProjectTextBlock = { kind: "text"; text: string };

/** 源码块：紧跟对应讲解，caption 可省略 */
export type ProjectCodeBlock = { kind: "code"; caption?: string; code: string };

/** 表格块：列数由 headers 与各 row 长度一致；用于项目页结构化对照（非 Markdown） */
export type ProjectTableBlock = {
  kind: "table";
  headers: string[];
  rows: string[][];
  /** 表题，显示在表上方 */
  caption?: string;
};

export type SectionBlock = ProjectTextBlock | ProjectCodeBlock | ProjectTableBlock;

/** 项目详情：每节由 blocks 顺序组成（正文与源码可交替）；灵动正文仅收录 text 块 */
export type ProjectSection = {
  heading: string;
  blocks: SectionBlock[];
  links?: ProjectSectionLink[];
};

/** 文末脚注：n 与正文中的上标 ¹²³ 对应（最多建议用到两位数 ¹⁰，Unicode 组合） */
export type ProjectFootnote = {
  n: number;
  /** 完整释义，可含词条名 */
  body: string;
};

export type ProjectDetail = {
  metaDescription: string;
  sections: ProjectSection[];
  /** 可选：术语与协议释义，按 n 升序展示在页面底部 */
  footnotes?: ProjectFootnote[];
};

function blockToLivelyPlain(b: SectionBlock): string {
  if (b.kind === "text") return b.text;
  if (b.kind === "table") {
    const lines: string[] = [];
    if (b.caption) lines.push(b.caption);
    lines.push(b.headers.join(" | "));
    for (const row of b.rows) {
      lines.push(row.join(" | "));
    }
    return lines.join("\n");
  }
  return "";
}

function livelyPlainFromSections(sections: ProjectSection[]): string {
  return sections
    .map((s) =>
      s.blocks
        .map(blockToLivelyPlain)
        .filter(Boolean)
        .join("\n\n"),
    )
    .join("\n\n");
}

/** 供灵动模式：拼接各节正文与脚注为纯文本 */
export function livelyPlainFromDetail(d: ProjectDetail): string {
  let s = livelyPlainFromSections(d.sections);
  if (d.footnotes?.length) {
    const sorted = [...d.footnotes].sort((a, b) => a.n - b.n);
    s +=
      "\n\n" +
      sorted.map((f) => `${f.n}. ${f.body}`).join("\n\n");
  }
  return s;
}
