"use client";

import { useState } from "react";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAdmin } from "@/modules/admin/server/admin-service";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

export default function AddAdminPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      errorNotification("Validation Error", "All fields are required.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/;
    if (!passwordRegex.test(form.password)) {
      errorNotification(
        "Invalid Password",
        "Password must be 8-15 chars with upper, lower, digit, and special char."
      );
      return;
    }

    setSubmitting(true);
    createAdmin(form)
      .then(() => {
        successNotification("Admin Created", `New admin "${form.name}" has been created successfully.`);
        setForm({ name: "", email: "", password: "" });
      })
      .catch((err) => {
        const msg = err?.response?.data?.errorMessage || "Failed to create admin. Email may already exist.";
        errorNotification("Error", msg);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Add Admin</h1>
        <p className="text-muted-foreground">
          Create a brand new admin account. This does not promote any existing user.
        </p>
      </div>

      <div className="max-w-lg">
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">New Admin Account</h2>
              <p className="text-xs text-muted-foreground">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter admin name"
                className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 chars, upper, lower, digit, special"
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                8-15 characters with uppercase, lowercase, digit, and special character (@$!%*?&#)
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full font-bold py-2.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Admin Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <p className="text-xs text-destructive font-medium">
            ⚠️ This creates a completely new account with ADMIN privileges. The new admin will be able to manage users, jobs, and other admins.
          </p>
        </div>
      </div>
    </div>
  );
}
