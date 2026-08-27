"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/Icons";
import { Toaster } from "@/components/ui";
import {
  getRememberedEmail,
  setRememberedEmail,
  setSession,
  signInUser,
  toast,
} from "@/lib/store";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEmail(getRememberedEmail());
  }, []);

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email address.";
    }
    if (!password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    setTimeout(() => {
      const res = signInUser(email, password);
      setBusy(false);
      if (!res.ok) {
        setErrors({ form: res.error });
        return;
      }
      if (remember) setRememberedEmail(email);
      else setRememberedEmail("");
      toast(`Welcome back, ${res.user.name.split(" ")[0]}!`, "success");
      router.push("/dashboard/overview");
    }, 450);
  };

  const social = (provider) => {
    const name = provider === "Google" ? "Alex Johnson" : "Jamie Rivera";
    setSession({
      id: "u-social-" + provider.toLowerCase(),
      name,
      email: `${provider.toLowerCase()}.demo@triverse.app`,
      createdAt: Date.now(),
      preferences: [],
    });
    toast(`Signed in with ${provider} (demo)`, "success");
    router.push("/dashboard/overview");
  };

  const forgot = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: "Enter your account email first." });
      return;
    }
    toast("Recovery link sent (demo) — check your inbox.", "info");
  };

  return (
    <div className="auth-wrap">
      <Toaster />
      <div className="auth-card">
        <div className="auth-logo">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <Icon name="plane" size={18} />
            </span>
            Triverse AI
          </Link>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-sub">
          Manage your autonomous AI travel agent and track your upcoming journeys.
        </p>

        <button className="social-btn" onClick={() => social("Google")}>
          <Icon name="google" size={18} strokeWidth={1.8} />
          Continue with Google
        </button>
        <div style={{ height: 10 }} />
        <button className="social-btn" onClick={() => social("Apple")}>
          <Icon name="apple" size={18} strokeWidth={1.8} />
          Continue with Apple
        </button>

        <div className="auth-or">OR</div>

        <form className="auth-form" onSubmit={submit} noValidate>
          {errors.form && (
            <p className="field-error" role="alert">
              {errors.form}
            </p>
          )}
          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <Icon name="mail" size={16} />
              <input
                id="email"
                className={`input with-icon ${errors.email ? "invalid" : ""}`}
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <Icon name="lock" size={16} />
              <input
                id="password"
                className={`input with-icon ${errors.password ? "invalid" : ""}`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <span className="field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className="auth-row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={forgot}>
              Forgot password?
            </button>
          </div>

          <button className="btn btn-dark btn-block" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
        </p>
        <p className="auth-switch">
          <Link href="/dashboard/overview" onClick={() => setSession({ id: "u-guest", name: "Guest traveler", email: "guest@triverse.app", createdAt: Date.now(), preferences: [] })}>
            Continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
