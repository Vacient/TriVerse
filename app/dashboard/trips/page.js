"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Icon from "@/components/Icons";
import Scene from "@/components/Scene";
import { Modal } from "@/components/ui";
import { computeReport, fmtDate, money } from "@/lib/engine";
import { placeLabel } from "@/lib/data";
import { deleteTrip, duplicateTrip, getTrips, toast } from "@/lib/store";

const STATUS = {
  planned: { label: "Planned", cls: "pill-blue" },
  disrupted: { label: "Disrupted", cls: "pill-pink" },
  risk: { label: "At Risk", cls: "pill-red" },
  watch: { label: "Watching", cls: "pill-amber" },
  safe: { label: "On Track", cls: "pill-green" },
};

function Trips() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    setTrips(getTrips());
    setLoading(false);
  }, []);

  const remove = () => {
    deleteTrip(confirmId);
    setTrips(getTrips());
    setConfirmId(null);
    toast("Trip deleted", "info");
  };

  const dup = (id) => {
    const copy = duplicateTrip(id);
    if (copy) {
      setTrips(getTrips());
      toast(`${copy.dest.city} trip duplicated`, "success");
    }
  };

  if (loading) {
    return (
      <div className="trips-grid">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 300, borderRadius: 22 }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="kicker">
            <Icon name="compass" size={14} /> YOUR JOURNEYS
          </span>
          <h1>My Trips</h1>
          <p className="sub">
            Every plan Atlas Agent has built for you, with live budget and risk status.
          </p>
        </div>
        <div className="actions">
          <Link href="/trip-planner" className="btn btn-purple">
            <Icon name="plus" size={16} /> New Trip
          </Link>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="empt">
          <div className="big-ic">
            <Icon name="plane" size={28} />
          </div>
          <h3>No trips yet</h3>
          <p>Plan your first trip and it will live here with its full report.</p>
          <Link href="/trip-planner" className="btn btn-purple btn-lg">
            <Icon name="sparkles" size={17} /> Plan a trip
          </Link>
        </div>
      ) : (
        <div className="trips-grid">
          <Link href="/trip-planner" className="new-trip">
            <span className="plus">
              <Icon name="plus" size={24} strokeWidth={2.4} />
            </span>
            Plan a new trip
          </Link>

          {trips.map((t) => {
            const status = STATUS[t.disruptions.length ? "disrupted" : t.risk] || STATUS.planned;
            const report = computeReport(t);
            const usage = Math.min(100, Math.round((t.forecast / t.budget) * 100));
            return (
              <div className="trip-tile" key={t.id}>
                {t.dest.image ? (
                  <img className="scene" src={t.dest.image} alt={t.dest.city} loading="lazy" />
                ) : (
                  <Scene type={t.dest.scene} className="scene" />
                )}
                <span className={`status pill ${status.cls}`}>{status.label}</span>
                <div className="t-body">
                  <div>
                    <div className="t-name">
                      {t.dest.flag} {placeLabel(t.dest)}
                    </div>
                    <div className="t-dates">
                      {fmtDate(t.startDate)} • {t.days} days • {t.travelers} traveler
                      {t.travelers > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="t-stats">
                    <span>
                      Forecast <b>{money(t.forecast)}</b>
                    </span>
                    <span>
                      Budget <b>{money(t.budget)}</b>
                    </span>
                  </div>
                  <div className="bar">
                    <span
                      style={{
                        width: `${usage}%`,
                        background:
                          t.risk === "risk" ? "var(--red)" : t.risk === "watch" ? "var(--amber)" : "var(--purple)",
                      }}
                    />
                  </div>
                  <div className="t-stats">
                    <span>
                      Score <b style={{ color: "var(--purple)" }}>{report.score}/100</b>
                    </span>
                    <span>
                      <Icon name="sparkles" size={13} style={{ display: "inline", verticalAlign: "-2px" }} />{" "}
                      {t.decisions.applied.length} optimizations
                    </span>
                  </div>
                  <div className="t-actions">
                    <button
                      className="btn btn-purple btn-sm"
                      onClick={() => router.push(`/dashboard/overview?trip=${t.id}`)}
                    >
                      Open
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => router.push(`/dashboard/report/${t.id}`)}
                    >
                      Report
                    </button>
                    <button className="icon-btn" onClick={() => dup(t.id)} aria-label="Duplicate trip" title="Duplicate">
                      <Icon name="copy" size={17} />
                    </button>
                    <button className="icon-btn" onClick={() => setConfirmId(t.id)} aria-label="Delete trip" title="Delete">
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={Boolean(confirmId)} onClose={() => setConfirmId(null)} title="Delete this trip?">
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
          The travel plan, budget state and agent log for this trip will be permanently removed
          from this device. This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={() => setConfirmId(null)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={remove}>
            <Icon name="trash" size={15} /> Delete trip
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 340, borderRadius: 22 }} />}>
      <Trips />
    </Suspense>
  );
}
