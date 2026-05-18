"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContractWork(
  contractId: string,
  deliveryUrl: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contracts")
    .update({
      delivery_url: deliveryUrl,
      status: "completed",
    })
    .eq("id", contractId);

  if (error) throw error;

  revalidatePath("/dashboard/orders");
}
