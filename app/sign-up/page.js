"use client";

import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icons";
import { Toaster } from "@/components/ui";
import { createUser, setSession, toast } from "@/lib/store";

const strengthOf = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH = [
  { label: "Too weak", color: "#e13b50" },
  { label: "Fair", color: "#f5a623" },
  { label: "Good", color: "#f5a623" },
  { label: "Strong", color: "#17b26a" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const strength = strengthOf(password);

  const validate = () => {
    const e = {};
    if (name.trim().length < 2) e.name = "Tell us your name (min 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email address.";
    }
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    setTimeout(() => {
      const res = createUser({ name, email, password });
      setBusy(false);
      if (!res.ok) {
        setErrors({ form: res.error });
        return;
      }
      toast(`Account created — welcome to Triverse, ${res.user.name.split(" ")[0]}!`, "success");
      router.push("/dashboard/overview");
    }, 450);
  };

  const social = (provider) => {
    const nm = provider === "Google" ? "Alex Johnson" : "Jamie Rivera";
    setSession({
      id: "u-social-" + provider.toLowerCase(),
      name: nm,
      email: `${provider.toLowerCase()}.demo@triverse.app`,
      createdAt: Date.now(),
      preferences: [],
    });
    toast(`Account created with ${provider} (demo)`, "success");
    router.push("/dashboard/overview");
  };

  return (
    <div className="auth-wrap">
      <Toaster />
      <div className="auth-card">
        <div className="auth-logo">
          <Link href="/">
            <BrandLogo height={42} showTagline />
          </Link>
        </div>
        <h1>Create your account</h1>
        <p className="auth-sub">
          Set up your traveler profile so Atlas Agent can plan around your style.
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
            <label htmlFor="name">Full Name</label>
            <div className="input-wrap">
              <Icon name="user" size={16} />
              <input
                id="name"
                className={`input with-icon ${errors.name ? "invalid" : ""}`}
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <span className="field-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>
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
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <span className="field-error" role="alert">
                {errors.password}
              </span>
            )}
            {password && (
              <>
                <div className="strength" aria-hidden="true">
                  <span
                    style={{
                      width: `${(strength / 4) * 100}%`,
                      background: STRENGTH[strength]?.color || "#e13b50",
                    }}
                  />
                </div>
                <span className="strength-lbl">
                  Password strength: {STRENGTH[strength]?.label || "Too weak"}
                </span>
              </>
            )}
          </div>

          <button className="btn btn-dark btn-block" type="submit" disabled={busy}>
            {busy ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
