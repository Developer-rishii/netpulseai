import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Building2, User, ArrowRight, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register as Provider — NetPulse AI" },
      {
        name: "description",
        content:
          "Create a NetPulse AI provider workspace. Onboard your network and start predicting congestion in minutes.",
      },
    ],
  }),
  component: RegisterPage,
});

const benefits = [
  "14-day free trial · no card required",
  "Connect up to 3 network sites instantly",
  "Dedicated onboarding engineer",
];

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      // Navigate to dashboard or home
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="// Provider Onboarding"
      title="Register as a Provider"
      subtitle="Spin up your operator workspace and start ingesting telemetry today."
      footer={
        <>
          Already have a workspace?{" "}
          <Link to="/login" className="font-medium text-cyan hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <ul className="mb-6 space-y-2">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border border-cyan/40 bg-cyan/10">
              <Check className="h-3 w-3 text-cyan" strokeWidth={3} />
            </span>
            {b}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Field
            icon={<User className="h-4 w-4" />}
            label="Full name"
            error={errors.name?.message as string}
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Jane Operator"
            autoComplete="name"
          />
          <Field
            icon={<Building2 className="h-4 w-4" />}
            label="Company"
            {...register("company")}
            type="text"
            placeholder="Acme Telecom"
            autoComplete="organization"
          />
        </div>

        <Field
          icon={<Mail className="h-4 w-4" />}
          label="Work email"
          error={errors.email?.message as string}
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          type="email"
          placeholder="you@operator.com"
          autoComplete="email"
        />

        <Field
          icon={<Lock className="h-4 w-4" />}
          label="Password"
          error={errors.password?.message as string}
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            }
          })}
          type={showPassword ? "text" : "password"}
          placeholder="At least 8 characters"
          autoComplete="new-password"
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

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-3.5 w-3.5 rounded border-border bg-input accent-cyan"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="text-cyan hover:underline">Terms</a> and{" "}
            <a href="#" className="text-cyan hover:underline">Privacy Policy</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan to-violet px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-[0_0_32px_-4px_color-mix(in_oklab,var(--cyan)_60%,transparent)] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create workspace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
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

const Field = (({ label, icon, rightSlot, error, ...props }: FieldProps) => {
  return (
    <div className="block">
      <span className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {error && <span className="text-destructive lowercase tracking-normal font-sans">{error}</span>}
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
});

