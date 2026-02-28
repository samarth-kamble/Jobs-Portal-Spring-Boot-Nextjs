"use client";

import {
  IconAt,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconUser,
  IconX,
  IconMailForward,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerUser, sendOtp, verifyEmail } from "../server/user-service";
import { signupSchema, type SignupFormData } from "../validations";

const form = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "APPLICANT" as const,
};

export const Signup = () => {
  const [data, setData] = useState<SignupFormData>(form);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const router = useRouter();

  // OTP verification state
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | string,
  ) => {
    if (typeof event === "string") {
      setData({ ...data, accountType: event as "APPLICANT" | "EMPLOYER" });
    } else {
      const name = event.target.name;
      const value = event.target.value;
      const newData = { ...data, [name]: value };
      setData(newData);

      // Real-time field validation
      const result = signupSchema.safeParse(newData);
      if (result.success) {
        setFormError({
          ...formError,
          [name]: "",
          ...(name === "password" ? { confirmPassword: "" } : {}),
        });
      } else {
        const fieldError = result.error.issues.find((i) => i.path[0] === name);
        setFormError({
          ...formError,
          [name]: fieldError ? fieldError.message : "",
          ...(name === "password" || name === "confirmPassword"
            ? {
                confirmPassword:
                  result.error.issues.find(
                    (i) => i.path[0] === "confirmPassword",
                  )?.message || "",
              }
            : {}),
        });
      }
    }
  };

  const handleSubmit = () => {
    const result = signupSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setFormError(fieldErrors);
      return;
    }

    setFormError({});
    setLoading(true);
    registerUser(data)
      .then(() => {
        setRegisteredEmail(data.email);
        setShowOtpStep(true);
        setResendTimer(60);
        setLoading(false);
        toast.success("Account created! Please verify your email.", {
          description: "An OTP has been sent to your email address.",
          icon: <IconMailForward size={18} />,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Registration failed!", {
          description:
            err.response?.data?.errorMessage ||
            "Something went wrong. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  // OTP input handling
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    verifyEmail(registeredEmail, otpCode)
      .then(() => {
        toast.success("Email verified successfully!", {
          description: "Redirecting to login page...",
          icon: <IconShieldCheck size={18} />,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      })
      .catch((err) => {
        setOtpLoading(false);
        toast.error("Verification failed!", {
          description:
            err.response?.data?.errorMessage ||
            "Invalid OTP. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtpLoading(true);
    sendOtp(registeredEmail)
      .then(() => {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setOtpLoading(false);
        toast.success("OTP resent successfully!", {
          description: "Check your email for the new OTP.",
          icon: <IconMailForward size={18} />,
        });
      })
      .catch(() => {
        setOtpLoading(false);
        toast.error("Failed to resend OTP. Please try again.");
      });
  };

  // OTP Verification Step
  if (showOtpStep) {
    return (
      <>
        {otpLoading && (
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
              <span className="text-sm text-muted-foreground">
                Verifying...
              </span>
            </div>
          </div>
        )}

        <div className="w-full h-full px-6 sm:px-10 md:px-16 py-8 sm:py-12 flex flex-col justify-center overflow-y-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 mb-4">
              <IconMailForward size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2 font-nunito">
              Verify Your Email
            </h2>
            <p className="text-muted-foreground text-sm">
              We've sent a 6-digit code to{" "}
              <span className="text-foreground font-semibold">
                {registeredEmail}
              </span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasteData = e.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    handleOtpChange(index, pasteData);
                  }}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-input/20 text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOtp}
              disabled={otpLoading || otp.join("").length !== 6}
              className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 font-semibold text-base text-primary-foreground"
              size="lg"
            >
              <IconShieldCheck size={20} className="mr-2" />
              Verify Email
            </Button>

            {/* Resend */}
            <div className="text-center">
              <span className="text-muted-foreground text-sm">
                Didn't receive the code?{" "}
                {resendTimer > 0 ? (
                  <span className="text-muted-foreground/70">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <span
                    onClick={handleResendOtp}
                    className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
                  >
                    Resend OTP
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <span className="text-sm text-muted-foreground">
              Creating account...
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-full px-6 sm:px-10 md:px-16 py-8 sm:py-12 flex flex-col justify-center overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2 font-nunito">
            Create Account
          </h2>
          <p className="text-muted-foreground text-sm">
            Fill in your details to get started
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Full Name <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconUser
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={data.name}
                onChange={handleChange}
                name="name"
                placeholder="Enter your full name"
                className="pl-9 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
            {formError.name && (
              <p className="text-xs text-destructive">{formError.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Email Address <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconAt
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
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
              <p className="text-xs text-destructive">{formError.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Password <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconLock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={data.password}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-9 pr-10 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
            {formError.password && (
              <p className="text-xs text-destructive">{formError.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Confirm Password <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconLock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={data.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="pl-9 pr-10 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
            {formError.confirmPassword && (
              <p className="text-xs text-destructive">
                {formError.confirmPassword}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label className="text-foreground/80 font-medium">
              Account Type <span className="text-primary">*</span>
            </Label>
            <div className="flex gap-3 mt-1">
              {["APPLICANT", "EMPLOYER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange(type)}
                  className={`flex-1 py-3 px-5 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer text-sm
                    ${
                      data.accountType === type
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/20 hover:border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="terms"
              className="text-muted-foreground text-sm cursor-pointer"
            >
              I accept the{" "}
              <span className="text-primary hover:text-primary/80 cursor-pointer transition-colors underline underline-offset-2">
                Terms and Conditions
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !termsAccepted}
            className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 mt-6 font-semibold text-base text-primary-foreground"
            size="lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <span className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <span
                onClick={() => {
                  router.push("/login");
                  setFormError(form);
                  setData(form);
                }}
                className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
              >
                Login here
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};;