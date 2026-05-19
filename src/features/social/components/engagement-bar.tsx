"use client";

import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EngagementBarProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialReposts: number;
  hasLiked: boolean;
  hasBookmarked: boolean;
  hasReposted: boolean;
}

export function EngagementBar({
  postId,
  initialLikes,
  initialComments,
  initialReposts,
  hasLiked,
  hasBookmarked,
  hasReposted,
}: EngagementBarProps) {
  const supabase = createClient();
  const [liked, setLiked] = useState(hasLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [reposted, setReposted] = useState(hasReposted);
  const [repostsCount, setRepostsCount] = useState(initialReposts);
  const [bookmarked, setBookmarked] = useState(hasBookmarked);

  async function handleLike() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Please login to like this post.");

    setLiked(!liked);
    setLikesCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: user.id });
    }
  }

  async function handleRepost() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Please login to repost this.");

    setReposted(!reposted);
    setRepostsCount((prev) => (reposted ? Math.max(0, prev - 1) : prev + 1));

    if (reposted) {
      await supabase
        .from("reposts")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("reposts")
        .insert({ post_id: postId, user_id: user.id });
    }
  }

  async function handleBookmark() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Please login to bookmark this post.");

    setBookmarked(!bookmarked);

    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("bookmarks")
        .insert({ post_id: postId, user_id: user.id });
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-b border-zinc-100 py-4 my-8 text-zinc-500">
      <div className="flex gap-8">
        {/* Like Trigger */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors hover:text-brand-orange ${liked ? "text-brand-orange" : ""}`}
        >
          <Heart
            className={`h-5 w-5 ${liked ? "fill-brand-orange text-brand-orange" : ""}`}
          />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>

        {/* Comment Link Anchor */}
        <a
          href="#comments"
          className="flex items-center gap-2 transition-colors hover:text-zinc-800"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{initialComments}</span>
        </a>

        {/* Repost Trigger */}
        <button
          onClick={handleRepost}
          className={`flex items-center gap-2 transition-colors hover:text-green-600 ${reposted ? "text-green-600" : ""}`}
        >
          <Repeat2 className="h-5 w-5" />
          <span className="text-sm font-medium">{repostsCount}</span>
        </button>
      </div>

      {/* Bookmark Trigger */}
      <button
        onClick={handleBookmark}
        className={`transition-colors hover:text-zinc-800 ${bookmarked ? "text-brand-orange" : ""}`}
      >
        <Bookmark
          className={`h-5 w-5 ${bookmarked ? "fill-brand-orange text-brand-orange" : ""}`}
        />
      </button>
    </div>
  );
}
