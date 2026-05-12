import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/features/marketplace/components/gig-card";

export default async function MarketplacePage() {
  const supabase = await createClient();

  const { data: gigs } = await supabase
    .from("gigs")
    .select(`*, seller:profiles(username, avatar_url)`)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Ghostwriter Marketplace
        </h1>
        <p className="mt-2 text-zinc-500 font-serif italic">
          Hire the world's best writing talent for your next project.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs?.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </div>
    </div>
  );
}
