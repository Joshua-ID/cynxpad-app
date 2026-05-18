import { createClient } from "@/lib/supabase/server";
import { DollarSign, Landmark, TrendingUp } from "lucide-react";

export default async function EarningsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Calculate Total Earnings from COMPLETED contracts (where user is the seller)
  const { data: contracts } = await supabase
    .from("contracts")
    .select("amount")
    .eq("seller_id", user?.id)
    .eq("status", "completed");

  const totalBalance =
    contracts?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Earnings
        </h1>
        <p className="text-zinc-500 font-serif italic">
          Manage your revenue and bank transfers.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-zinc-900 p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Available Balance
          </p>
          <h2 className="mt-2 text-4xl font-black">
            ₦{totalBalance.toLocaleString()}
          </h2>
          <button className="mt-6 w-full rounded-full bg-brand-orange py-3 text-sm font-bold text-white hover:brightness-110 transition-all">
            Withdraw Funds
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-8">
          <TrendingUp className="h-6 w-6 text-brand-green mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Total Lifetime
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900">
            ₦{totalBalance.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-8">
          <Landmark className="h-6 w-6 text-zinc-400 mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Bank Account
          </p>
          <h2 className="mt-2 text-sm font-bold text-zinc-900">Not Linked</h2>
        </div>
      </div>
    </div>
  );
}
