"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Icon from "@/components/Icons";
import { RingScore } from "@/components/ui";
import { computeReport, fmtDate, money } from "@/lib/engine";
import { getTrip } from "@/lib/store";

function Report() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    setTrip(getTrip(params.id));
  }, [params.id]);

  if (!trip) {
    return (
      <div className="empt">
        <div className="big-ic">
          <Icon name="info" size={28} />
        </div>
        <h3>Trip not found</h3>
        <p>This report may have been deleted from this device.</p>
        <Link href="/dashboard/trips" className="btn btn-purple">
          Back to My Trips
        </Link>
      </div>
    );
  }

  const report = computeReport(trip);
  const decisions = [
    ...trip.decisions.applied.map((a) => {
      const rec = trip.recommendations.find((r) => r.id === a.id);
      return { ...a, kind: "good", label: rec ? rec.title : "Optimization applied" };
    }),
    ...trip.decisions.declined.map((d) => {
      const rec = trip.recommendations.find((r) => r.id === d.id);
      return { ...d, kind: "risky", label: rec ? rec.title : "Optimization declined" };
    }),
  ].sort((a, b) => a.at - b.at);

  return (
    <div>
      <div className="page-head no-print">
        <div>
          <span className="kicker">
            <Icon name="graph" size={14} /> PERFORMANCE ANALYSIS
          </span>
          <h1>Trip Report — {trip.dest.city}</h1>
          <p className="sub">
            {fmtDate(trip.startDate)} • {trip.days} days • generated from your actual
            decisions and budget outcome.
          </p>
        </div>
        <div className="actions">
          <button className="btn btn-outline" onClick={() => router.push(`/dashboard/overview?trip=${trip.id}`)}>
            Back to trip
          </button>
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Icon name="download" size={16} /> Print report
          </button>
        </div>
      </div>

      {/* ---------- Hero ---------- */}
      <div className="report-hero">
        <RingScore score={report.score} />
        <div className="info">
          <span className="micro" style={{ color: "#9aa3c4" }}>
            {trip.dest.flag} {trip.dest.city.toUpperCase()} • {trip.days} DAYS
          </span>
          <h2>Performance level</h2>
          <span className="lvl">
            <Icon name="star" size={15} /> {report.level}
          </span>
          <p>
            {report.level === "Expert Traveler" &&
              "Outstanding. You balanced comfort and cost like a pro, and the agent never had to fight your decisions."}
            {report.level === "Smart Planner" &&
              "Solid work. Your choices kept the trip healthy — a few sharper calls would put you in the top tier."}
            {report.level === "Balanced Explorer" &&
              "A fun plan with room to tighten. Lean on the agent's recommendations earlier next time."}
            {report.level === "Needs Guidance" &&
              "The plan is viable, but risky choices dominated. Let Atlas Agent guide the next one."}
          </p>
        </div>
      </div>

      <div className="report-grid">
        {/* ---------- Decisions ---------- */}
        <div className="report-card">
          <h3>
            <Icon name="sparkles" size={17} style={{ color: "var(--purple)" }} />
            Decision history
          </h3>
          {decisions.length === 0 && (
            <p className="muted" style={{ fontSize: 13.5 }}>
              No optimization decisions were made for this trip.
            </p>
          )}
          {decisions.map((d, i) => (
            <div className="dec-row" key={i}>
              <span className={`d-ic ${d.kind}`}>
                <Icon name={d.kind === "good" ? "check" : "x"} size={14} strokeWidth={2.8} />
              </span>
              <span className="t">{d.label}</span>
              <span className={`fx ${d.kind}`}>
                {d.kind === "good" ? `-${money(d.save)}` : `+${money(d.save)} kept`}
              </span>
            </div>
          ))}
          <div className="dec-row" style={{ borderBottom: "none", marginTop: 6 }}>
            <span className={`d-ic ${report.correct > report.risky ? "good" : "risky"}`}>
              <Icon name={report.correct > report.risky ? "check" : "warn"} size={14} strokeWidth={2.8} />
            </span>
            <span className="t">
              {report.correct} sound decision{report.correct === 1 ? "" : "s"} vs {report.risky} risky
            </span>
            <span className={`fx ${report.correct >= report.risky ? "good" : "risky"}`}>
              {report.correct >= report.risky ? "Net positive" : "Needs attention"}
            </span>
          </div>
        </div>

        {/* ---------- Strengths & weaknesses ---------- */}
        <div className="report-card">
          <h3>
            <Icon name="shield" size={17} style={{ color: "var(--purple)" }} />
            Strengths & weaknesses
          </h3>
          <div className="sw-list">
            {report.strengths.map((s, i) => (
              <div className="sw-item" key={`s${i}`}>
                <span className="s-ic ok">
                  <Icon name="check" size={15} strokeWidth={3} />
                </span>
                <span>{s}</span>
              </div>
            ))}
            {report.weaknesses.map((w, i) => (
              <div className="sw-item" key={`w${i}`}>
                <span className="s-ic risky">
                  <Icon name="warn" size={15} strokeWidth={2.6} />
                </span>
                <span>{w}</span>
              </div>
            ))}
            {report.weaknesses.length === 0 && (
              <div className="sw-item">
                <span className="s-ic ok">
                  <Icon name="check" size={15} strokeWidth={3} />
                </span>
                <span>No weak spots detected — the plan is healthy.</span>
              </div>
            )}
          </div>
        </div>

        {/* ---------- Spend breakdown ---------- */}
        <div className="report-card">
          <h3>
            <Icon name="wallet" size={17} style={{ color: "var(--purple)" }} />
            Spend breakdown
          </h3>
          <div className="cat-bars">
            {report.breakdown.map((b) => {
              const pct = trip.forecast ? Math.round((b.value / trip.forecast) * 100) : 0;
              return (
                <div className="cat-bar" key={b.key}>
                  <div className="cb-head">
                    <span>{b.key}</span>
                    <span>
                      {money(b.value)} • {pct}%
                    </span>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${pct}%`, background: b.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sum-total" style={{ marginTop: 16 }}>
            <span>Total forecast</span>
            <span className={trip.overrun ? "mono" : "mono"} style={{ color: trip.overrun ? "var(--red)" : "var(--green-deep)" }}>
              {money(trip.forecast)}
              {trip.overrun ? ` (+${money(trip.overrun)} over)` : ` (${money(trip.budget - trip.forecast)} under)`}
            </span>
          </div>
        </div>

        {/* ---------- Next steps ---------- */}
        <div className="report-card">
          <h3>
            <Icon name="arrowRight" size={17} style={{ color: "var(--purple)" }} />
            Atlas recommends
          </h3>
          <div className="sw-list">
            {report.nextSteps.map((s, i) => (
              <div className="sw-item" key={i}>
                <span className="s-ic ok">
                  <Icon name="arrowRight" size={15} strokeWidth={2.6} />
                </span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <Link href="/" className="btn btn-purple">
              <Icon name="sparkles" size={16} /> Retry a new trip
            </Link>
            <Link href="/dashboard/trips" className="btn btn-outline">
              Explore all trips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 340, borderRadius: 22 }} />}>
      <Report />
    </Suspense>
  );
}
