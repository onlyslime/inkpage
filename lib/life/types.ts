export type MomentMeta = {
  text: string;
  images: string[];
  /** ISO8601，缺省时由加载器用目录日期推断 */
  createdAt?: string;
  /** ISO8601，对访客可见时间；缺省表示立即发布（与 createdAt 一致） */
  publishAt?: string;
};

export type MomentRecord = {
  /** 用于图片 URL：moments/2026/04/11/01/xxx.jpg */
  relDir: string;
  meta: MomentMeta;
  /** 用于排序与显示，已解析为 Date */
  createdAt: Date;
};
