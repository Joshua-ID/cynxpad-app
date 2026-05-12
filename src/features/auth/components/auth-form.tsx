"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  // Handle Magic Link Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Check your email for the magic link!",
      });
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Cynxpad
        </h1>
        <p className="text-sm text-zinc-500 font-serif italic">
          Where ink meets the internet.
        </p>
      </div>

      <div className="grid gap-4">
        {/* OAuth Buttons */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-lg border py-2.5 font-medium hover:bg-zinc-50 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Continue with Google"
          )}
        </button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleEmailLogin} className="grid gap-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="flex items-center justify-center rounded-lg bg-brand-orange py-2.5 font-bold text-white hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Send Magic Link"
            )}
          </button>
        </form>

        {/* Feedback Messages */}
        {message && (
          <div
            className={`rounded-lg p-3 text-sm text-center ${
              message.type === "success"
                ? "bg-green-50 text-brand-green border border-brand-green/20"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
