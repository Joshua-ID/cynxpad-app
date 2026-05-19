import Navbar from "@/components/layout/navbar";
import { StatsGrid } from "@/features/dashboard/components/starts-grid";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      <Navbar />
      <div className="container mx-auto grid flex-1 grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr_300px]">
        {/* Left Sidebar: Profile Summary */}
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-xl border bg-white p-4">
            <h3 className="font-bold">Your Stats</h3>
            {/* Stats list... */}
          </div>
        </aside>

        {/* Main Feed */}
        <main>{children}</main>

        {/* Right Sidebar: Recommended Writers & Trending */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border bg-white p-4">
              <h3 className="font-bold text-brand-orange">Trending Topics</h3>
              {/* Tags... */}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
