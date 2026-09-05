"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import Icon from "@/components/Icons";
import Scene from "@/components/Scene";
import { Toaster } from "@/components/ui";
import { DESTINATIONS, placeLabel } from "@/lib/data";
import { getSession } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

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
                  <button
                    key={d.id}
                    onClick={() => {
                      setQ("");
                      setShowSearch(false);
                      router.push(`/trip-planner?to=${d.id}`);
                    }}
                  >
                    <span className="flag">{d.flag}</span>
                    <span>
                      {placeLabel(d)}
                      <span className="sub"> — {d.tagline}</span>
                    </span>
                  </button>
                ))}
                {matches.length === 0 && (
                  <div className="search-pop-empty">No destinations match your search</div>
                )}
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
              YOUR AI TRAVEL PLANNER
            </span>
            <h1 className="hero-title">
              Plan your trip
              <br />
              <span className="purple">in under a minute</span>
            </h1>
            <p className="hero-sub">
              Tell us where you want to go, your budget, and what you love — our AI
              handles flights, hotels, and a day-by-day travel plan. No spreadsheets, no stress.
            </p>
            <div className="feature-tags">
              <span className="chip">
                <Icon name="plane" size={15} /> Real Flight Prices
              </span>
              <span className="chip">
                <Icon name="graph" size={15} /> Stays on Budget
              </span>
              <span className="chip">
                <Icon name="calendar" size={15} /> Daily Travel Plan
              </span>
              <span className="chip">
                <Icon name="pin" size={15} /> Trip Protection
              </span>
            </div>
            <div className="hero-cta">
              <Link href="/trip-planner" className="btn btn-purple btn-lg">
                <Icon name="sparkles" size={17} /> Plan My Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="how" id="how">
        <div className="container">
          <h2>How it works</h2>
          <p className="how-sub">Three easy steps from idea to travel plan.</p>
          <div className="how-grid">
            <div className="how-card">
              <div className="n">1</div>
              <h3>Tell us your trip idea</h3>
              <p>
                Pick where you want to go, how much you want to spend, and what you enjoy —
                food, culture, shopping, nightlife, nature, or relaxation.
              </p>
            </div>
            <div className="how-card">
              <div className="n">2</div>
              <h3>We build your plan</h3>
              <p>
                Our AI searches real flights, finds the right hotel, and creates a day-by-day
                schedule — all within your budget.
              </p>
            </div>
            <div className="how-card">
              <div className="n">3</div>
              <h3>Travel with confidence</h3>
              <p>
                If a flight is delayed or prices change, your plan adjusts automatically.
                You stay on budget and on schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Destinations ---------- */}
      <section className="dests">
        <div className="container">
          <h2>Popular destinations</h2>
          <div className="dests-grid">
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                className="dest-card"
                onClick={() => router.push(`/trip-planner?to=${d.id}`)}
              >
                {d.image ? (
                  <img className="scene" src={d.image} alt={placeLabel(d)} loading="lazy" />
                ) : (
                  <Scene type={d.scene || "city-night"} className="scene" />
                )}
                <div className="meta">
                  <div className="name">
                    {d.flag} {placeLabel(d)}
                  </div>
                  <div className="sub">{d.tagline}</div>
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
                <BrandLogo light height={36} />
              </div>
              <p>
                Your AI travel companion. Plan trips, stay on budget, and travel
                worry-free — all in one place.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <Link href="/trip-planner">Plan a trip</Link>
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
