import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  DollarSign,
  BookOpen,
  ShoppingBag,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Ensure fresh analytic metrics on every visit

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Parallelize database aggregations for maximum speed
  const [
    { count: totalPosts },
    { data: purchaseRecords },
    { count: totalGigs },
    { data: recentPosts },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id),
    supabase
      .from("purchases")
      .select("amount_paid, created_at")
      .eq("user_id", user.id),
    supabase
      .from("gigs")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id),
    supabase
      .from("posts")
      .select("id, title, slug, price, is_premium, created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // 2. Calculate Gross Revenue (Converting Kobo accurately back to Naira base values)
  const totalEarnings =
    (purchaseRecords || []).reduce(
      (acc, curr) => acc + (Number(curr.amount_paid) || 0),
      0,
    ) / 100;

  const metricCards = [
    {
      name: "Gross Earnings",
      value: `₦${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      name: "Masterclass Stories",
      value: totalPosts || 0,
      icon: BookOpen,
      color: "text-brand-orange bg-orange-50",
    },
    {
      name: "Active Gigs",
      value: totalGigs || 0,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50",
    },
    {
      name: "Total Readers",
      value: purchaseRecords?.length || 0,
      icon: Users,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto min-h-screen bg-zinc-50/40">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          Creator Dashboard
        </h1>
        <p className="text-zinc-500 font-serif mt-1">
          Track your story performance, orders, and digital payouts.
        </p>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">
                  {card.name}
                </span>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-zinc-900 tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Stories & Monetization Quick Breakdown */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                Your Recent Content
              </h3>
              <p className="text-xs text-zinc-400 font-serif">
                Status tracking of your latest writeups
              </p>
            </div>
            <Link
              href="/create"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              Write New Post <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="py-3.5 flex items-center justify-between group"
                >
                  <div className="truncate max-w-md pr-4">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-sm font-bold text-zinc-900 hover:text-brand-orange transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <span className="text-xs text-zinc-400">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {post.is_premium ? (
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-brand-orange border border-brand-orange/10">
                        ₦{Number(post.price).toLocaleString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        Free Access
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-zinc-400 text-sm font-serif">
                You haven't written any masterclass stories yet.
              </div>
            )}
          </div>
        </div>

        {/* Account Quick Actions & Status Panel */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-4">
              Quick Management
            </h3>
            <div className="space-y-3">
              <Link
                href="/gigs"
                className="block w-full text-center rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                Manage Writing Services
              </Link>
              <Link
                href="/dashboard/orders"
                className="block w-full text-center rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                View Client Work Orders
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-400 font-serif">
            Logged in as:{" "}
            <span className="font-sans font-semibold text-zinc-700 block mt-0.5">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
