"use client";

import { IconAt, IconCheck, IconEye, IconEyeOff, IconLock, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../server/user-service";
import { setUser } from "../server/user-slice";
import { ResetPassword } from "./reset-password";
import { loginSchema, type LoginFormData } from "../validations";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const dispatch = useDispatch();

  const form = { email: "", password: "" };
  const [data, setData] = useState<LoginFormData>(form);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormError({ ...formError, [event.target.name]: "" });
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    if (loading) return;
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setFormError(fieldErrors);
      return;
    }

    setFormError(form);
    setLoading(true);
    loginUser(data)
      .then((res) => {
        toast.success("Login Success!", {
          description: "Redirecting to Home page...",
          icon: <IconCheck size={18} />,
        });
        setTimeout(() => {
          setLoading(false);
          dispatch(setUser(res));
          router.push("/");
        }, 4000);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Login failed!", {
          description: err.response?.data?.errorMessage || "Something went wrong. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-8 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Signing in...</span>
          </div>
        </div>
      )}

      <div className="w-full h-full px-6 sm:px-10 md:px-16 py-8 sm:py-12 flex flex-col justify-center">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 font-nunito">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">Sign in to continue your journey</p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Email Address <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconAt size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={data.email}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="your.email@example.com"
                className="pl-9 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
            {formError.email && (
              <p className="text-xs text-destructive mt-1">{formError.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Password <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={data.password}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-9 pr-10 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            {formError.password && (
              <p className="text-xs text-destructive mt-1">{formError.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              onClick={() => setResetOpen(true)}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 mt-6 font-semibold text-base text-primary-foreground"
            size="lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Signup Link */}
          <div className="text-center pt-4">
            <span className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => {
                  router.push("/signup");
                  setFormError(form);
                  setData(form);
                }}
                className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
              >
                Sign up now
              </span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-muted-foreground bg-card/40">
              Quick &amp; Secure Login
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-card/30 rounded-lg p-3 border border-border/50">
            <div className="text-xs text-muted-foreground">Trusted by</div>
            <div className="text-lg font-bold text-foreground">10K+ Users</div>
          </div>
          <div className="bg-card/30 rounded-lg p-3 border border-border/50">
            <div className="text-xs text-muted-foreground">Security</div>
            <div className="text-lg font-bold text-primary">100% Safe</div>
          </div>
        </div>
      </div>

      <ResetPassword opened={resetOpen} close={() => setResetOpen(false)} />
    </>
  );
};