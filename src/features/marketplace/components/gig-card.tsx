/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { User, Briefcase, Loader2 } from "lucide-react";
import { initializeGigPurchase } from "@/features/publishing/actions/payments";

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: number;
    delivery_days: number;
    profiles?: {
      username: string;
      avatar_url: string;
    };
  };
}

export function GigCard({ gig }: GigCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleHireWriter() {
    setLoading(true);
    try {
      const checkoutUrl = await initializeGigPurchase(gig.id);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      alert(error.message || "Failed to initialize custom hire order.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-brand-orange/30">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
          <User className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-zinc-400">Professional Writer</p>
          <p className="text-sm font-bold text-zinc-800">
            @{gig.profiles?.username || "cynx-expert"}
          </p>
        </div>
      </div>

      <h3 className="mb-2 text-lg font-bold text-zinc-900 leading-snug">
        {gig.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-zinc-500 font-serif">
        {gig.description}
      </p>

      <div className="mb-5 flex items-center justify-between rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">
        <span className="flex items-center gap-1.5 font-medium">
          <Briefcase className="h-3.5 w-3.5 text-zinc-400" />{" "}
          {gig.delivery_days} Days Delivery
        </span>
        <span className="text-base font-black text-zinc-900">
          ₦{Number(gig.price).toLocaleString("en-US")}
        </span>
      </div>

      <button
        onClick={handleHireWriter}
        disabled={loading}
        className="w-full rounded-lg bg-zinc-950 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-orange disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Configuring Order Pipeline...
          </>
        ) : (
          "Hire This Writer"
        )}
      </button>
    </div>
  );
}
