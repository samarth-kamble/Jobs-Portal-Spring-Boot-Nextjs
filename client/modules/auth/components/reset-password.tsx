"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  IconAt,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconRefresh,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { changePass, sendOtp, verfiyOtp } from "../server/user-service";
import { resetPasswordSchema } from "../validations";
import { toast } from "sonner";

interface ResetPasswordProps {
  opened: boolean;
  close: () => void;
}

function useCountdown(onTick: () => void, ms: number) {
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalId.current) return;
    intervalId.current = setInterval(onTick, ms);
  }, [onTick, ms]);

  const stop = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { start, stop };
}

export const ResetPassword = ({ opened, close }: ResetPasswordProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passError, setPassError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const { start, stop } = useCountdown(() => {
    setSeconds((s) => {
      if (s <= 1) {
        setResendLoader(false);
        stop();
        return 60;
      }
      return s - 1;
    });
  }, 1000);

  const handleSendOtp = () => {
    if (otpSending) return;
    setOtpSending(true);
    sendOtp(email)
      .then(() => {
        setOtpSent(true);
        toast.success("OTP sent successfully", { description: "Check your email and enter the OTP." });
        setOtpSending(false);
        setResendLoader(true);
        start();
      })
      .catch((err) => {
        setOtpSending(false);
        toast.error("OTP sending failed", {
          description: err.response?.data?.errorMessage || "Something went wrong. Please try again.",
        });
      });
  };

  const handleVerifyOtp = (otp: string) => {
    if (otp.length < 6) return;
    verfiyOtp(email, otp)
      .then(() => {
        toast.success("OTP Verified", { description: "Enter your new password." });
        setVerified(true);
      })
      .catch((err) => {
        toast.error("OTP verification failed", {
          description: err.response?.data?.errorMessage || "Invalid OTP. Please try again.",
        });
      });
  };

  const resendOtp = () => {
    if (resendLoader) return;
    handleSendOtp();
  };

  const changeEmail = () => {
    setOtpSent(false);
    setResendLoader(false);
    setSeconds(60);
    setVerified(false);
    stop();
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setPassError("");
    setOtpSent(false);
    setOtpSending(false);
    setVerified(false);
    setResendLoader(false);
    setSeconds(60);
    setShowPassword(false);
    stop();
    close();
  };

  const handleResetPassword = () => {
    if (resetLoading) return;
    const result = resetPasswordSchema.safeParse(password);
    if (!result.success) {
      setPassError(result.error.issues[0].message);
      return;
    }
    setResetLoading(true);
    changePass(email, password)
      .then(() => {
        setResetLoading(false);
        toast.success("Password Changed", { description: "Login with your new password." });
        handleClose();
      })
      .catch((err) => {
        setResetLoading(false);
        toast.error("Password reset failed", {
          description: err.response?.data?.errorMessage || "Something went wrong. Please try again.",
        });
      });
  };

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-popover border border-border text-foreground sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="bg-popover border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold font-nunito text-foreground">
            <IconShieldCheck className="text-primary" size={24} />
            Reset Password
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                !otpSent
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <IconMail size={16} />
            </div>
            <div
              className={`h-0.5 w-12 transition-all ${otpSent ? "bg-primary" : "bg-border"}`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                otpSent && !verified
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <span className="text-xs font-bold">OTP</span>
            </div>
            <div
              className={`h-0.5 w-12 transition-all ${verified ? "bg-primary" : "bg-border"}`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                verified
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <IconLock size={16} />
            </div>
          </div>

          {/* Email Input Section */}
          {!verified && (
            <div className="bg-muted/30 rounded-xl p-5 border border-border/50 space-y-3">
              <Label className="text-foreground/80 font-medium block">
                Email Address
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IconAt
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    placeholder="your.email@example.com"
                    disabled={otpSent}
                    className="pl-9 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground disabled:opacity-60"
                  />
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={email === "" || otpSent || otpSending}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                >
                  {otpSending && !otpSent ? "Sending..." : "Send OTP"}
                </Button>
              </div>
              {!otpSent && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconMail size={14} />
                  We&apos;ll send a verification code to your email
                </p>
              )}
            </div>
          )}

          {/* OTP Input Section */}
          {otpSent && !verified && (
            <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
              <div className="text-center mb-5">
                <p className="text-foreground/70 text-sm mb-1">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-primary font-semibold">{email}</p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} onComplete={handleVerifyOtp}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-11 h-12 bg-input/30 border-2 border-border focus-within:border-primary text-foreground font-bold text-lg rounded-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex gap-2 mt-5">
                <Button
                  variant="outline"
                  className="flex-1 border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                  disabled={resendLoader || otpSending}
                  onClick={resendOtp}
                >
                  <IconRefresh size={16} className="mr-1.5" />
                  {resendLoader ? `Resend in ${seconds}s` : "Resend OTP"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                  onClick={changeEmail}
                >
                  Change Email
                </Button>
              </div>
            </div>
          )}

          {/* New Password Section */}
          {verified && (
            <div className="bg-muted/30 rounded-xl p-5 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <IconShieldCheck className="text-green-500" size={18} />
                </div>
                <span className="text-foreground/70 text-sm font-medium">
                  Email verified! Set your new password
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground/80 font-medium">
                  New Password <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <IconLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      const result = resetPasswordSchema.safeParse(
                        e.target.value,
                      );
                      setPassError(
                        result.success ? "" : result.error.issues[0].message,
                      );
                    }}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
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
                {passError && (
                  <p className="text-xs text-destructive">{passError}</p>
                )}
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold"
                size="lg"
              >
                <IconShieldCheck size={18} className="mr-2" />
                {resetLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}

          {/* Security Note */}
          <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your security is our priority. The OTP is valid for 10 minutes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};