/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import CynxpadEditor from "./cynxpad-editor";
import { createClient } from "@/lib/supabase/client";
import { useDebouncedCallback } from "use-debounce";

interface EditorShellProps {
  postId: string;
  initialContent: any;
}

export default function EditorShell({
  postId,
  initialContent,
}: EditorShellProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const supabase = createClient();

  // Debounce saving: Wait 1000ms after the user stops typing
  const debouncedSave = useDebouncedCallback(async (jsonContent: any) => {
    setSaveStatus("saving");

    const { error } = await supabase
      .from("posts")
      .update({
        content: jsonContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId);

    if (!error) {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }, 1000);

  return (
    <div className="min-h-screen bg-reading-paper">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-brand-orange">
            Cynxpad Editor
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            {saveStatus === "saving" && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {saveStatus === "saved" && (
              <Check className="h-3 w-3 text-brand-green" />
            )}
            <span>
              {saveStatus === "saving" ? "Saving..." : "Autosave active"}
            </span>
          </div>
        </div>

        <button className="rounded-full bg-brand-orange px-6 py-1.5 text-sm font-bold text-white hover:brightness-110 transition-all">
          Publish
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-16">
        <CynxpadEditor content={initialContent} onChange={debouncedSave} />
      </main>
    </div>
  );
}
