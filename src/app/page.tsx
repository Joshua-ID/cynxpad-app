import Link from "next/link";
import { ArrowRight, Banknote, NotebookPenIcon, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 selection:bg-orange-200">
      {/* 
        Minimal Navigation 
        (Replace with your <Navbar /> if you want the app nav here)
      */}
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="text-xl font-black tracking-tighter">Cynxpad.</div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 transition-colors"
          >
            Start writing
          </Link>
        </div>
      </header>

      <main>
        {/* HERO SECTION: Typography-led, no generic stock photos */}
        <section className="container mx-auto px-6 pb-24 pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl lg:text-8xl">
              Write it. <br className="hidden md:block" />
              <span className="text-zinc-400">Own it. </span>
              <span className="text-orange-600">Earn from it.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg text-zinc-600 font-serif leading-relaxed">
              The publishing platform designed for writers who want to build an
              audience and sell premium stories directly to their readers. No
              algorithmic suppression. Just your work.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group flex h-12 items-center gap-2 rounded-full bg-orange-600 px-8 text-sm font-bold text-white transition-all hover:bg-orange-700 hover:pr-6"
              >
                Create your space
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/feed"
                className="flex h-12 items-center rounded-full border border-zinc-300 bg-white px-8 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                Explore the feed
              </Link>
            </div>
          </div>
        </section>

        {/* 
          VALUE PROP: Asymmetrical or staggered instead of the boring 3-column grid 
        */}
        <section className="border-t border-zinc-200 bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                  <NotebookPenIcon className="h-5 w-5 text-zinc-900" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Distraction-free publishing
                </h3>
                <p className="text-sm text-zinc-500 font-serif leading-relaxed">
                  A clean, intuitive editor that gets out of your way. Write
                  your stories, format with ease, and hit publish.
                </p>
              </div>

              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <Banknote className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Direct Monetization
                </h3>
                <p className="text-sm text-zinc-500 font-serif leading-relaxed">
                  Paywall your best work. Set your own prices in Naira (₦) for
                  premium assets and stories, and get paid directly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                  <Users className="h-5 w-5 text-zinc-900" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Built-in Community
                </h3>
                <p className="text-sm text-zinc-500 font-serif leading-relaxed">
                  Every post feeds into a global timeline. Readers can like,
                  engage, and discover your catalog organically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MINIMAL CTA */}
        <section className="bg-zinc-900 py-24 text-center text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Ready to publish?
            </h2>
            <p className="mt-4 text-zinc-400 font-serif">
              Join Cynxpad today and start building your catalog.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-zinc-900 transition-transform hover:scale-105"
            >
              Get started for free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-[#F8F9FA] py-8 text-center text-sm text-zinc-500 font-serif">
        <p>© {new Date().getFullYear()} Cynxpad. All rights reserved.</p>
      </footer>
    </div>
  );
}
