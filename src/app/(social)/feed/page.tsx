import InfiniteFeed from "@/features/social/components/feed";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Feed</h1>
        <p className="text-zinc-500 font-serif italic">
          Fresh ink from your favorite creators.
        </p>
      </header>

      <InfiniteFeed />
    </div>
  );
}
