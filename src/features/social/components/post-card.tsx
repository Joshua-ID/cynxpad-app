"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    created_at: string;
    author?: {
      username: string;
      avatar_url: string;
    };
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    user_has_liked?: boolean;
    user_has_bookmarked?: boolean;
    user_has_reposted?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const supabase = createClient();

  const [liked, setLiked] = useState(!!post.user_has_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [reposted, setReposted] = useState(!!post.user_has_reposted);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count || 0);
  const [bookmarked, setBookmarked] = useState(!!post.user_has_bookmarked);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Log in to like posts!");

    if (liked) {
      setLiked(false);
      setLikesCount((p) => Math.max(0, p - 1));
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      setLiked(true);
      setLikesCount((p) => p + 1);
      await supabase
        .from("likes")
        .insert({ post_id: post.id, user_id: user.id });
    }
  }

  async function handleRepost(e: React.MouseEvent) {
    e.preventDefault();
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
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      setReposted(true);
      setRepostsCount((p) => p + 1);
      await supabase
        .from("reposts")
        .insert({ post_id: post.id, user_id: user.id });
    }
  }

  async function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Log in to bookmark!");

    setBookmarked(!bookmarked);
    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("bookmarks")
        .insert({ post_id: post.id, user_id: user.id });
    }
  }

  return (
    <article className="group mb-4 rounded-xl border border-zinc-100 bg-white p-5 transition-all hover:border-brand-orange/20">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-100" />
        <div>
          <p className="text-sm font-bold">
            @{post.author?.username || "writer"}
          </p>
          <p className="text-xs text-zinc-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Link href={`/post/${post.slug}`}>
        <h2 className="mb-2 text-xl font-bold leading-tight group-hover:text-brand-orange">
          {post.title}
        </h2>
        <p className="mb-4 line-clamp-3 text-zinc-600 reading-text text-base">
          {post.excerpt || "Click to read the full story on Cynxpad..."}
        </p>
      </Link>

      <div className="flex items-center justify-between border-t border-zinc-50 pt-4 text-zinc-500">
        <div className="flex gap-6">
          {/* LIKE ACCUMULATOR */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 hover:text-brand-orange transition-colors ${liked ? "text-brand-orange font-bold" : ""}`}
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="text-xs">{likesCount}</span>
          </button>

          {/* COMMENTS ACCUMULATOR */}
          <Link
            href={`/post/${post.slug}#discussion`}
            className="flex items-center gap-1.5 hover:text-brand-green transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">{commentsCount}</span>
          </Link>

          {/* REPOSTS ACCUMULATOR */}
          <button
            onClick={handleRepost}
            className={`flex items-center gap-1.5 hover:text-blue-500 transition-colors ${reposted ? "text-blue-500 font-bold" : ""}`}
          >
            <Repeat2 className="h-5 w-5" />
            <span className="text-xs">{repostsCount}</span>
          </button>
        </div>

        <button onClick={handleBookmark}>
          <Bookmark
            className={`h-5 w-5 cursor-pointer hover:text-zinc-900 ${bookmarked ? "fill-brand-orange text-brand-orange" : ""}`}
          />
        </button>
      </div>
    </article>
  );
}
