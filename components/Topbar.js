"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icons";
import { DESTINATIONS, placeLabel } from "@/lib/data";
import { timeAgo } from "@/lib/engine";
import { clearSession, getSession, getTrips } from "@/lib/store";

function useNotifications() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const trips = getTrips();
    const out = [];
    for (const t of trips) {
      if (t.risk === "risk") {
        out.push({
          id: `risk-${t.id}`,
          title: `Budget risk on ${t.dest.city}`,
          sub: `Projected ${t.overrun} over budget — recommendations ready`,
          at: t.updatedAt,
          icon: "warn",
          tone: "risk",
          href: `/dashboard/budget?trip=${t.id}`,
        });
      }
      for (const d of t.disruptions) {
        out.push({
          id: `dis-${d.id}`,
          title: `Disruption resolved: ${d.flight}`,
          sub: "Travel plan adapted automatically, net change $0",
          at: d.at,
          icon: "check",
          tone: "ok",
          href: `/dashboard/agent?trip=${t.id}`,
        });
      }
    }
    const planned = trips.filter((t) => t.status === "planned").slice(0, 2);
    for (const t of planned) {
      out.push({
        id: `plan-${t.id}`,
        title: `Atlas Agent finished ${t.dest.city}`,
        sub: `${t.days}-day plan, forecast ${t.forecast}`,
        at: t.createdAt,
        icon: "sparkles",
        tone: "info",
        href: `/dashboard/overview?trip=${t.id}`,
      });
    }
    out.sort((a, b) => b.at - a.at);
    setItems(out.slice(0, 8));
  }, []);
  return items;
}

export default function Topbar({ crumb, onBurger }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [session, setSession] = useState(null);
  const wrapRef = useRef(null); // search box + results
  const bellRef = useRef(null); // notifications dropdown
  const userRef = useRef(null); // account dropdown
  const notifs = useNotifications();

  useEffect(() => {
    // Live session state so the avatar tracks name/photo changes from Settings.
    const load = () => setSession(getSession());
    load();
    window.addEventListener("triverse:session", load);
    return () => window.removeEventListener("triverse:session", load);
  }, []);

  useEffect(() => {
    // Close dropdowns on outside press, but keep them open for clicks inside
    // the panels themselves so Settings / Home / Sign out actually fire.
    const onClick = (e) => {
      const t = e.target;
      if (
        !wrapRef.current?.contains(t) &&
        !bellRef.current?.contains(t) &&
        !userRef.current?.contains(t)
      ) {
        setBellOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = q.trim()
    ? DESTINATIONS.filter((d) =>
        (d.city + " " + d.country).toLowerCase().includes(q.trim().toLowerCase())
      ).slice(0, 5)
    : DESTINATIONS.slice(0, 5);

  const signOut = () => {
    clearSession();
    router.push("/");
  };

  return (
    <header className="dash-top no-print">
      <button
        className="icon-btn burger"
        onClick={onBurger}
        aria-label="Open navigation menu"
      >
        <Icon name="menu" size={21} />
      </button>

      <span className="crumb">{crumb}</span>

      <div className="spacer" />

      <div className="dash-search" ref={wrapRef}>
        <div className="input-wrap">
          <Icon name="search" size={17} />
          <input
            className="input with-icon"
            style={{ paddingLeft: 38 }}
            type="text"
            placeholder="Where do you want to go?"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches.length) {
                router.push(`/trip-planner?to=${matches[0].id}`);
                setQ("");
                setShowSearch(false);
              }
            }}
            aria-label="Search destinations"
          />
        </div>
        {showSearch && (
          <div className="search-pop">
            {matches.map((d) => (
              <button
                key={d.id}
                onMouseDown={() => {
                  router.push(`/trip-planner?to=${d.id}`);
                  setQ("");
                  setShowSearch(false);
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

      <div className="dd" ref={bellRef}>
        <button
          className="icon-btn nav-bell"
          onClick={() => setBellOpen((v) => !v)}
          aria-label={`Notifications (${notifs.length})`}
        >
          <Icon name="bell" size={20} />
          {notifs.length > 0 && <span className="dot" />}
        </button>
        {bellOpen && (
          <div className="dd-panel">
            <div className="dd-head">
              Notifications
              {notifs.length > 0 && <span className="pill pill-purple-soft">{notifs.length} new</span>}
            </div>
            {notifs.length === 0 && (
              <p className="muted" style={{ padding: "14px 12px", fontSize: 13 }}>
                All quiet — no alerts from your agent yet.
              </p>
            )}
            {notifs.map((n) => (
              <Link key={n.id} href={n.href} className="dd-item" onClick={() => setBellOpen(false)}>
                <span className={`toast-icon ${n.tone === "risk" ? "warn" : n.tone === "ok" ? "success" : "info"}`}>
                  <Icon name={n.icon} size={15} strokeWidth={2.6} />
                </span>
                <span>
                  <span className="t">{n.title}</span>
                  <br />
                  <span className="s">
                    {n.sub} · {timeAgo(n.at)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="dd" ref={userRef}>
        <button
          className={`avatar purple ${session?.photo ? "has-photo" : ""}`}
          onClick={() => setUserOpen((v) => !v)}
          aria-label="Account menu"
        >
          {session?.photo ? (
            <img src={session.photo} alt={session.name || "Profile"} className="avatar-photo" />
          ) : session?.name ? (
            session.name.charAt(0).toUpperCase()
          ) : (
            <Icon name="user" size={18} />
          )}
        </button>
        {userOpen && (
          <div className="dd-panel">
            <div className="dd-profile">
              <span className={`avatar purple ${session?.photo ? "has-photo" : ""}`}>
                {session?.photo ? (
                  <img src={session.photo} alt={session.name || "Profile"} className="avatar-photo" />
                ) : session?.name ? (
                  session.name.charAt(0).toUpperCase()
                ) : (
                  <Icon name="user" size={18} />
                )}
              </span>
              <div className="who">
                <div className="n">{session?.name || "Guest traveler"}</div>
                <div className="e">{session?.email || "Not signed in"}</div>
              </div>
            </div>
            <div className="dd-sep" />
            <Link href="/dashboard/settings" className="dd-item" onClick={() => setUserOpen(false)}>
              <Icon name="gear" size={17} />
              <span>Settings</span>
            </Link>
            <Link href="/" className="dd-item" onClick={() => setUserOpen(false)}>
              <Icon name="home" size={17} />
              <span>Home</span>
            </Link>
            <div className="dd-sep" />
            <button className="dd-item" onClick={signOut}>
              <Icon name="logout" size={17} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
