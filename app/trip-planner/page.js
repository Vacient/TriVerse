"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import Icon from "@/components/Icons";
import Scene from "@/components/Scene";
import { Toaster } from "@/components/ui";
import {
  DEFAULT_PREFERENCES,
  DESTINATIONS,
  LOCATIONS,
  PREFERENCES,
  getDestination,
  placeLabel,
} from "@/lib/data";
import { money } from "@/lib/engine";
import { getSession } from "@/lib/store";

function todayPlus(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function TripPlanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const [form, setForm] = useState({
    originId: "yangon",
    destinationId: "bangkok",
    startDate: todayPlus(14),
    days: 5,
    budget: 350,
    travelers: 1,
    preferences: [...DEFAULT_PREFERENCES],
  });
  const [budgetError, setBudgetError] = useState(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return DESTINATIONS.slice(0, 5);
    return DESTINATIONS.filter((d) =>
      (d.city + " " + d.country).toLowerCase().includes(needle)
    ).slice(0, 5);
  }, [q]);

  const pickDestination = (id) => {
    setForm((f) => ({
      ...f,
      destinationId: id,
      originId: f.originId === id ? "bangkok" : f.originId,
    }));
    setQ("");
    setShowSearch(false);
  };

  // Preselect a destination when arriving from a "Plan a trip" entry point,
  // e.g. /trip-planner?to=tokyo. Keep both pickers valid on collision.
  useEffect(() => {
    const to = searchParams.get("to");
    if (to && getDestination(to)) {
      setForm((f) => ({
        ...f,
        destinationId: to,
        originId: f.originId === to ? "bangkok" : f.originId,
      }));
    }
    setReady(true);
  }, [searchParams]);

  const dest = getDestination(form.destinationId);

  const togglePref = (id) => {
    setForm((f) => ({
      ...f,
      preferences: f.preferences.includes(id)
        ? f.preferences.filter((p) => p !== id)
        : f.preferences.length >= 4
          ? [...f.preferences.slice(1), id]
          : [...f.preferences, id],
    }));
  };

  const planTrip = () => {
    if (form.budget < 100) {
      setBudgetError(true);
      document.getElementById("budget-input")?.focus();
      return;
    }
    const draft = {
      ...form,
      destinationId: dest.id,
      preferences: form.preferences.length ? form.preferences : [...DEFAULT_PREFERENCES],
    };
    sessionStorage.setItem("triverse:draft", JSON.stringify(draft));
    router.push("/plan");
  };

  return (
    <div>
      <Toaster />

      {/* ---------- Navbar ---------- */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            <BrandLogo height={28} />
          </Link>

          <div className="nav-search" ref={searchRef}>
            <div className="input-wrap">
              <Icon name="search" size={17} />
              <input
                className="input with-icon"
                type="text"
                placeholder="Where do you want to go?"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                aria-label="Search destinations"
              />
            </div>
            {showSearch && (
              <div className="search-pop">
                {matches.map((d) => (
                  <button key={d.id} onClick={() => pickDestination(d.id)}>
                    <span className="flag">{d.flag}</span>
                    <span>
                      {placeLabel(d)}
                      <span className="sub"> — {d.tagline}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="nav-actions">
            <Link
              href="/dashboard/agent"
              className="icon-btn nav-bell"
              aria-label="Agent notifications"
            >
              <Icon name="bell" size={20} />
            </Link>
            {session ? (
              <Link href="/dashboard/overview" className="avatar" aria-label="Open dashboard">
                {session.name.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link href="/sign-in" className="btn btn-dark btn-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ---------- Planner header ---------- */}
      <section className="planner-page">
        <div className="container planner-wrap">
          <div className="planner-head">
            <span className="tag">
              <span className="spark">
                <Icon name="sparkles" size={14} />
              </span>
              YOUR AI TRAVEL PLANNER
            </span>
            <h1 className="planner-title">
              Plan your trip
              <br />
              <span className="purple">in under a minute</span>
            </h1>
            <p className="planner-sub">
              Tell us where you want to go, your budget, and what you love — our AI
              handles flights, hotels, and a day-by-day itinerary. No spreadsheets, no stress.
            </p>
          </div>

          {/* ---------- Planner card ---------- */}
          <div className="trip-card" id="planner">
            {!ready ? (
              <div className="skeleton" style={{ height: 480, borderRadius: "var(--radius-xl)" }} />
            ) : (
              <>
                <div className="trip-card-photo">
                  {dest.image ? (
                    <img className="scene" src={dest.image} alt={placeLabel(dest)} />
                  ) : (
                    <Scene type={dest.scene || "city-night"} className="scene" />
                  )}
                  <div className="overlay">
                    <h3>Where to next?</h3>
                    <p style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                      Pick a destination, set your budget, and go
                    </p>
                  </div>
                  <span className="trip-card-days">{form.days} Days</span>
                </div>

                <div className="trip-card-body">
                  <div className="route">
                    <div className="end from">
                      <span className="micro muted">From</span>
                      <span className="city">
                        <select
                          className="input select"
                          style={{ padding: "6px 30px 6px 10px", fontSize: 13, fontWeight: 700 }}
                          value={form.originId}
                          onChange={(e) => {
                            const originId = e.target.value;
                            setForm((f) => ({
                              ...f,
                              originId,
                              // Keep both pickers valid: swap when the selection collides.
                              destinationId:
                                f.destinationId === originId ? f.originId : f.destinationId,
                            }));
                          }}
                          aria-label="Origin city"
                        >
                          {LOCATIONS.filter((l) => l.id !== form.destinationId).map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.flag} {placeLabel(l)}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                      <span className="line" />
                      <span className="plane">
                        <Icon name="plane" size={17} />
                      </span>
                      <span className="line" />
                    </div>
                    <div className="end to">
                      <span className="micro muted">Destination</span>
                      <span className="city">
                        <select
                          className="input select"
                          style={{
                            padding: "6px 30px 6px 10px",
                            fontSize: 13,
                            fontWeight: 700,
                            maxWidth: 170,
                          }}
                          value={form.destinationId}
                          onChange={(e) => {
                            const destinationId = e.target.value;
                            setForm((f) => ({
                              ...f,
                              destinationId,
                              // Keep both pickers valid: swap when the selection collides.
                              originId: f.originId === destinationId ? f.destinationId : f.originId,
                            }));
                          }}
                          aria-label="Destination city"
                        >
                          {LOCATIONS.filter((l) => l.id !== form.originId).map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.flag} {placeLabel(l)}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>
                  </div>

                  <div className="mini-grid">
                    <div className="mini-card">
                      <span className="ic">
                        <Icon name="dollar" size={18} />
                      </span>
                      <div>
                        <div className="micro muted">Budget</div>
                        <div className="v mono">{money(form.budget)}</div>
                      </div>
                    </div>
                    <div className="mini-card">
                      <span className="ic">
                        <Icon name="users" size={18} />
                      </span>
                      <div>
                        <div className="micro muted">Travelers</div>
                        <div className="v mono">{form.travelers}</div>
                      </div>
                    </div>
                  </div>

                  <div className="field" style={{ marginBottom: 14 }}>
                    <label htmlFor="budget-input">Total budget (USD)</label>
                    <div className="input-wrap" style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--muted)",
                        }}
                      >
                        $
                      </span>
                      <input
                        id="budget-input"
                        className={`input${budgetError ? " invalid" : ""}`}
                        style={{ paddingLeft: 30, fontWeight: 700 }}
                        type="number"
                        min={0}
                        max={20000}
                        step={10}
                        value={form.budget === 0 ? "" : form.budget}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const v = raw === "" ? 0 : Math.min(20000, Number(raw));
                          setForm((f) => ({ ...f, budget: v }));
                          if (budgetError && v >= 100) setBudgetError(false);
                        }}
                        aria-label="Total trip budget in USD"
                      />
                    </div>
                    {budgetError && (
                      <p className="field-error" style={{ marginTop: 6 }}>
                        Budget must be at least $100 — adjust the amount to continue.
                      </p>
                    )}
                    <input
                      id="budget-slider"
                      className="range"
                      type="range"
                      min={100}
                      max={20000}
                      step={10}
                      value={Math.max(100, form.budget)}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, budget: Number(e.target.value) }));
                        if (budgetError) setBudgetError(false);
                      }}
                      style={{
                        "--fill": `${Math.max(0, ((form.budget - 100) / (20000 - 100)) * 100)}%`,
                        marginTop: 10,
                      }}
                      aria-label="Total trip budget slider"
                    />
                    <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                      ≈ {money(Math.round(form.budget / form.days))} per day across {form.days} days
                    </p>
                  </div>

                  <div className="field" style={{ marginBottom: 14 }}>
                    <label htmlFor="dates">Trip window</label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <input
                        id="dates"
                        className="input"
                        style={{ flex: 1, minWidth: 150 }}
                        type="date"
                        value={form.startDate}
                        min={todayPlus(0)}
                        onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      />
                      <select
                        className="input select"
                        style={{ width: 110 }}
                        value={form.days}
                        onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) }))}
                        aria-label="Trip length in days"
                      >
                        {[2, 3, 4, 5, 6, 7].map((d) => (
                          <option key={d} value={d}>
                            {d} days
                          </option>
                        ))}
                      </select>
                      <select
                        className="input select"
                        style={{ width: 120 }}
                        value={form.travelers}
                        onChange={(e) => setForm((f) => ({ ...f, travelers: Number(e.target.value) }))}
                        aria-label="Number of travelers"
                      >
                        {[1, 2, 3, 4].map((t) => (
                          <option key={t} value={t}>
                            {t} traveler{t > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="micro muted" style={{ marginBottom: 8 }}>
                    Preferences
                  </div>
                  <div className="pref-row" role="group" aria-label="Trip preferences">
                    {PREFERENCES.map((p) => {
                      const on = form.preferences.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`chip ${on ? (p.color === "pink" ? "pink-on" : "on") : ""}`}
                          onClick={() => togglePref(p.id)}
                          aria-pressed={on}
                        >
                          <Icon name={p.icon} size={14} />
                          {p.id}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pref-note">
                    {form.preferences.length >= 4
                      ? "Maximum 4 interests — we'll prioritize what matters most."
                      : `We'll tailor your trip around ${form.preferences.length === 1 ? "your interest" : `your ${form.preferences.length} interests`}.`}
                  </div>

                  <button className="btn btn-dark btn-lg btn-block" onClick={planTrip}>
                    <span style={{ color: "#7fa7ff" }}>
                      <Icon name="sparkles" size={17} />
                    </span>
                    Plan my trip — it's free
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TripPlannerPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 480, borderRadius: 22 }} />}>
      <TripPlanner />
    </Suspense>
  );
}
