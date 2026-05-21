export default function CreateGigPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-black mb-8">Create a New Service</h1>
      <form className="space-y-6">
        <input
          placeholder="Service Title (e.g., SEO Blog Post)"
          className="w-full border-b p-2 outline-none"
        />
        <textarea
          placeholder="Description of your writing process..."
          className="w-full border p-4 rounded-xl"
          rows={6}
        />
        <input
          type="number"
          placeholder="Price (₦)"
          className="w-full border-b p-2 outline-none"
        />
        <button className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold">
          Publish Gig
        </button>
      </form>
    </div>
  );
}
