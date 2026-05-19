import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Plus,
  Lock,
  Globe,
  FileText,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Coins,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Ensures content metrics remain fully synchronized

export default async function DashboardPostsPage() {
  const supabase = await createClient();

  // Validate the creator's authorization status
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all posts from the current author
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, is_premium, price, created_at, excerpt")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading author records:", error.message);
  }

  // Fetch Trending Stories: Highest-engagement or newest high-tier posts across Cynxpad
  const { data: trendingPosts } = await supabase
    .from("posts")
    .select("title, slug, created_at, is_premium")
    .order("created_at", { ascending: false })
    .limit(4);

  // Compute live local metrics safely from the posts dataset array
  const totalStories = posts?.length || 0;
  const premiumStories = posts?.filter((p) => p.is_premium).length || 0;
  const monetizedValue =
    posts
      ?.filter((p) => p.is_premium)
      .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Top Header Controls Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Content Studio
          </h1>
          <p className="text-zinc-400 font-serif text-sm mt-1">
            Track deep analytic matrices, subscription blocks, and native draft
            histories.
          </p>
        </div>
        <Link
          href="/dashboard/write"
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all self-start shadow-sm"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Write New Story
        </Link>
      </div>

      {/* Analytics Dashboard Cards Row Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-600 border border-zinc-100/50">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total Stories
            </p>
            <h3 className="text-xl font-black text-zinc-900 mt-0.5">
              {totalStories}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Premium Assets
            </p>
            <h3 className="text-xl font-black text-zinc-900 mt-0.5">
              {premiumStories}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Catalog Value
            </p>
            <h3 className="text-xl font-black text-zinc-900 mt-0.5">
              ₦{monetizedValue.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Studio Two-Column Grid Hub Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Primary Catalog List Table (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-zinc-800 mb-2">
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Your Catalog Historical Feed
            </h2>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-zinc-100 text-zinc-400 mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                No stories active
              </h3>
              <p className="mt-1 text-xs text-zinc-400 font-serif max-w-xs mx-auto">
                Your writing directory is empty. Build high-conversion paywalled
                copy or public updates to begin.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="group rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2 text-xs">
                    {post.is_premium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-bold text-amber-700 border border-amber-200/40 scale-95 origin-left">
                        <Lock className="h-2.5 w-2.5" /> ₦
                        {post.price.toLocaleString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-2.5 py-0.5 font-semibold text-zinc-500 border border-zinc-200/40 scale-95 origin-left">
                        <Globe className="h-2.5 w-2.5" /> Free
                      </span>
                    )}
                    <span className="text-zinc-400 font-serif text-[11px]">
                      {new Date(post.created_at).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-900 group-hover:text-brand-orange transition-colors tracking-tight text-base leading-snug">
                    <Link href={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-zinc-400 font-serif italic line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href={`/post/${post.slug}`}
                    className="inline-flex items-center gap-1 rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-1.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Network-Wide Trending Hot Topics Column Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-800 mb-2">
            <TrendingUp className="h-4 w-4 text-brand-orange animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Trending on Cynxpad
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 space-y-4">
            {trendingPosts && trendingPosts.length > 0 ? (
              trendingPosts.map((trend, idx) => (
                <div
                  key={trend.slug}
                  className="flex items-start gap-3 border-b border-zinc-100 last:border-0 pb-3 last:pb-0"
                >
                  <span className="font-sans text-xl font-black text-zinc-200 leading-none w-5">
                    0{idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-800 hover:text-brand-orange transition-colors line-clamp-2 leading-tight">
                      <Link href={`/post/${trend.slug}`}>{trend.title}</Link>
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-serif">
                      <span>
                        {new Date(trend.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      {trend.is_premium && (
                        <span className="text-amber-600 font-sans font-bold text-[9px] bg-amber-50 px-1 rounded">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 font-serif italic">
                No trending conversations found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
