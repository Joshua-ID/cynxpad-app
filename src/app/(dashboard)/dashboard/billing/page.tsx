import { createClient } from "@/lib/supabase/server";
import { Landmark, History, Wallet, ArrowUpRight } from "lucide-react";
import { PayoutForm } from "@/features/marketplace/components/payout-form";
import { TransactionTable } from "@/features/marketplace/components/transaction-table";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Payout Method (Bank Info)
  const { data: bankInfo } = await supabase
    .from("payout_methods")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  // 2. Fetch Earnings
  const { data: contracts } = await supabase
    .from("contracts")
    .select("amount")
    .eq("seller_id", user?.id)
    .eq("status", "completed");

  // 1. Fetch Post Sales
  const { data: storySales } = await supabase
    .from("purchases")
    .select(
      `
      id,
      amount,
      created_at,
      post:posts!inner(title, author_id)
    `,
    )
    .eq("posts.author_id", user?.id);

  // 2. Fetch Gig Sales
  const { data: gigSales } = await supabase
    .from("contracts")
    .select(
      `
      id,
      amount,
      created_at,
      status,
      gig:gigs!inner(title, seller_id)
    `,
    )
    .eq("gigs.seller_id", user?.id)
    .eq("status", "completed");

  const allTransactions = [
    ...(storySales?.map((s) => {
      // Explicitly type the nested post object
      const postData = s.post as unknown as {
        title: string;
        author_id: string;
      } | null;
      return {
        id: s.id,
        type: "Story Sale",
        title: postData?.title || "Untitled Story",
        amount: s.amount,
        date: s.created_at,
      };
    }) || []),

    ...(gigSales?.map((g) => {
      // Explicitly type the nested gig object
      const gigData = g.gig as unknown as {
        title: string;
        seller_id: string;
      } | null;
      return {
        id: g.id,
        type: "Gig Delivery",
        title: gigData?.title || "Untitled Gig",
        amount: g.amount,
        date: g.created_at,
      };
    }) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const availableBalance =
    contracts?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Billing & Payouts
        </h1>
        <p className="text-zinc-500 font-serif italic">
          Manage your revenue and financial security.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* WALLET CARD */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-zinc-900 p-10 text-white shadow-xl shadow-zinc-200">
            <div className="flex items-center justify-between">
              <Wallet className="h-8 w-8 text-brand-orange" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Cynxpad Wallet
              </span>
            </div>
            <div className="mt-8">
              <p className="text-sm text-zinc-400">Available for Withdrawal</p>
              <h2 className="text-5xl font-black mt-1">
                ₦{availableBalance.toLocaleString()}
              </h2>
            </div>
            <button
              disabled={availableBalance <= 0}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange py-4 text-sm font-bold text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale"
            >
              Withdraw to Bank <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* TRANSACTION HISTORY PREVIEW */}

          <div className="rounded-3xl border border-zinc-100 bg-white p-8">
            <div className="flex items-center gap-2 mb-6 text-zinc-900 font-bold">
              <History className="h-5 w-5" />
              <h3>Transaction History</h3>
            </div>
            <TransactionTable transactions={allTransactions} />
          </div>
        </div>

        {/* BANK SETTINGS CARD */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-100 bg-white p-8">
            <div className="flex items-center gap-2 mb-6 text-zinc-900 font-bold">
              <Landmark className="h-5 w-5 text-brand-orange" />
              <h3>Payout Method</h3>
            </div>

            {bankInfo ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-400 uppercase">
                    Settlement Bank
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    {bankInfo.bank_name}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    **** {bankInfo.account_number.slice(-4)}
                  </p>
                </div>
                <button className="text-xs font-bold text-brand-orange hover:underline">
                  Change Bank Account
                </button>
              </div>
            ) : (
              <PayoutForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
