"use client";

import React, { useState } from "react";
import { Input } from "../../components/common/Input";

export default function ProfileDetailsPage() {
  const [name, setName] = useState("Super Admin");
  const [email, setEmail] = useState("Superadmin@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setSuccess("Profile credentials updated successfully.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="space-y-1 text-left">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Superadmin Profile
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Configure security settings and admin credentials
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-md p-6 shadow-sm">
        {success && (
          <div className="mb-4 p-3 text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-wider rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5 mb-5">
            <div className="w-16 h-16 rounded-md bg-indigo-600 font-black text-white text-xl flex items-center justify-center shadow-lg uppercase">
              SA
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Super Admin Account
              </h4>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold">
                Primary Owner Role
              </p>
            </div>
          </div>

          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-900 mt-2">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow-sm transition-all"
          >
            Update Profile Setup
          </button>
        </form>
      </div>
    </div>
  );
}
