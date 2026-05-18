import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Cynxpad | The Ink of the Future",
  description: "A premium platform for writers, readers, and ghostwriters.",
  openGraph: {
    images: ["/og-image.png"],
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Mini Sidebar */}
      <aside className="w-64 border-r bg-white p-6 hidden md:block">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          Cynx<span className="text-brand-orange">pad</span>
        </Link>

        <nav className="mt-10 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/posts"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            My Posts
          </Link>
          <Link
            href="/dashboard/earnings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Earnings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
