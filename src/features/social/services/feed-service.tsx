import { createClient } from "@/lib/supabase/client";

export async function fetchFeedPosts({ pageParam }: { pageParam?: string }) {
  const supabase = createClient();

  // Fetch the current user session safely on the client
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("get_posts_paginated", {
    cursor_border: pageParam ?? null,
    page_size: 10,
    current_user_id: user?.id ?? null, // Passes down user session state seamlessly
  });

  if (error) {
    console.error("Feed Fetch Error:", error);
    throw error;
  }

  return data;
}
