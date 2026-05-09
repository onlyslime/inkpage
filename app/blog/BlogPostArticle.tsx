"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LivelyPage } from "../components/LivelyPage";

const bodyClassName =
  "mt-8 space-y-6 text-base leading-8 text-muted-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:first:mt-8 [&_p]:mt-4 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-8 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-8 [&_li]:mt-2 [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-border [&_th]:bg-muted/40 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2";

type Props = {
  title: string;
  body: string;
  /** 与 body 对应的纯文本，不含 h1 标题；灵动开启时参与绕排 */
  livelyPlain: string;
};

export function BlogPostArticle({ title, body, livelyPlain }: Props) {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <LivelyPage livelyPlainText={livelyPlain}>
        <div className={bodyClassName}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </LivelyPage>
    </>
  );
}
