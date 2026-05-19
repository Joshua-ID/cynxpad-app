/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/features/marketplace/components/gig-card";

export const revalidate = 0; // Ensure fresh data on reload

export default async function MarketplacePage() {
  const supabase = await createClient();

  const { data: gigs, error } = await supabase
    .from("gigs")
    .select(
      `
      id,
      title,
      description,
      price,
      delivery_days,
      profiles:author_id(username, avatar_url)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <p>Could not initialize Marketplace records at this time.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          Writing Marketplace
        </h1>
        <p className="text-zinc-500 font-serif mt-1">
          Hire top copywriters, essayists, and storytellers directly for custom
          projects.
        </p>
      </div>

      {gigs?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
          <p className="text-sm font-medium text-zinc-400">
            No active service offers available yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gigs?.map((gig) => (
            <GigCard key={gig.id} gig={gig as any} />
          ))}
        </div>
      )}
    </div>
  );
}
