import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/features/marketplace/components/gig-card";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { MarketplaceFilters } from "@/features/marketplace/components/marketplace-filter";
// You will need to create this client component to handle URL updates

interface SearchParams {
  searchParams: {
    query?: string;
    category?: string;
  };
}

export default async function MarketplacePage({ searchParams }: SearchParams) {
  const supabase = await createClient();
  const query = searchParams?.query || "";
  const category = searchParams?.category || "";

  // 1. Build the Supabase query dynamically based on URL params
  let dbQuery = supabase
    .from("gigs")
    .select(`*, seller:profiles(username, avatar_url)`)
    .eq("is_active", true);

  if (query) {
    dbQuery = dbQuery.ilike("title", `%${query}%`);
  }

  if (category && category !== "all") {
    dbQuery = dbQuery.eq("category", category);
  }

  const { data: gigs, error } = await dbQuery.order("created_at", {
    ascending: false,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* HEADER & CTA */}
      <header className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">
            Writer Marketplace
          </h1>
          <p className="mt-2 text-zinc-500 font-serif text-lg">
            Hire top writing talent, or offer your own services.
          </p>
        </div>

        <Link
          href="/dashboard/gigs/new"
          className="flex h-11 items-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Create a Gig
        </Link>
      </header>

      {/* FILTERS & SEARCH */}
      <div className="mb-8">
        <MarketplaceFilters initialQuery={query} initialCategory={category} />
      </div>

      {/* RESULTS GRID */}
      {gigs && gigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-center p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200">
            <Search className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No gigs found</h3>
          <p className="mt-1 text-sm text-zinc-500 font-serif">
            We couldn't find any services matching your current filters.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 text-sm font-bold text-orange-600 hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  );
}
