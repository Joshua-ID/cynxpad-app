export function EarningsCard({ amount }: { amount: number }) {
  return (
    <div className="rounded-3xl border border-brand-green/10 bg-white p-8 shadow-sm overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-green/5" />

      <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
        Total Revenue
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-5xl font-bold tracking-tighter text-zinc-900">
          ₦{amount.toLocaleString()}
        </h2>
        <span className="text-brand-green font-bold text-sm">
          +12% this month
        </span>
      </div>

      <button className="mt-6 w-full rounded-xl bg-brand-green py-3 font-bold text-white hover:bg-opacity-90 transition-all">
        Withdraw to Bank
      </button>
    </div>
  );
}
