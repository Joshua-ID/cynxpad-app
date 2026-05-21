"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback } from "react";

const CATEGORIES = [
  "All",
  "Ghostwriting",
  "SEO",
  "Technical",
  "Copywriting",
  "Fiction",
];

export function MarketplaceFilters({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string;
  initialCategory: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create a URL query string handler
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "All" || value === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search services..."
          defaultValue={initialQuery}
          className="h-11 w-full rounded-full border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-500 transition-colors"
          onChange={(e) => {
            const query = e.target.value;
            router.push(`/marketplace?${createQueryString("query", query)}`);
          }}
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive =
            (initialCategory === "" && cat === "All") ||
            initialCategory === cat;

          return (
            <button
              key={cat}
              onClick={() =>
                router.push(
                  `/marketplace?${createQueryString("category", cat)}`,
                )
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
