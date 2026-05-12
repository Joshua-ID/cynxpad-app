"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/features/auth/actions/onboarding";
import { Check, PenTool, BookOpen, Briefcase } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboarding(role, username);
      router.push("/feed");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-reading-paper p-6">
      <div className="w-full max-w-md space-y-8">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Pick your path
              </h2>
              <p className="text-zinc-500 font-serif italic">
                How will you use Cynxpad?
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  id: "reader",
                  title: "Reader",
                  icon: BookOpen,
                  desc: "Discover stories & subscribe",
                },
                {
                  id: "writer",
                  title: "Creator",
                  icon: PenTool,
                  desc: "Publish & monetize your ink",
                },
                {
                  id: "ghostwriter",
                  title: "Ghostwriter",
                  icon: Briefcase,
                  desc: "Sell services to clients",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setRole(item.id);
                    setStep(2);
                  }}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 border-white bg-white shadow-sm hover:border-brand-orange transition-all text-left"
                >
                  <div
                    className={`p-3 rounded-xl bg-zinc-50 ${role === item.id ? "text-brand-orange" : "text-zinc-400"}`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Claim your handle
              </h2>
              <p className="text-zinc-500">This is how the world sees you.</p>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3.5 text-zinc-400 font-bold">
                @
              </span>
              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                }
                placeholder="username"
                className="w-full rounded-2xl border bg-white py-3.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange font-bold"
              />
            </div>

            <button
              disabled={loading || username.length < 3}
              onClick={handleFinish}
              className="w-full rounded-full bg-brand-orange py-4 font-bold text-white shadow-lg shadow-brand-orange/20 hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {loading ? "Finalizing..." : "Start Journey"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
