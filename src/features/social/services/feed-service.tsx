import { createClient } from "@/lib/supabase/client";

export async function fetchFeedPosts({ pageParam }: { pageParam?: string }) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_posts_paginated", {
    // Ensure we explicitly pass null if pageParam is undefined
    cursor_border: pageParam ?? null,
    page_size: 10,
  });

  if (error) {
    console.error("Feed Fetch Error:", error);
    throw error;
  }
  return data;
}
