"use server";
import { createClient } from "@/lib/supabase/server";

export async function createTransferRecipient(
  bankName: string,
  accountNum: string,
  accountName: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Create recipient on Paystack
  const response = await fetch("https://api.paystack.co/transferrecipient", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "nuban",
      name: accountName,
      account_number: accountNum,
      bank_code: "058", // Example: GTB. You'll need a bank list dropdown!
      currency: "NGN",
    }),
  });

  const resData = await response.json();

  if (resData.status) {
    // 2. Save recipient_code to our DB
    await supabase.from("payout_methods").upsert({
      user_id: user?.id,
      bank_name: bankName,
      account_number: accountNum,
      recipient_code: resData.data.recipient_code,
    });
  }
}
