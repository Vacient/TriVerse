"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icons";
import { agentSteps, money, timeAgo, triggerDisruption } from "@/lib/engine";
import { saveTrip, toast } from "@/lib/store";
import useActiveTrip from "@/lib/useTrip";

function Agent() {
  const { trip, refresh, loading } = useActiveTrip();
  const [simulating, setSimulating] = useState(false);

  const steps = useMemo(() => (trip ? agentSteps(trip) : []), [trip]);

  const adjustments = useMemo(() => {
    if (!trip) return [];
    return trip.agentLog.filter((l) => l.type === "adj").slice(-6).reverse();
  }, [trip]);

  if (loading) {
    return <div className="skeleton" style={{ height: 420, borderRadius: 22 }} />;
  }

  if (!trip) {
    return (
      <div className="empt">
        <div className="big-ic">
          <Icon name="bot" size={28} />
        </div>
        <h3>Atlas Agent is idle</h3>
        <p>Plan a trip and watch the agent go to work in real time.</p>
        <Link href="/" className="btn btn-purple btn-lg">
          <Icon name="sparkles" size={17} /> Plan a trip
        </Link>
      </div>
    );
  }

  const disruption = trip.disruptions[0];
  const signalCount = trip.itinerary.reduce((n, d) => n + d.items.length, 0) * 31 + 47;

  const simulate = () => {
    if (trip.disruptions.length) return;
    setSimulating(true);
    setTimeout(() => {
      const updated = JSON.parse(JSON.stringify(trip));
      const { event } = triggerDisruption(updated);
      saveTrip(updated);
      refresh();
      setSimulating(false);
      if (event) {
        toast(`Disruption detected on ${event.flight} — itinerary auto-adapted`, "warn");
      }
    }, 1200);
  };

  return (
    <div className="agent-wrap">
      <div className="page-head no-print">
        <div>
          <span className="kicker">
            <Icon name="bot" size={14} /> ATLAS AGENT
          </span>
          <h1>Agent Activity</h1>
          <p className="sub">
            Everything Atlas has done for this trip — planning, optimization and live
            disruption handling.
          </p>
        </div>
        <div className="actions">
          {!disruption && (
            <button className="btn btn-outline" onClick={simulate} disabled={simulating}>
              <Icon name="radar" size={16} />
              {simulating ? "Simulating disruption…" : "Simulate flight disruption"}
            </button>
          )}
        </div>
      </div>

      {/* ---------- Hero ---------- */}
      <div className="agent-hero">
        <h2>
          {disruption
            ? "Atlas Agent is re-planning around a disruption"
            : trip.risk === "risk"
              ? "Atlas Agent flagged a budget risk"
              : "Atlas Agent is monitoring your trip"}
        </h2>
        <div className="trip-meta">
          {trip.dest.city} • {trip.days} days • {money(trip.budget)} budget
        </div>
        <span className="live">
          <span className="pulse-dot" /> LIVE — {disruption ? "RECOVERY MODE" : "MONITORING"}
        </span>
      </div>

      {/* ---------- Disruption banner ---------- */}
      {disruption && (
        <div className="disrupt-banner">
          <div
            className="kicker"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="warn" size={16} /> FLIGHT {disruption.flight} DELAYED {disruption.delayH}H
            </span>
            <span className="pill pill-purple-soft">
              <Icon name="sparkles" size={12} /> Live Resolution
            </span>
          </div>
          <h2>Your itinerary has been automatically adapted.</h2>
          <p>
            Triverse AI detected a disruption and proactively reorganized your schedule to
            minimize impact and preserve your key preferences.
          </p>
          <div className="adj-grid">
            {disruption.adjustments.map((a, i) => (
              <div className="adj-card" key={i}>
                <span className="ok">
                  <Icon name="check" size={14} strokeWidth={3} />
                </span>
                <div>
                  <div className="t">{a.title}</div>
                  <div className="s">{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="agent-cols">
        {/* ---------- Planning steps ---------- */}
        <div className="log-card">
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>
            <Icon name="calendar" size={16} style={{ display: "inline", verticalAlign: "-2px", color: "var(--purple)" }} /> Planning progress
          </h3>
          {steps.map((s, i) => (
            <div className="log-item" key={i}>
              <span className="log-ic">
                <Icon name="check" size={15} strokeWidth={3} />
              </span>
              <div>
                <div className="t">{s.title}</div>
                <div className="s">{s.detail}</div>
              </div>
              <span className="when">done</span>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <div className="cb-head" style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 8 }}>
              <span>
                ESTIMATED COST <b>{money(trip.forecast)}</b>
              </span>
              <span>
                {trip.overrun > 0 ? "OVER BY" : "REMAINING"}{" "}
                <b style={{ color: trip.overrun > 0 || trip.remaining <= 0 ? "var(--red)" : "var(--green-deep)" }}>
                  {money(trip.overrun > 0 ? trip.overrun : trip.remaining)}
                </b>
              </span>
            </div>
            <div className="bar-seg">
              <span style={{ width: `${(trip.spend.flights / trip.forecast) * 100}%`, background: "#131a2e" }} />
              <span style={{ width: `${(trip.spend.hotel / trip.forecast) * 100}%`, background: "#6c4cf1" }} />
              <span style={{ width: `${((trip.spend.activities + trip.spend.dining + trip.spend.transit) / trip.forecast) * 100}%`, background: "#3e7bfa" }} />
            </div>
            <div className="legend" style={{ marginTop: 10 }}>
              <span><i className="sw" style={{ background: "#131a2e" }} /> Flights</span>
              <span><i className="sw" style={{ background: "#6c4cf1" }} /> Hotel</span>
              <span><i className="sw" style={{ background: "#3e7bfa" }} /> Activities, dining & transit</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ---------- Agent status ---------- */}
          <div className="agent-status">
            <div className="h">
              <span style={{ display: "flex", width: 28, height: 28, borderRadius: 9, background: "rgba(62,123,250,0.2)", color: "#7fa7ff", alignItems: "center", justifyContent: "center" }}>
                <Icon name="bot" size={15} />
              </span>
              AGENT STATUS
            </div>
            <div className="msg">
              {disruption
                ? `Recovery complete — ${disruption.adjustments.length} adjustments applied`
                : `Monitoring ${signalCount.toLocaleString()} trip signals`}
            </div>
            <div className="sub">
              {disruption
                ? "Net budget impact: $0"
                : trip.risk === "risk"
                  ? `Budget risk: +${money(trip.overrun)} over forecast`
                  : `Forecast ${money(trip.forecast)} of ${money(trip.budget)}`}
            </div>
          </div>

          {/* ---------- Real-time adjustments ---------- */}
          <div className="live-card">
            <h4>
              REAL-TIME ADJUSTMENTS
              <span className="pill pill-purple-soft">
                <Icon name="sparkles" size={11} /> AUTO
              </span>
            </h4>
            {adjustments.length === 0 && (
              <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
                No adjustments yet — they appear when the agent reworks the plan.
              </p>
            )}
            {adjustments.map((a, i) => (
              <div className="adj" key={i}>
                <span className="who">{a.title}</span>
                <span className="amt added">{a.detail}</span>
              </div>
            ))}
          </div>

          {/* ---------- Full log ---------- */}
          <div className="live-card">
            <h4>AGENT LOG</h4>
            {trip.agentLog
              .slice(-8)
              .reverse()
              .map((l, i) => (
                <div className="log-item" key={i} style={{ padding: "9px 0" }}>
                  <span className={`log-ic ${l.type === "warn" ? "warn" : l.type === "adj" ? "adj" : "ok"}`}>
                    <Icon name={l.type === "warn" ? "warn" : l.type === "adj" ? "sparkles" : "check"} size={14} strokeWidth={2.6} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t">{l.title}</div>
                    <div className="s">{l.detail}</div>
                  </div>
                  <span className="when">{timeAgo(l.at)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 420, borderRadius: 22 }} />}>
      <Agent />
    </Suspense>
  );
}
