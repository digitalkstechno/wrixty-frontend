"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { resetPassword } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const toast = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Password reset token is missing. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ token, password });
      toast.success(response.message || "Password reset successful! Please login.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to reset password. The link may have expired.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="New Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="bg-card-bg border-border-ui text-text-primary placeholder:text-text-secondary/50 focus:border-primary-teal"
      />

      <Input
        label="Confirm New Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        Reset Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
              Reset Password
            </h1>
            <p className="text-xs text-text-secondary font-semibold tracking-wider uppercase">
              Enter your new credentials below
            </p>
          </div>

          <Suspense fallback={<div className="text-sm text-text-secondary">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>

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
