"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { forgotPassword } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(""); // For easy testing in development if email fails

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetLink("");

    try {
      const response = await forgotPassword(email);
      toast.success(response.message);
      
      // If we got the test link back, we can display it so the user can easily copy/click it in local dev
      if (response.resetUrlForTesting) {
        setResetLink(response.resetUrlForTesting);
      } else {
        // If mail was successfully sent or no testing link returned, redirect to login
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to initiate password reset. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary-teal/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-secondary-cyan/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card-bg border border-border-ui p-10 rounded-lg shadow-soft text-center space-y-8">
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-lg bg-gradient-primary flex items-center justify-center font-black text-white text-xl shadow-md tracking-wider">
              WA
            </div>
            <h1 className="text-2xl font-black tracking-widest text-gradient-primary uppercase">
              Forgot Password
            </h1>
            <p className="text-xs text-text-secondary font-semibold tracking-wider uppercase">
              Enter your email to reset password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card-bg border-border-ui text-text-primary placeholder:text-text-secondary/50 focus:border-primary-teal"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              className="py-3"
            >
              Send Reset Link
            </Button>
          </form>

          {resetLink && (
            <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-lg text-left space-y-2">
              <p className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                Development Test Link:
              </p>
              <a 
                href={resetLink}
                className="text-xs font-semibold text-primary-teal hover:underline break-all block"
              >
                {resetLink}
              </a>
              <p className="text-[10px] text-zinc-500 italic">
                (Click or copy the link above to reset your password directly)
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-border-ui/50">
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-primary-teal transition-all flex items-center justify-center gap-2 mx-auto"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
