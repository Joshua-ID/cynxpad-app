"use client";
import { useState } from "react";
import { createTransferRecipient } from "../actions/payouts";

export function PayoutForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createTransferRecipient(
        formData.get("bankName") as string,
        formData.get("accountNum") as string,
        formData.get("accountName") as string,
      );
      window.location.reload(); // Refresh to show the saved state
    } catch (err) {
      alert("Failed to save bank info. Please check the details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-zinc-500 leading-relaxed">
        Funds will be sent via Paystack to this account.
      </p>
      <input
        name="accountName"
        placeholder="Account Name"
        required
        className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-brand-orange focus:outline-none"
      />
      <input
        name="accountNum"
        placeholder="Account Number (10 digits)"
        maxLength={10}
        required
        className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-brand-orange focus:outline-none"
      />
      <select
        name="bankName"
        className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-brand-orange focus:outline-none"
      >
        <option value="GTBank">GTBank</option>
        <option value="Zenith Bank">Zenith Bank</option>
        <option value="Access Bank">Access Bank</option>
        <option value="Kuda Bank">Kuda Bank</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-brand-orange transition-all"
      >
        {loading ? "Verifying..." : "Link Bank Account"}
      </button>
    </form>
  );
}
