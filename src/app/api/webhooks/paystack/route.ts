import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const hash = crypto
    .createHmac("sha512", process.env.NEXT_PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(body))
    .digest("hex");

  // Verify the signature comes from Paystack
  if (hash !== req.headers.get("x-paystack-signature")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();
  const { event, data } = body;

  if (event === "charge.success") {
    const { milestoneId, userId } = data.metadata;

    // 1. Update Milestone Status
    await supabase
      .from("milestones")
      .update({ status: "paid", paystack_ref: data.reference })
      .eq("id", milestoneId);

    // 2. Notify the Writer (Realtime)
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "payment_received",
      content: `Payment of ₦${data.amount / 100} confirmed!`,
    });
  }

  if (event === "charge.success") {
    const { postId, userId } = data.metadata;
    const amount = data.amount / 100;

    // Insert into the purchases table we created earlier
    const { error } = await supabase.from("purchases").insert({
      user_id: userId,
      post_id: postId,
      amount: amount,
    });

    if (error) console.error("Purchase record failed:", error);
  }

  if (event === "charge.success") {
    const { type, postId, gigId, userId } = data.metadata;

    if (type === "gig_purchase") {
      // Logic for Marketplace Gigs
      await supabase.from("contracts").insert({
        gig_id: gigId,
        client_id: userId,
        amount: data.amount / 100,
        status: "in_progress",
      });
    } else {
      // Logic for Premium Stories
      await supabase.from("purchases").insert({
        post_id: postId,
        user_id: userId,
        amount: data.amount / 100,
      });
    }
  }

  return NextResponse.json({ received: true });
}
