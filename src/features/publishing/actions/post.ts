"use server";
import { createClient } from "@/lib/supabase/server";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized to publish content.");

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const contentStr = formData.get("content") as string;
  const isPremium = formData.get("is_premium") === "true";
  const price = isPremium ? Number(formData.get("price")) : 0;

  // Generate clean slug: "My First Post" -> "my-first-post-1234"
  const cleanSlug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title,
      excerpt,
      slug: cleanSlug,
      content: JSON.parse(contentStr),
      status: "published",
      is_premium: isPremium,
      price,
    })
    .select("slug")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to insert post into database.");
  }

  return data.slug;
}
