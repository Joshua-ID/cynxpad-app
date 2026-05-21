import Link from "next/link";

export default async function MyGigsPage() {
  // Fetch only this user's gigs
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black">My Services</h1>
        <Link
          href="/dashboard/gigs/new"
          className="text-sm font-bold text-brand-orange underline"
        >
          + New Gig
        </Link>
      </div>
      <div className="space-y-4">
        {/* Map through user's gigs with Edit/Delete buttons */}
        <div className="border p-4 rounded-2xl flex justify-between items-center">
          <span>Ghostwriting Service Title</span>
          <div className="flex gap-4 text-xs font-bold text-zinc-500">
            <button>Edit</button>
            <button className="text-rose-500">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
