"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icons";
import { Modal } from "@/components/ui";
import { ACHIEVEMENTS, computeAchievements } from "@/lib/engine";
import { PREFERENCES, placeLabel } from "@/lib/data";
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
  const [photo, setPhoto] = useState("");
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
      setPhoto(s.photo || "");
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
    const updated = updateUser({ name, email, preferences: prefs, photo: photo.trim() || null });
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
    const now = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
    const tripRows = trips
      .map(
        (t) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">
            <strong>${placeLabel(t.dest)}</strong><br>
            <span style="font-size:12px;color:#6b7280;">${t.days} days · ${t.travelers} traveler${t.travelers > 1 ? "s" : ""}</span>
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;">$${t.budget.toLocaleString()}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;">$${t.forecast.toLocaleString()}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;">
            <span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;
              background:${t.risk === "risk" ? "#fee2e2" : t.risk === "watch" ? "#fef3c7" : "#d1fae5"};
              color:${t.risk === "risk" ? "#dc2626" : t.risk === "watch" ? "#d97706" : "#059669"};">
              ${t.risk === "risk" ? "At Risk" : t.risk === "watch" ? "Watch" : "Safe"}
            </span>
          </td>
        </tr>`
      )
      .join("");

    const achRows = Object.entries(unlocked).length
      ? Object.entries(unlocked)
          .map(
            ([id]) => {
              const a = ACHIEVEMENTS.find((x) => x.id === id);
              return a ? `<li style="padding:4px 0;font-size:13px;">${a.name} — ${a.desc}</li>` : "";
            }
          )
          .join("")
      : "<li style=\"padding:4px 0;font-size:13px;color:#9ca3af;\">No achievements yet — plan a trip to get started!</li>";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Triverse — My Travel Data</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; padding: 40px 48px; max-width: 800px; margin: 0 auto; }
  .header { border-bottom: 3px solid #6c4cf1; padding-bottom: 16px; margin-bottom: 28px; }
  .header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
  .header .date { font-size: 13px; color: #6b7280; margin-top: 4px; }
  h2 { font-size: 18px; font-weight: 700; margin: 28px 0 12px; color: #6c4cf1; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; padding: 8px 10px; border-bottom: 2px solid #d1d5db; font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.04em; }
  .profile-card { background: #f9fafb; border-radius: 12px; padding: 18px 20px; font-size: 14px; line-height: 1.8; }
  .profile-card strong { color: #6c4cf1; }
  ul { list-style: none; padding: 0; }
  .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
  @media print {
    body { padding: 20px 24px; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="header">
  <h1>Triverse AI — Travel Report</h1>
  <div class="date">Exported on ${now}</div>
</div>

<h2>Traveler Profile</h2>
<div class="profile-card">
  <strong>Name:</strong> ${session?.name || "—"}<br>
  <strong>Email:</strong> ${session?.email || "—"}<br>
  <strong>Preferences:</strong> ${session?.preferences?.length ? session.preferences.join(", ") : "None set"}<br>
  <strong>Total Trips:</strong> ${trips.length}
</div>

<h2>Trips (${trips.length})</h2>
<table>
  <thead>
    <tr>
      <th>Destination</th>
      <th style="text-align:right;">Budget</th>
      <th style="text-align:right;">Forecast</th>
      <th style="text-align:center;">Status</th>
    </tr>
  </thead>
  <tbody>
    ${tripRows || '<tr><td colspan="4" style="padding:16px;text-align:center;color:#9ca3af;">No trips planned yet</td></tr>'}
  </tbody>
</table>

<h2>Achievements</h2>
<ul>${achRows}</ul>

<div class="footer">
  <p>Generated by Triverse AI — your autonomous travel agent. All data stored locally on your device.</p>
  <p class="no-print" style="margin-top:8px;"><em>Tip: Use your browser's Print function (Ctrl+P) to save this as a PDF file.</em></p>
</div>

<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 400);
  };
</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank", "width=900,height=700");
    if (!w) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "triverse-travel-report.html";
      a.click();
    }
    URL.revokeObjectURL(url);
    toast("Travel report ready — save as PDF from the print dialog", "success");
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
              <label htmlFor="s-photo">Profile photo URL (optional)</label>
              <div className="input-wrap">
                <Icon name="camera" size={16} />
                <input
                  id="s-photo"
                  className="input with-icon"
                  type="url"
                  placeholder="https://…/your-photo.jpg"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>
              <div className="photo-preview">
                <span className={`avatar purple ${photo.trim() ? "has-photo" : ""}`}>
                  {photo.trim() ? (
                    <img src={photo.trim()} alt="Profile preview" className="avatar-photo" />
                  ) : name.trim() ? (
                    name.trim().charAt(0).toUpperCase()
                  ) : (
                    <Icon name="user" size={18} />
                  )}
                </span>
                <span className="muted" style={{ fontSize: 12.5 }}>
                  Preview — used in the top-right profile menu. Leave empty to show your initial.
                </span>
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
