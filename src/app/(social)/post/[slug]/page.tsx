import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PremiumGate } from "@/features/publishing/components/premium-gate";

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

  // 1. Fetch Post Data
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

  // 2. Check if user has purchased (if premium)
  let hasPurchased = false;
  if (post.is_premium && user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", post.id)
      .single();

    if (purchase) hasPurchased = true;
  }

  // 3. Logic: Show content or the Gate
  const showContent =
    !post.is_premium || hasPurchased || (user && user.id === post.author_id);

  return (
    <article className="mx-auto max-w-2xl px-4 py-20 bg-reading-paper min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
          {post.title}
        </h1>
        <div className="mt-6 flex items-center gap-3">
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
        <div className="prose prose-orange max-w-none reading-text leading-relaxed">
          {/* We'll render the JSON content from Tiptap here */}
          {typeof post.content === "string"
            ? post.content
            : JSON.stringify(post.content)}
        </div>
      ) : (
        <PremiumGate
          price={post.price}
          postId={post.id}
          onPurchase={() => {
            /* Logic for Paystack Redirect */
          }}
        />
      )}
    </article>
  );
}
