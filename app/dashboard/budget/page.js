"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icons";
import { SegmentedBar } from "@/components/ui";
import {
  applyRecommendation,
  autoOptimize,
  buildRecommendations,
  computeReport,
  declineRecommendation,
  money,
} from "@/lib/engine";
import { getTrips, saveTrip, toast } from "@/lib/store";
import useActiveTrip from "@/lib/useTrip";

const REC_ICONS = { train: "train", ticket: "ticket", bed: "bed" };

function Budget() {
  const { trip, refresh, loading } = useActiveTrip();
  const [recs, setRecs] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (trip) {
      setRecs(trip.recommendations || buildRecommendations(trip));
      setTrips(getTrips());
    }
  }, [trip]);

  const analytics = useMemo(() => {
    const all = trips.length ? trips : trip ? [trip] : [];
    if (!all.length) return null;
    const scores = all.map((t) => computeReport(t).score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const saved = all.reduce(
      (s, t) => s + t.decisions.applied.reduce((x, a) => x + a.save, 0),
      0
    );
    const risky = all.reduce((s, t) => s + t.decisions.declined.length, 0);
    const healthy = all.filter((t) => t.forecast <= t.budget).length;
    return {
      total: all.length,
      avg,
      saved,
      risky,
      successRate: Math.round((healthy / all.length) * 100),
    };
  }, [trips, trip]);

  if (loading) {
    return <div className="skeleton" style={{ height: 380, borderRadius: 22 }} />;
  }

  if (!trip) {
    return (
      <div className="empt">
        <div className="big-ic">
          <Icon name="wallet" size={28} />
        </div>
        <h3>No trip to budget</h3>
        <p>Plan a trip first — Atlas Agent will build a budget you can tune here.</p>
        <Link href="/trip-planner" className="btn btn-purple btn-lg">
          <Icon name="sparkles" size={17} /> Plan a trip
        </Link>
      </div>
    );
  }

  const apply = (recId) => {
    const updated = JSON.parse(JSON.stringify(trip));
    applyRecommendation(updated, recId);
    updated.recommendations = buildRecommendations(updated);
    saveTrip(updated);
    refresh();
    setRecs(updated.recommendations);
    const rec = updated.recommendations.find((r) => r.id === recId) || recs.find((r) => r.id === recId);
    toast(`Applied "${rec.title}" — ${money(rec.save)} saved`, "success");
  };

  const decline = (recId) => {
    const updated = JSON.parse(JSON.stringify(trip));
    declineRecommendation(updated, recId);
    saveTrip(updated);
    refresh();
    const rec = recs.find((r) => r.id === recId);
    toast(`Declined "${rec.title}" — ${money(rec.save)} kept in plan`, "info");
  };

  const optimizeAll = () => {
    const updated = JSON.parse(JSON.stringify(trip));
    const { applied } = autoOptimize(updated);
    updated.recommendations = buildRecommendations(updated);
    saveTrip(updated);
    refresh();
    setRecs(updated.recommendations);
    if (applied) {
      toast(`Agent applied "${applied.title}" — ${money(applied.save)} saved`, "success");
    } else {
      toast("No further optimization available — plan is already lean", "info");
    }
  };

  const pending = recs.filter(
    (r) =>
      r.available &&
      !trip.decisions.applied.some((a) => a.id === r.id) &&
      !trip.decisions.declined.some((d) => d.id === r.id)
  );

  const segments = [
    { key: "Flights", value: trip.spend.flights, color: "#131a2e" },
    { key: "Hotel", value: trip.spend.hotel, color: "#6c4cf1" },
    { key: "Activities", value: trip.spend.activities, color: "#3e7bfa" },
    { key: "Dining", value: trip.spend.dining, color: "#ff4d7d" },
    { key: "Transit", value: trip.spend.transit, color: "#17b26a" },
  ];

  const isRisk = trip.risk === "risk";

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="kicker">
            <Icon name="wallet" size={14} /> BUDGET INTELLIGENCE
          </span>
          <h1>Budget — {trip.dest.city}</h1>
          <p className="sub">
            {money(trip.budget)} target for {trip.days} days. Atlas Agent watches every dollar
            and suggests fixes before you overspend.
          </p>
        </div>
        <div className="actions">
          <Link href={`/dashboard/itinerary?trip=${trip.id}`} className="btn btn-outline">
            <Icon name="calendar" size={16} /> View travel plan
          </Link>
        </div>
      </div>

      {/* ---------- Alert ---------- */}
      <div className={`alert-card ${!isRisk ? "safe" : ""}`}>
        <div className="alert-head">
          <Icon name="warn" size={16} />
          {isRisk ? "BUDGET ALERT" : "BUDGET STATUS"}
        </div>
        <div className="alert-title">
          {isRisk ? "Risk Detected" : trip.risk === "watch" ? "Approaching the Edge" : "Back on Track"}
        </div>
        <p className="alert-sub">
          {isRisk ? (
            <>
              Based on your current spending pattern, you may exceed your budget by
              approximately <b>{money(trip.overrun)}</b>.
            </>
          ) : trip.risk === "watch" ? (
            <>
              Your forecast of <b>{money(trip.forecast)}</b> leaves only{" "}
              <b>{money(trip.budget - trip.forecast)}</b> of headroom. One unplanned splurge
              and you are over.
            </>
          ) : (
            <>
              Forecast <b>{money(trip.forecast)}</b> sits safely under your{" "}
              <b>{money(trip.budget)}</b> budget — enjoy the buffer, or re-invest it in an
              upgrade.
            </>
          )}
        </p>
        <div className="alert-stats">
          <div className="alert-stat">
            <div className="k">CURRENT SPEND</div>
            <div className="v mono">{money(trip.spent)}</div>
          </div>
          <div className="alert-stat">
            <div className="k">EXPECTED TOTAL</div>
            <div className="v mono">{money(trip.forecast)}</div>
          </div>
          <div className="alert-stat">
            <div className="k">{isRisk ? "PROJECTED OVERRUN" : "PROJECTED BUFFER"}</div>
            <div className={`v mono ${isRisk ? "over" : ""}`} style={!isRisk ? { color: "var(--green-deep)" } : {}}>
              {isRisk ? `+${money(trip.overrun)}` : money(Math.max(0, trip.budget - trip.forecast))}
            </div>
          </div>
        </div>
        {pending.length > 0 && (
          <button className="btn btn-purple" onClick={optimizeAll}>
            <Icon name="sparkles" size={16} /> Let Agent Optimize
          </button>
        )}
        {pending.length === 0 && (
          <button className="btn btn-outline" onClick={() => toast("Every available optimization is already applied — nice work!", "success")}>
            <Icon name="check" size={16} /> All optimizations handled
          </button>
        )}
      </div>

      {/* ---------- Recommendations ---------- */}
      <h2 style={{ fontSize: 19, letterSpacing: "-0.01em", marginBottom: 4 }}>AI Recommendations</h2>
      <p className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>
        Computed from your travel plan, hotel and transit choices. Applying one updates your
        forecast instantly.
      </p>

      <div className="rec-list">
        {recs.map((r) => {
          const applied = trip.decisions.applied.some((a) => a.id === r.id);
          const declined = trip.decisions.declined.some((d) => d.id === r.id);
          return (
            <div key={r.id} className={`rec ${applied ? "applied" : ""} ${declined ? "declined" : ""}`}>
              <span className="r-ic">
                <Icon name={REC_ICONS[r.icon] || "sparkles"} size={20} />
              </span>
              <div className="r-main">
                <div className="t">{r.title}</div>
                <div className="s">{r.detail}</div>
              </div>
              <span className="save">
                {money(r.save)}
                <b>SAVE</b>
              </span>
              <div className="r-actions">
                {applied ? (
                  <span className="rec-state">
                    <Icon name="check" size={15} strokeWidth={3} /> APPLIED
                  </span>
                ) : declined ? (
                  <button className="btn btn-outline btn-sm" onClick={() => apply(r.id)}>
                    Undo decline
                  </button>
                ) : (
                  <>
                    <button className="btn btn-outline-blue btn-sm" onClick={() => apply(r.id)}>
                      APPLY
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => decline(r.id)}>
                      Skip
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Pro tip ---------- */}
      <div className="protip">
        <span className="micro">PRO TIP</span>
        <h3>{isRisk ? "Budget Risk Detected" : "Momentum Tip"}</h3>
        <p>
          {isRisk
            ? `Applying the pending recommendations will bring your projected spend back under the ${money(trip.budget)} limit, maintaining your desired comfort level.`
            : trip.risk === "watch"
              ? "Lock in the biggest saving now — a small buffer early in the trip pays for the inevitable spontaneous dinner."
              : "You are pacing well. Consider routing your buffer into one unforgettable experience — the agent can propose upgrades that fit the remaining budget."}
        </p>
      </div>

      {/* ---------- Analytics ---------- */}
      {analytics && (
        <>
          <h2 style={{ fontSize: 19, letterSpacing: "-0.01em", marginTop: 28, marginBottom: 4 }}>
            Planning analytics
          </h2>
          <p className="muted" style={{ fontSize: 13.5, marginBottom: 4 }}>
            Aggregated across every trip on this device.
          </p>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="k">TOTAL TRIPS</div>
              <div className="v mono">{analytics.total}</div>
              <div className="d">Planned with Atlas Agent</div>
            </div>
            <div className="analytics-card">
              <div className="k">AVERAGE SCORE</div>
              <div className="v mono" style={{ color: "var(--purple)" }}>
                {analytics.avg}/100
              </div>
              <div className="d">Across all reports</div>
            </div>
            <div className="analytics-card">
              <div className="k">TOTAL SAVED</div>
              <div className="v mono" style={{ color: "var(--green-deep)" }}>
                {money(analytics.saved)}
              </div>
              <div className="d">From applied recommendations</div>
            </div>
            <div className="analytics-card">
              <div className="k">SUCCESS RATE</div>
              <div className="v mono" style={{ color: analytics.successRate >= 50 ? "var(--green-deep)" : "var(--red)" }}>
                {analytics.successRate}%
              </div>
              <div className="d">Trips forecast at or under budget</div>
            </div>
          </div>

          <div className="card card-pad" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Where {trip.dest.city} money goes</h3>
            <SegmentedBar segments={segments} budget={trip.budget} />
            <div className="legend" style={{ marginTop: 14 }}>
              {segments.map((s) => (
                <span key={s.key}>
                  <i className="sw" style={{ background: s.color }} />
                  {s.key} — {money(s.value)}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function BudgetPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 380, borderRadius: 22 }} />}>
      <Budget />
    </Suspense>
  );
}
