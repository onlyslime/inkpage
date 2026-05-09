import type { Metadata } from "next";

import { listFriendEntries } from "@/lib/friends";
import { FriendsPageClient } from "./FriendsPageClient";

export const metadata: Metadata = {
  title: "友链",
  description: "Friends links",
};

export default function FriendsPage() {
  const items = listFriendEntries();
  return <FriendsPageClient items={items} />;
}
