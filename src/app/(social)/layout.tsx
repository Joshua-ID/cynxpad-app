import Navbar from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TrendingUp, FileText, User, Lock, Coins } from "lucide-react";

// 1. Force Next.js to bypass the cache so stats sync in real-time
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch Personal Stats (Perfectly mirroring the Dashboard metrics)
  let totalStories = 0;
  let premiumStories = 0;
  let monetizedValue = 0;

  if (user) {
    const { data: userPosts } = await supabase
      .from("posts")
      .select("is_premium, price")
      .eq("author_id", user.id);

    if (userPosts) {
      totalStories = userPosts.length;
      premiumStories = userPosts.filter((p) => p.is_premium).length;
      monetizedValue = userPosts
        .filter((p) => p.is_premium)
        .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    }
  }

  // 3. Fetch Trending Stories exactly like the Dashboard post page
  const { data: trendingPosts } = await supabase
    .from("posts")
    .select("title, slug, created_at, is_premium")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      <Navbar />
      <div className="container mx-auto grid flex-1 grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr_300px]">
        {/* Left Sidebar: Profile Summary & Stats */}
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900">Your Stats</h3>
                <p className="text-xs text-zinc-400 font-serif">
                  Creator Dashboard
                </p>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <FileText className="h-4 w-4 text-brand-orange" /> Total
                    Stories
                  </div>
                  <span className="font-bold text-zinc-900">
                    {totalStories}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Lock className="h-4 w-4 text-amber-500" /> Premium Assets
                  </div>
                  <span className="font-bold text-zinc-900">
                    {premiumStories}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Coins className="h-4 w-4 text-emerald-500" /> Catalog Value
                  </div>
                  <span className="font-bold text-zinc-900">
                    ₦{monetizedValue.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/dashboard/posts"
                  className="mt-4 block w-full rounded-xl bg-zinc-50 py-2 text-center text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Manage Posts
                </Link>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 font-serif text-center py-2">
                Sign in to view your analytics.
              </p>
            )}
          </div>
        </aside>

        {/* Main Feed Content */}
        <main>{children}</main>

        {/* Right Sidebar: Recommended Writers & Trending */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-brand-orange animate-pulse" />
                <h3 className="font-bold text-zinc-900 text-sm">
                  Trending on Cynxpad
                </h3>
              </div>

              <div className="space-y-4">
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
                          <Link href={`/post/${trend.slug}`}>
                            {trend.title}
                          </Link>
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
        </aside>
      </div>
    </div>
  );
}
