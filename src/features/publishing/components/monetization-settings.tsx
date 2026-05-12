/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { DollarSign, Lock, Unlock } from "lucide-react";

export function MonetizationSettings({
  onUpdate,
}: {
  onUpdate: (settings: any) => void;
}) {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-green flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Monetization
        </h3>
        <button
          onClick={() => setIsPremium(!isPremium)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPremium ? "bg-brand-green" : "bg-zinc-200"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPremium ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {isPremium ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
          <p className="text-xs text-zinc-500">
            Only subscribers or buyers can read this.
          </p>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <span className="text-sm font-bold">₦</span>
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-transparent text-sm outline-none"
              onChange={(e) =>
                onUpdate({ is_premium: true, price: e.target.value })
              }
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-zinc-400 italic">
          This post is free for everyone.
        </p>
      )}
    </div>
  );
}
