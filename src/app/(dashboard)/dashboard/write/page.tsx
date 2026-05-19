/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { createPost } from "@/features/publishing/actions/posts";
import { Loader2, Eye, DollarSign } from "lucide-react";
import { createPost } from "@/features/publishing/actions/post";

export default function WritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [content, setContent] = useState('{"type":"doc","content":[]}'); // Tiptap JSON string

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("content", content);
    formData.append("is_premium", String(isPremium));

    try {
      const slug = await createPost(formData);
      router.push(`/post/${slug}`);
    } catch (err: any) {
      alert(err.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 py-10">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold font-serif italic">
          Drafting New Story
        </h1>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Publish to Cynxpad"
          )}
        </button>
      </div>

      <input
        name="title"
        type="text"
        placeholder="Title your masterpiece..."
        required
        className="w-full border-none bg-transparent text-4xl font-bold text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-0"
      />

      <textarea
        name="excerpt"
        placeholder="Write a short, gripping excerpt for the feed..."
        required
        rows={2}
        className="w-full resize-none border-none bg-transparent font-serif italic text-lg text-zinc-500 placeholder-zinc-300 focus:outline-none focus:ring-0"
      />

      {/* MONETIZATION SETTINGS PANEL */}
      <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-900">
              Premium Access Gate
            </h4>
            <p className="text-xs text-zinc-400">
              Require payment to view the full content of this post.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 rounded text-brand-orange focus:ring-brand-orange"
          />
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 max-w-[200px] rounded-xl border bg-white px-3 py-2">
            <span className="text-sm font-bold text-zinc-400">₦</span>
            <input
              name="price"
              type="number"
              placeholder="500"
              min="100"
              required
              className="w-full border-none p-0 text-sm font-bold text-zinc-900 focus:ring-0"
            />
          </div>
        )}
      </div>

      {/* PLACEHOLDER FOR TIPTAP EDITOR */}
      <div className="min-h-[400px] border-t pt-4">
        <textarea
          placeholder="Start pouring your ink here... (Hook up your Tiptap components editor here)"
          onChange={(e) =>
            setContent(
              JSON.stringify({
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: e.target.value }],
                  },
                ],
              }),
            )
          }
          className="w-full min-h-[300px] border-none bg-transparent font-serif text-lg leading-relaxed focus:outline-none focus:ring-0"
        />
      </div>
    </form>
  );
}
