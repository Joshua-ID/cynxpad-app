"use client";
import AuthForm from "@/features/auth/components/auth-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-reading-paper">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-green to-brand-orange" />

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-zinc-100">
        <AuthForm />
        <p className="mt-8 text-center text-xs text-zinc-400 px-6">
          By continuing, you agree to Cynxpad's Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
