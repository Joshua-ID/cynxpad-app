"use client";
import Link from "next/link";
import { useUserStore } from "@/store/use-user-store";

export default function Navbar() {
  const { profile, role } = useUserStore();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          Cynx<span className="text-brand-orange">pad</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/explore"
            className="text-sm font-medium hover:text-brand-orange transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/marketplace"
            className="text-sm font-medium hover:text-brand-orange transition-colors"
          >
            Marketplace
          </Link>

          {role === "ghostwriter" && (
            <Link
              href="/dashboard/gigs"
              className="text-sm font-medium text-emerald-600"
            >
              My Gigs
            </Link>
          )}

          {!profile ? (
            <Link
              href="/login"
              className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              Get Started
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="h-8 w-8 rounded-full bg-zinc-200 border border-zinc-300"
            />
          )}
        </div>
      </div>
    </nav>
  );
}
