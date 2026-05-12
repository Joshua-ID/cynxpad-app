"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createNewDraft() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: "Untitled Story",
      status: "draft",
      slug: `draft-${Date.now()}`,
    })
    .select()
    .single();

  if (error) throw error;

  redirect(`/editor/${data.id}`);
}
