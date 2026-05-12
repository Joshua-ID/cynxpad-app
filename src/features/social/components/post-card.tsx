import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";

export function PostCard({ post }: { post: any }) {
  return (
    <article className="group mb-4 rounded-xl border border-zinc-100 bg-white p-5 transition-all hover:border-brand-orange/20">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-100" />{" "}
        {/* Avatar Placeholder */}
        <div>
          <p className="text-sm font-bold">@username</p>
          <p className="text-xs text-zinc-500">2 hours ago</p>
        </div>
      </div>

      <Link href={`/post/${post.slug}`}>
        <h2 className="mb-2 text-xl font-bold leading-tight group-hover:text-brand-orange">
          {post.title}
        </h2>
        <p className="mb-4 line-clamp-3 text-zinc-600 reading-text text-base">
          {post.excerpt || "Click to read the full story on Cynxpad..."}
        </p>
      </Link>

      <div className="flex items-center justify-between border-t border-zinc-50 pt-4 text-zinc-500">
        <div className="flex gap-6">
          <button className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
            <Heart className="h-5 w-5" /> <span className="text-xs">1.2k</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-brand-green transition-colors">
            <MessageCircle className="h-5 w-5" />{" "}
            <span className="text-xs">42</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
            <Repeat2 className="h-5 w-5" />
          </button>
        </div>
        <Bookmark className="h-5 w-5 hover:text-zinc-900 cursor-pointer" />
      </div>
    </article>
  );
}
