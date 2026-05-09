import type { Metadata } from "next";

import { PostPageClient } from "./PostPageClient";

export const metadata: Metadata = {
  title: "发布动态",
  description: "Post a moment",
};

export default function LifePostPage() {
  return <PostPageClient />;
}
