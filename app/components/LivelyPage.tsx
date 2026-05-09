"use client";

import type { ReactNode } from "react";
import { TextEscapeBlock } from "./TextEscapeBlock";
import { useSite } from "./SiteProvider";

type LivelyPageProps = {
  /** 仅「小内容」纯文本：不要包含页面/章节大标题（见 lib/siteCopy 顶部约定） */
  livelyPlainText: string;
  children: ReactNode;
};

/**
 * 灵动开启时用 Pretext 排 livelyPlainText；关闭时渲染 children。
 * 大标题应放在本组件外单独用静态标题元素，不传入 livelyPlainText。
 */
export function LivelyPage({ livelyPlainText, children }: LivelyPageProps) {
  const { livelyMode, reducedMotion } = useSite();

  return (
    <TextEscapeBlock
      text={livelyPlainText}
      escapeMode={livelyMode}
      reducedMotion={reducedMotion}
    >
      {children}
    </TextEscapeBlock>
  );
}
