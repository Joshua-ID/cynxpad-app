"use client";
import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EngagementBarProps {
  postId: string;
  initialLikes: number;
  initialComments: number; // Added tracking
  initialReposts: number; // Added tracking
  hasLiked: boolean;
  hasBookmarked: boolean;
  hasReposted: boolean;
}

export function EngagementBar({
  postId,
  initialLikes,
  initialComments,
  initialReposts,
  hasLiked: initialHasLiked,
  hasBookmarked: initialHasBookmarked,
  hasReposted: initialHasReposted,
}: EngagementBarProps) {
  const supabase = createClient();
  const [liked, setLiked] = useState(initialHasLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [bookmarked, setBookmarked] = useState(initialHasBookmarked);
  const [reposted, setReposted] = useState(initialHasReposted);
  const [repostsCount, setRepostsCount] = useState(initialReposts);

  async function toggleLike() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Log in to interact!");

    if (liked) {
      setLiked(false);
      setLikesCount((p) => Math.max(0, p - 1));
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      setLiked(true);
      setLikesCount((p) => p + 1);
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: user.id });
    }
  }

  async function toggleRepost() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Log in to repost!");

    if (reposted) {
      setReposted(false);
      setRepostsCount((p) => Math.max(0, p - 1));
      await supabase
        .from("reposts")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      setReposted(true);
      setRepostsCount((p) => p + 1);
      await supabase
        .from("reposts")
        .insert({ post_id: postId, user_id: user.id });
    }
  }

  async function toggleBookmark() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Log in to bookmark!");

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

  const scrollToComments = () => {
    document
      .getElementById("discussion")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-between border-t border-b border-zinc-100 py-3 text-zinc-500 max-w-2xl mx-auto px-2 my-6">
      <div className="flex items-center gap-6">
        {/* LIKES ACCUMULATOR */}
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${liked ? "text-red-500 font-bold" : ""}`}
        >
          <Heart
            className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="text-xs font-bold">{likesCount}</span>
        </button>

        {/* COMMENTS COUNTER DISPLAY */}
        <button
          onClick={scrollToComments}
          className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-bold">{initialComments}</span>
        </button>

        {/* REPOSTS ACCUMULATOR */}
        <button
          onClick={toggleRepost}
          className={`flex items-center gap-1.5 hover:text-green-500 transition-colors ${reposted ? "text-green-500 font-bold" : ""}`}
        >
          <Repeat2 className={`h-5 w-5 ${reposted ? "stroke-[2.5]" : ""}`} />
          <span className="text-xs font-bold">{repostsCount}</span>
        </button>
      </div>

      {/* BOOKMARK ACCUMULATOR */}
      <button
        onClick={toggleBookmark}
        className={`hover:text-brand-orange transition-colors ${bookmarked ? "text-brand-orange" : ""}`}
      >
        <Bookmark
          className={`h-5 w-5 ${bookmarked ? "fill-brand-orange text-brand-orange" : ""}`}
        />
      </button>
    </div>
  );
}
