import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — NetPulse AI" },
      {
        name: "description",
        content:
          "Sign in to your NetPulse AI workspace to access real-time telecom monitoring and AI congestion forecasts.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 403 && result.requiresVerification) {
        setRequiresVerification(true);
        setUserEmail(result.email);
        toast.info("Your account is not verified yet. Please enter the OTP sent to your email.");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      toast.success("Welcome back!");
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Navigate to dashboard
      navigate({ to: "/dashboard" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Verification failed");
      }

      toast.success("Account verified successfully!");
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate({ to: "/dashboard" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");

      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      toast.error("Could not resend OTP. Please try again.");
    }
  };

  if (requiresVerification) {
    return (
      <AuthShell
        eyebrow="// Security Verification"
        title="Verify your email"
        subtitle={`Please enter the 6-digit code sent to ${userEmail}.`}
        footer={
          <>
            Entered wrong email?{" "}
            <button onClick={() => setRequiresVerification(false)} className="font-medium text-cyan hover:underline">
              Go back
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 rounded-full bg-cyan/10 text-cyan mb-2">
            <ShieldCheck className="w-10 h-10" />
          </div>
          
          <div className="space-y-4 w-full flex flex-col items-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Enter verification code
            </span>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length < 6}
              className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan to-violet px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-[0_0_32px_-4px_color-mix(in_oklab,var(--cyan)_60%,transparent)] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Verify & Sign In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <button
              onClick={handleResendOtp}
              className="w-full py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-cyan transition-colors"
            >
              Resend Code
            </button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="// Operator Console"
      title="Sign in to NetPulse AI"
      subtitle="Access your network intelligence workspace."
      footer={
        <>
          New to NetPulse?{" "}
          <Link to="/register" className="font-medium text-cyan hover:underline">
            Request provider access
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field
          icon={<Mail className="h-4 w-4" />}
          label="Work email"
          error={errors.email?.message as string}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="you@operator.com"
          autoComplete="email"
        />

        <Field
          icon={<Lock className="h-4 w-4" />}
          label="Password"
          error={errors.password?.message as string}
          {...register("password", { required: "Password is required" })}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••••••"
          autoComplete="current-password"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground transition-colors hover:text-cyan"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-border bg-input text-cyan accent-cyan"
            />
            Keep me signed in
          </label>
          <a href="#" className="font-mono uppercase tracking-[0.16em] text-cyan hover:underline">
            Forgot?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan to-violet px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-[0_0_32px_-4px_color-mix(in_oklab,var(--cyan)_60%,transparent)] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-cyan/40 hover:bg-secondary"
        >
          <SsoIcon /> Continue with SSO
        </button>
      </form>
    </AuthShell>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  error?: string;
}

function Field({ label, icon, rightSlot, error, ...props }: FieldProps) {
  return (
    <div className="block">
      <span className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {error && (
          <span className="text-destructive lowercase tracking-normal font-sans">{error}</span>
        )}
      </span>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-cyan">
          {icon}
        </span>
        <input
          {...props}
          className="w-full rounded-md border border-border bg-input/60 px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30"
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
    </div>
  );
}

function SsoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
