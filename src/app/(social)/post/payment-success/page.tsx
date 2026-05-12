"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success">("verifying");

  const reference = searchParams.get("reference");
  const postId = searchParams.get("postId"); // We'll pass this in the callback URL

  useEffect(() => {
    // In a real app, we'd poll our DB to see if the webhook already
    // inserted the purchase. For now, we simulate a small delay.
    const timer = setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        if (postId) router.push(`/post/${postId}`);
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, postId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-reading-paper p-6 text-center">
      <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-sm border border-zinc-100">
        {status === "verifying" ? (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-brand-green" />
            <h2 className="mt-6 text-2xl font-bold">Verifying Payment...</h2>
            <p className="mt-2 text-zinc-500 font-serif italic">
              Please don't close this window.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-16 w-16 text-brand-green" />
            <h2 className="mt-6 text-2xl font-bold">Payment Confirmed!</h2>
            <p className="mt-2 text-zinc-500 font-serif italic">
              The ink is now yours. Redirecting...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
