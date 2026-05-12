"use server";

export async function initializeMilestonePayment(
  email: string,
  amount: number,
  milestoneId: string,
) {
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack uses Kobo/Cents
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`,
      metadata: {
        milestoneId,
      },
    }),
  });

  return await res.json();
}
