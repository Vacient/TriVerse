"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icons";
import { Modal } from "@/components/ui";
import { ACHIEVEMENTS, computeAchievements } from "@/lib/engine";
import { PREFERENCES } from "@/lib/data";
import {
  clearSession,
  getAchievements,
  getSession,
  getTrips,
  resetAll,
  toast,
  updateUser,
} from "@/lib/store";
import { useRouter } from "next/navigation";
import { fmtDate } from "@/lib/engine";

function Settings() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prefs, setPrefs] = useState([]);
  const [trips, setTrips] = useState([]);
  const [unlocked, setUnlocked] = useState({});
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s) {
      setName(s.name || "");
      setEmail(s.email || "");
      setPrefs(s.preferences || []);
    }
    setTrips(getTrips());
    setUnlocked(getAchievements());
  }, []);

  const achievedMap = useMemo(
    () => (trips.length ? computeAchievements(trips) : {}),
    [trips]
  );

  const saveProfile = () => {
    if (name.trim().length < 2) {
      toast("Name must be at least 2 characters", "warn");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast("Enter a valid email address", "warn");
      return;
    }
    const updated = updateUser({ name, email, preferences: prefs });
    setSession(updated);
    toast("Profile saved", "success");
  };

  const togglePref = (id) => {
    setPrefs((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length >= 4 ? [...p.slice(1), id] : [...p, id]
    );
  };

  const doReset = () => {
    resetAll();
    clearSession();
    router.push("/");
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: session,
      trips,
      achievements: unlocked,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triverse-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Data exported as JSON", "success");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="kicker">
            <Icon name="gear" size={14} /> PREFERENCES & DATA
          </span>
          <h1>Settings</h1>
          <p className="sub">
            Your traveler profile sharpens how Atlas Agent weighs food, culture, nightlife
            and comfort for future plans.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* ---------- Profile ---------- */}
        <div className="settings-card">
          <h3>Profile</h3>
          <p className="hint">Stored locally on this device — nothing leaves your browser.</p>
          <div className="settings-form">
            <div className="field">
              <label htmlFor="s-name">Full name</label>
              <div className="input-wrap">
                <Icon name="user" size={16} />
                <input
                  id="s-name"
                  className="input with-icon"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="s-email">Email address</label>
              <div className="input-wrap">
                <Icon name="mail" size={16} />
                <input
                  id="s-email"
                  className="input with-icon"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label>Default trip preferences (up to 4)</label>
              <div className="pref-row">
                {PREFERENCES.map((p) => {
                  const on = prefs.includes(p.id);
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
            </div>
            <button className="btn btn-purple" onClick={saveProfile}>
              Save profile
            </button>
          </div>
        </div>

        {/* ---------- Achievements ---------- */}
        <div className="settings-card">
          <h3>Achievements</h3>
          <p className="hint">Earned by planning smart and staying protected.</p>
          <div className="ach-list">
            {ACHIEVEMENTS.map((a) => {
              const at = unlocked[a.id] || achievedMap[a.id];
              return (
                <div key={a.id} className={`ach-row ${at ? "" : "locked"}`}>
                  <span className="a-ic">
                    <Icon name={a.icon} size={19} />
                  </span>
                  <div>
                    <div className="t">{a.name}</div>
                    <div className="s">{a.desc}</div>
                  </div>
                  <span className="when">{at ? fmtDate(new Date(at).toISOString().slice(0, 10)) : "Locked"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- Data ---------- */}
        <div className="settings-card">
          <h3>Your data</h3>
          <p className="hint">
            {trips.length} trip{trips.length === 1 ? "" : "s"} stored locally. Export a backup
            or wipe everything.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={exportData}>
              <Icon name="download" size={16} /> Export data
            </button>
            <button className="btn btn-danger" onClick={() => setResetOpen(true)}>
              <Icon name="trash" size={16} /> Reset everything
            </button>
          </div>
        </div>

        {/* ---------- About ---------- */}
        <div className="settings-card">
          <h3>About Triverse AI 2.0</h3>
          <p className="hint">
            Triverse is a hackathon demo of an autonomous AI travel agent. All planning
            logic — flights, hotels, itineraries, budgets and disruption recovery — runs
            locally or through the Next.js API layer, with no external services.
          </p>
          <div className="sw-list">
            <div className="sw-item">
              <span className="s-ic ok">
                <Icon name="check" size={15} strokeWidth={3} />
              </span>
              <span>
                <b>Real flight data</b> — route pricing per origin-destination pair
              </span>
            </div>
            <div className="sw-item">
              <span className="s-ic ok">
                <Icon name="check" size={15} strokeWidth={3} />
              </span>
              <span>
                <b>Budget optimization</b> — live recommendations with real recomputation
              </span>
            </div>
            <div className="sw-item">
              <span className="s-ic ok">
                <Icon name="check" size={15} strokeWidth={3} />
              </span>
              <span>
                <b>Live tracking</b> — disruption simulation adapts the itinerary for $0 net
                impact
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset all data?">
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
          This permanently deletes your account, all trips, achievements and preferences from
          this device and signs you out.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={() => setResetOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={doReset}>
            <Icon name="trash" size={15} /> Yes, reset everything
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 380, borderRadius: 22 }} />}>
      <Settings />
    </Suspense>
  );
}
