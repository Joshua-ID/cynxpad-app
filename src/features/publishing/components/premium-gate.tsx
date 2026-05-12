"use client";
import { Lock } from "lucide-react";

interface PremiumGateProps {
  price: number;
  postId: string;
  onPurchase: () => void;
}

export function PremiumGate({ price, onPurchase }: PremiumGateProps) {
  return (
    <div className="relative my-10 rounded-2xl border-2 border-dashed border-brand-green/30 bg-brand-green/5 p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white">
        <Lock className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-zinc-900">
        This story is for Premium Members
      </h3>
      <p className="mt-2 text-zinc-500 font-serif">
        Support the creator and unlock full access for just{" "}
        <b>₦{price.toLocaleString()}</b>
      </p>

      <button
        onClick={onPurchase}
        className="mt-8 rounded-full bg-brand-green px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand-green/20 hover:brightness-110 transition-all"
      >
        Unlock with Paystack
      </button>
    </div>
  );
}
