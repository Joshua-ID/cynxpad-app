"use server";
import { createClient } from "@/lib/supabase/server";

export async function initializePostPurchase(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Please login to purchase");

  // 1. Fetch the post details FIRST to get the price AND the slug
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("price, title, slug") // Ensure slug is selected here
    .eq("id", postId)
    .single();

  // 2. Guard clause: Check if the post actually exists
  if (postError || !post) {
    console.error("Post fetch error:", postError);
    throw new Error("Could not find the post you are trying to buy.");
  }

  // 3. Initialize Paystack now that 'post' is guaranteed to exist
  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: post.price * 100, // Paystack uses Kobo
        // We use post.slug so the success page knows where to redirect
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/post/payment-success?postId=${post.slug}`,
        metadata: {
          postId: postId,
          userId: user.id,
        },
      }),
    },
  );

  const resData = await response.json();

  if (!resData.status) {
    throw new Error(resData.message || "Failed to initialize payment");
  }

  return resData.data.authorization_url;
}

export async function initializeGigPurchase(gigId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Please login to hire a writer");

  // Fetch Gig details to get price and title
  const { data: gig, error } = await supabase
    .from("gigs")
    .select("price, title")
    .eq("id", gigId)
    .single();

  if (error || !gig) throw new Error("Gig not found");

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Number(gig.price) * 100, // Convert to Kobo
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`,
        metadata: {
          gigId: gigId,
          type: "gig_purchase",
          userId: user.id,
        },
      }),
    },
  );

  const resData = await response.json();
  if (!resData.status) throw new Error(resData.message);

  return resData.data.authorization_url;
}
