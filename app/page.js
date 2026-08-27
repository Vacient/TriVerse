"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icons";
import { Toaster } from "@/components/ui";
import {
  DEFAULT_PREFERENCES,
  DESTINATIONS,
  ORIGINS,
  PREFERENCES,
  getDestination,
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

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
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

  const dest = getDestination(form.destinationId);
  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return DESTINATIONS.slice(0, 5);
    return DESTINATIONS.filter((d) =>
      (d.city + " " + d.country).toLowerCase().includes(needle)
    ).slice(0, 5);
  }, [q]);

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
            <span className="brand-mark">
              <Icon name="plane" size={18} />
            </span>
            Triverse
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
                  <button
                    key={d.id}
                    onClick={() => {
                      setForm((f) => ({ ...f, destinationId: d.id }));
                      setQ("");
                      setShowSearch(false);
                      document
                        .getElementById("planner")
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    <span className="flag">{d.flag}</span>
                    <span>
                      {d.city}, {d.country}
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

      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left">
            <span className="tag">
              <span className="spark">
                <Icon name="sparkles" size={14} />
              </span>
              INTRODUCING TRIVERSE AI 2.0
            </span>
            <h1 className="hero-title">
              Plan less.
              <br />
              <span className="purple">Travel more.</span>
            </h1>
            <p className="hero-sub">
              Your autonomous AI travel agent plans, tracks, and adapts your entire journey
              around your budget. Experience travel without the logistical friction.
            </p>
            <div className="feature-tags">
              <span className="chip">
                <Icon name="plane" size={15} /> Real Flight Data
              </span>
              <span className="chip">
                <Icon name="graph" size={15} /> Budget Optimization
              </span>
              <span className="chip">
                <Icon name="calendar" size={15} /> AI Itinerary
              </span>
              <span className="chip">
                <Icon name="pin" size={15} /> Live Tracking
              </span>
            </div>
          </div>

          {/* ---------- Planner card ---------- */}
          <div className="trip-card" id="planner">
            <div className="trip-card-photo">
              <img className="scene" src={dest.image} alt={`${dest.city}, ${dest.country}`} />
              <div className="overlay">
                <h3>Welcome to Triverse AI</h3>
                <div className="stars" aria-label="5 star service">
                  <Icon name="star" size={13} strokeWidth={0} style={{ fill: "currentColor" }} />
                  <Icon name="star" size={13} strokeWidth={0} style={{ fill: "currentColor" }} />
                  <Icon name="star" size={13} strokeWidth={0} style={{ fill: "currentColor" }} />
                </div>
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
                      onChange={(e) => setForm((f) => ({ ...f, originId: e.target.value }))}
                      aria-label="Origin city"
                    >
                      {ORIGINS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.city}, {o.country}
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
                      onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}
                      aria-label="Destination city"
                    >
                      {DESTINATIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.city}, {d.country}
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
                <label htmlFor="budget-range">Daily budget — {money(Math.round(form.budget / form.days))}/day</label>
                <input
                  id="budget-range"
                  className="range"
                  type="range"
                  min={100}
                  max={2000}
                  step={10}
                  value={form.budget}
                  style={{ "--fill": `${((form.budget - 100) / 1900) * 100}%` }}
                  onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                />
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
                  ? "Maximum 4 signals — Atlas Agent weighs them by priority."
                  : `Atlas Agent tailors every activity to your ${form.preferences.length} signal${form.preferences.length === 1 ? "" : "s"}.`}
              </div>

              <button className="btn btn-dark btn-lg btn-block" onClick={planTrip}>
                <span style={{ color: "#7fa7ff" }}>
                  <Icon name="sparkles" size={17} />
                </span>
                Plan my trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="how">
        <div className="container">
          <h2>Your agent does the heavy lifting</h2>
          <p className="how-sub">Three steps from daydream to departure.</p>
          <div className="how-grid">
            <div className="how-card">
              <div className="n">1</div>
              <h3>Tell Atlas what matters</h3>
              <p>
                Pick a destination, a budget, and up to four preference signals. The agent
                builds a profile of how you like to travel.
              </p>
            </div>
            <div className="how-card">
              <div className="n">2</div>
              <h3>Watch it plan in real time</h3>
              <p>
                Atlas searches flights, secures stays and structures a day-by-day itinerary —
                then balances it against your budget.
              </p>
            </div>
            <div className="how-card">
              <div className="n">3</div>
              <h3>Travel with a safety net</h3>
              <p>
                If a flight is delayed or spending drifts, the agent reworks your plan
                automatically and preserves what you care about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Destinations ---------- */}
      <section className="dests">
        <div className="container">
          <h2>Where will Atlas take you next?</h2>
          <div className="dests-grid">
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                className="dest-card"
                onClick={() => {
                  setForm((f) => ({ ...f, destinationId: d.id }));
                  document
                    .getElementById("planner")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                <img className="scene" src={d.image} alt={`${d.city}, ${d.country}`} loading="lazy" />
                <div className="meta">
                  <div className="name">
                    {d.flag} {d.city}, {d.country}
                  </div>
                  <div className="sub">{d.tagline}</div>
                  <span className="price">from {money(d.flightPrice.RGN)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="brand">
                <span className="brand-mark">
                  <Icon name="plane" size={18} />
                </span>
                Triverse
              </div>
              <p>
                The autonomous AI travel agent. Plan less, travel more — with real-time
                budget intelligence and live disruption protection.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <Link href="/#planner">Plan a trip</Link>
              <Link href="/dashboard/overview">Dashboard</Link>
              <Link href="/dashboard/budget">Budget intelligence</Link>
              <Link href="/dashboard/agent">Atlas Agent</Link>
            </div>
            <div>
              <h4>Resources</h4>
              <Link href="/sign-in">Sign in</Link>
              <Link href="/sign-up">Create account</Link>
              <Link href="/dashboard/settings">Preferences</Link>
              <Link href="/dashboard/trips">My trips</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link href="/">About Triverse</Link>
              <Link href="/">Privacy policy</Link>
              <Link href="/">Terms of service</Link>
              <Link href="/">Contact</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Triverse AI. Hackathon build — demo data is stored locally.</span>
            <span>Made for the road.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
