"use server";
import { createClient } from "@/lib/supabase/server"; // Ensure you have a server-client util
import { revalidatePath } from "next/cache";

export async function completeOnboarding(role: string, username: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({
      role,
      username,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) throw error;

  revalidatePath("/", "layout");
  return { success: true };
}
