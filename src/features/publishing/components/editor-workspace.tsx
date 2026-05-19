/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Save, Sparkles, Lock, Eye } from "lucide-react";
import Link from "next/link";

interface EditorWorkspaceProps {
  authorId: string;
}

export function EditorWorkspace({ authorId }: EditorWorkspaceProps) {
  const router = useRouter();
  const supabase = createClient();

  // Core content states
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");

  // Paywall & Configuration configuration states
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("500"); // Base price default in Naira
  const [isSaving, setIsSaving] = useState(false);

  // Quick recursive helper simulating standard structured blocks for Tiptap structural normalization
  function generateTiptapJson(text: string) {
    const paragraphs = text.split("\n\n").filter((p) => p.trim() !== "");
    return {
      type: "doc",
      content: paragraphs.map((p) => ({
        type: "paragraph",
        content: [{ type: "text", text: p.trim() }],
      })),
    };
  }

  // Create clean URL slugs out of document titles
  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-"); // Replace multiple - with single -
  }

  async function handlePublish() {
    if (!title.trim())
      return alert("Please specify an engaging title before saving.");
    if (!bodyText.trim()) return alert("Your content canvas appears empty!");

    setIsSaving(true);
    try {
      const generatedSlug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;
      const structuredContent = generateTiptapJson(bodyText);

      const { error } = await supabase.from("posts").insert({
        title,
        slug: generatedSlug,
        content: JSON.stringify(structuredContent),
        is_premium: isPremium,
        price: isPremium ? parseFloat(price) : 0,
        author_id: authorId,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      router.push(`/post/${generatedSlug}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Something went wrong writing data records.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Editorial Navigation Ribbon */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <button
          onClick={handlePublish}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-orange disabled:opacity-50 transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving Workspace...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Publish Story
            </>
          )}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Composition Canvas */}
        <div className="lg:col-span-3 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
          <input
            type="text"
            placeholder="Title your masterpiece..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl md:text-4xl font-black text-zinc-900 placeholder-zinc-200 outline-none tracking-tight border-b border-transparent focus:border-zinc-100 pb-2 transition-colors"
          />

          {/* Inline formatting toolbelt hint */}
          <div className="flex items-center gap-2 py-1.5 px-3 bg-zinc-50 rounded-lg text-xs font-serif text-zinc-400 w-max">
            <Sparkles className="h-3 w-3 text-brand-orange" /> Separate clear
            thoughts with double spaces to create distinct reading paragraphs.
          </div>

          <textarea
            placeholder="Begin writing your dynamic narrative here..."
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={18}
            className="w-full text-lg text-zinc-800 placeholder-zinc-300 font-serif leading-relaxed outline-none resize-none min-h-[400px]"
          />
        </div>

        {/* Monetization & Access Side Settings */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-zinc-400" /> Monetization Settings
            </h3>

            <hr className="border-zinc-100" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <label className="text-sm font-bold text-zinc-800 block">
                  Premium Paywall
                </label>
                <span className="text-xs text-zinc-400 font-serif block mt-0.5">
                  Require Readers to unlock content via Paystack access.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange accent-zinc-950 mt-1 cursor-pointer"
              />
            </div>

            {isPremium && (
              <div className="pt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-semibold text-zinc-500">
                  Access Fee (₦)
                </label>
                <div className="relative rounded-xl border border-zinc-200 shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-sm font-bold text-zinc-400">₦</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl outline-none py-2 pl-8 pr-3 text-sm font-bold text-zinc-900 focus:ring-1 focus:ring-zinc-900 border-none"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-serif block">
                  Minimum transaction recommendation: ₦100
                </span>
              </div>
            )}
          </div>

          {/* Quick Realtime Preview Metrics Status Card */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-xs text-zinc-500 space-y-2">
            <h4 className="font-bold text-zinc-700 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Content Insights
            </h4>
            <p>
              Estimated reading length:{" "}
              <span className="font-semibold font-sans text-zinc-900">
                {Math.ceil(bodyText.split(/\s+/).filter(Boolean).length / 200)}{" "}
                min
              </span>
            </p>
            <p>
              Character inventory metrics:{" "}
              <span className="font-semibold font-sans text-zinc-900">
                {bodyText.length}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
