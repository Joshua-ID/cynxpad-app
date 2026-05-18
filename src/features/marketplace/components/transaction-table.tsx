import { ArrowUpRight, BookOpen, Briefcase } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  title: string;
  amount: number;
  date: string;
}

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-zinc-400 italic">No transactions found yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <th className="pb-4 pt-0">Source</th>
            <th className="pb-4 pt-0">Title</th>
            <th className="pb-4 pt-0 text-right">Date</th>
            <th className="pb-4 pt-0 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="group transition-colors hover:bg-zinc-50/50"
            >
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 group-hover:bg-white transition-colors">
                    {t.type === "Story Sale" ? (
                      <BookOpen className="h-3.5 w-3.5" />
                    ) : (
                      <Briefcase className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-600">
                    {t.type}
                  </span>
                </div>
              </td>
              <td className="py-4">
                <p className="max-w-[180px] truncate text-sm font-medium text-zinc-900 md:max-w-xs">
                  {t.title}
                </p>
              </td>
              <td className="py-4 text-right">
                <p className="text-xs text-zinc-400">
                  {new Date(t.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </td>
              <td className="py-4 text-right">
                <p className="flex items-center justify-end gap-1 text-sm font-bold text-brand-green">
                  +₦{Number(t.amount).toLocaleString()}
                  <ArrowUpRight className="h-3 w-3" />
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
