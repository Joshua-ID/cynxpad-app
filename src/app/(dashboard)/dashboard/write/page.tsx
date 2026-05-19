/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Heading1, Heading2, Bold, Italic, List } from "lucide-react";
import { createPost } from "@/features/publishing/actions/post";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function WritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [contentJson, setContentJson] = useState('{"type":"doc","content":[]}');

  // Initialize Tiptap core safely with SSR safety flags
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false, // Fixes Next.js hydration / SSR mismatch errors completely
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-orange font-serif text-lg leading-relaxed text-zinc-800 outline-none min-h-[350px] max-w-none focus:outline-none focus:ring-0",
      },
    },
    onUpdate: ({ editor }) => {
      setContentJson(JSON.stringify(editor.getJSON()));
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("content", contentJson);
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-8 py-10 px-4"
    >
      {/* Top action navigation boundary */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold font-serif italic text-zinc-900">
          Drafting New Story
        </h1>
        <button
          type="submit"
          disabled={loading || !editor}
          className="rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Publish to Cynxpad"
          )}
        </button>
      </div>

      {/* Title Field Input */}
      <input
        name="title"
        type="text"
        placeholder="Title your masterpiece..."
        required
        className="w-full border-none bg-transparent p-0 text-4xl font-bold text-zinc-900 placeholder-zinc-200 focus:outline-none focus:ring-0 tracking-tight"
      />

      {/* Feed Excerpt Field Input */}
      <textarea
        name="excerpt"
        placeholder="Write a short, gripping excerpt for the feed..."
        required
        rows={2}
        className="w-full resize-none border-none bg-transparent p-0 font-serif italic text-lg text-zinc-500 placeholder-zinc-300 focus:outline-none focus:ring-0 leading-relaxed"
      />

      {/* MONETIZATION SETTINGS PANEL */}
      <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-900">
              Premium Access Gate
            </h4>
            <p className="text-xs text-zinc-400 font-serif mt-0.5">
              Require payment to view the full content of this post.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange accent-zinc-950 cursor-pointer"
          />
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 max-w-[200px] rounded-xl border bg-white px-3 py-2 shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
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

      {/* TIPTAP MULTI-STRUCTURAL EDITOR AREA */}
      <div className="border-t pt-4 space-y-4">
        {editor ? (
          <>
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-100 pb-3 text-zinc-500">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors ${editor.isActive("bold") ? "bg-zinc-100 text-zinc-900" : ""}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors ${editor.isActive("italic") ? "bg-zinc-100 text-zinc-900" : ""}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <div className="h-4 w-[1px] bg-zinc-200 mx-1" />
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-zinc-100 text-zinc-900" : ""}`}
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`p-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-zinc-100 text-zinc-900" : ""}`}
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors ${editor.isActive("bulletList") ? "bg-zinc-100 text-zinc-900" : ""}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <EditorContent editor={editor} />
          </>
        ) : (
          <div className="py-20 flex items-center justify-center text-zinc-400 gap-2 font-serif italic text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />{" "}
            Unrolling writing canvas...
          </div>
        )}
      </div>
    </form>
  );
}
