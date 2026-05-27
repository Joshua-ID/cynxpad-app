import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createClient();
  const category = searchParams.category || "All";

  // 1. Fetch Featured (The "Hero") - Only show latest if no specific category is filtered
  // If a category is selected, we prioritize the latest in that category.
  let heroQuery = supabase
    .from("posts")
    .select("*, author:profiles(username)")
    .eq("is_premium", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (category !== "All") {
    heroQuery = heroQuery.eq("category", category);
  }

  const { data: heroPost } = await heroQuery.maybeSingle();

  // 2. Fetch Latest Feed (The "Grid")
  let postsQuery = supabase
    .from("posts")
    .select("*, author:profiles(username)")
    .order("created_at", { ascending: false });

  if (category !== "All") {
    postsQuery = postsQuery.eq("category", category);
  }

  const { data: posts } = await postsQuery.limit(12);

  const categories = ["All", "Tech", "Fiction", "Advice"];

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      {heroPost && (
        <section className="mb-20">
          <div className="rounded-3xl bg-zinc-900 p-8 md:p-16 text-white shadow-2xl">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-4">
              <Flame className="h-4 w-4" /> Featured Premium
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              {heroPost.title}
            </h1>
            <p className="text-zinc-400 font-serif text-lg mb-8 max-w-2xl leading-relaxed">
              {heroPost.summary}
            </p>
            <Link
              href={`/post/${heroPost.slug}`}
              className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-full font-bold hover:bg-zinc-100 transition-colors"
            >
              Read Premium Story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <h2 className="text-2xl font-black">Latest Stories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/explore?category=${cat}`}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  category === cat
                    ? "bg-zinc-900 text-white shadow-md"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group block rounded-2xl p-6 border border-zinc-100 hover:border-zinc-200 transition-all hover:shadow-md bg-white"
              >
                <div className="h-40 bg-zinc-50 rounded-xl mb-6 group-hover:bg-zinc-100 transition-colors" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-brand-orange transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-500 font-serif line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span>{post.author?.username || "Writer"}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-400 font-serif italic">
            No stories found in this category.
          </div>
        )}
      </section>
    </main>
  );
}
