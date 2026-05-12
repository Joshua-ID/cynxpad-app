import { createClient } from "@/lib/supabase/server";
import EditorShell from "@/features/publishing/components/editor-shell";
import { notFound } from "next/navigation";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await params in Next.js 15
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return <EditorShell postId={id} initialContent={post.content} />;
}
