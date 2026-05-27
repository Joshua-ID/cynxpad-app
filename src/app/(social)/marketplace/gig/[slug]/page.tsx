export default async function GigDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch gig by slug from Supabase
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero: Title & Pricing */}
      <h1 className="text-4xl font-black mb-4">Gig Title</h1>
      <div className="flex gap-4 mb-8">
        <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold">
          ₦ Price
        </span>
        <span className="text-zinc-500 text-sm italic">
          Posted by Usernames
        </span>
      </div>

      {/* Content */}
      <article className="prose prose-zinc mb-12">
        <p>Detailed description of the ghostwriting services provided...</p>
      </article>

      {/* Footer CTA */}
      <button className="bg-brand-orange text-white px-8 py-3 rounded-full font-bold">
        Request Service
      </button>
    </main>
  );
}
