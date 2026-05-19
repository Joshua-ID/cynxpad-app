/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { initializePostPurchase } from "../actions/payments";

interface PremiumGateProps {
  price: number;
  postId: string;
}

export function PremiumGate({ price, postId }: PremiumGateProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  async function handlePaymentInitiation() {
    setIsProcessing(true);
    try {
      console.log("Initiating purchase for post ID:", postId);
      const authorizationUrl = await initializePostPurchase(postId);
      console.log("Paystack response URL:", authorizationUrl);

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error("No authorization URL returned from Paystack.");
      }
    } catch (error: any) {
      console.error("Payment setup caught error:", error);

      // This will pop up the EXACT error message instead of the generic login text
      alert(
        `System Error: ${error.message || "Unknown error inside payment pipeline"}`,
      );

      setIsProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 text-center max-w-md mx-auto my-12 shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 mb-4 text-brand-orange">
        <Lock className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-bold text-zinc-900 mb-2">
        Premium Masterclass
      </h3>
      <p className="text-sm text-zinc-600 mb-6 font-serif max-w-xs mx-auto">
        Unlock premium content and join the discussions for this masterclass
        story.
      </p>

      <div className="border-t border-b border-zinc-100 py-3 mb-6 bg-white rounded-xl border px-4 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Access Fee
        </span>
        <span className="text-2xl font-black text-zinc-900">
          ₦{price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <button
        onClick={handlePaymentInitiation}
        disabled={isProcessing}
        className="w-full bg-brand-orange text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Opening Secure Gateway...
          </>
        ) : (
          "Unlock Access"
        )}
      </button>
    </div>
  );
}
