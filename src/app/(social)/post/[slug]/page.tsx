/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PremiumGate } from "@/features/publishing/components/premium-gate";
import { EngagementBar } from "@/features/social/components/engagement-bar";
import { CommentsSection } from "@/features/social/components/comment-section";

// Quick, lightweight recursive helper to convert Tiptap JSON schema to clean JSX text
function renderTiptapContent(node: any): React.ReactNode {
  if (!node) return null;

  if (node.type === "text") {
    return node.text;
  }

  const children =
    node.content?.map((child: any, idx: number) => (
      <span key={idx}>{renderTiptapContent(child)}</span>
    )) || null;

  switch (node.type) {
    case "doc":
      return <div className="space-y-4">{children}</div>;
    case "paragraph":
      return (
        <p className="text-zinc-800 text-lg leading-relaxed font-serif">
          {children}
        </p>
      );
    case "heading":
      const Level = `h${node.attrs?.level || 2}` as any;
      return (
        <Level className="font-bold text-zinc-900 mt-6 mb-2 tracking-tight">
          {children}
        </Level>
      );
    default:
      return children;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Post Data along with its author
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles(username, full_name, avatar_url)
    `,
    )
    .eq("slug", slug)
    .single();

  if (!post) notFound();

  // 2. Parallel Engagements, Counts & Purchase Status Checks
  const [
    { count: likesCount },
    { count: commentsCount },
    { count: repostsCount },
    { data: userLike },
    { data: userBookmark },
    { data: userRepost },
    { data: purchase },
  ] = await Promise.all([
    // Total Counts
    supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id),
    supabase
      .from("reposts")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id),

    // Check individual interactions for current logged-in user
    user
      ? supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null },
    user
      ? supabase
          .from("bookmarks")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null },
    user
      ? supabase
          .from("reposts")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null },

    // Check premium purchase access status
    post.is_premium && user
      ? supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user.id)
          .eq("post_id", post.id)
          .maybeSingle()
      : { data: null },
  ]);

  const hasPurchased = !!purchase;
  const hasLiked = !!userLike;
  const hasBookmarked = !!userBookmark;
  const hasReposted = !!userRepost;

  // 3. Authorization Logic
  const showContent =
    !post.is_premium || hasPurchased || (user && user.id === post.author_id);

  // Normalize Tiptap structure out of string payloads if necessary
  const parsedContent =
    typeof post.content === "string" ? JSON.parse(post.content) : post.content;

  return (
    <article className="mx-auto max-w-2xl px-4 py-20 bg-reading-paper min-h-screen">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
          {post.title}
        </h1>

        {/* Author Bio Area */}
        <div className="mt-6 flex items-center gap-3 border-b border-zinc-100 pb-6">
          <div className="h-10 w-10 rounded-full bg-zinc-200" />
          <div>
            <p className="text-sm font-bold">
              @{post.author?.username || "writer"}
            </p>
            <p className="text-xs text-zinc-500">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {showContent ? (
        <>
          {/* Beautiful text layout utilizing the parser runtime */}
          <div className="prose prose-orange max-w-none mb-6">
            {renderTiptapContent(parsedContent)}
          </div>

          {/* Updated Engagement Bar with real database totals */}
          <EngagementBar
            postId={post.id}
            initialLikes={likesCount || 0}
            initialComments={commentsCount || 0}
            initialReposts={repostsCount || 0}
            hasLiked={hasLiked}
            hasBookmarked={hasBookmarked}
            hasReposted={hasReposted}
          />

          <CommentsSection postId={post.id} currentUserId={user?.id} />
        </>
      ) : (
        <PremiumGate
          price={post.price}
          postId={post.id}
          // onPurchase={() => {}}
        />
      )}
    </article>
  );
}
