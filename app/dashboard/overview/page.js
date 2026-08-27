"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icons";
import { Modal, SegmentedBar } from "@/components/ui";
import { ACHIEVEMENTS, computeAchievements, fmtDate, insightText, money, recomputeBudget, timeAgo } from "@/lib/engine";
import { getTrips, saveTrip, toast } from "@/lib/store";
import useActiveTrip from "@/lib/useTrip";

function Overview() {
  const router = useRouter();
  const { trip, refresh, loading } = useActiveTrip();
  const [editOpen, setEditOpen] = useState(false);
  const [editBudget, setEditBudget] = useState(0);
  const [editTravelers, setEditTravelers] = useState(1);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(getTrips());
  }, [trip]);

  const insight = trip ? insightText(trip) : null;

  const segments = useMemo(() => {
    if (!trip) return [];
    return [
      { key: "Flights", value: trip.spend.flights, color: "#131a2e" },
      { key: "Hotel", value: trip.spend.hotel, color: "#6c4cf1" },
      { key: "Activities", value: trip.spend.activities, color: "#3e7bfa" },
      { key: "Dining", value: trip.spend.dining, color: "#ff4d7d" },
      { key: "Transit", value: trip.spend.transit, color: "#17b26a" },
    ];
  }, [trip]);

  const unlockedList = useMemo(() => {
    if (!trips.length) return [];
    const map = computeAchievements(trips);
    return ACHIEVEMENTS.filter((a) => map[a.id]).slice(0, 4);
  }, [trips]);

  const openEdit = () => {
    if (!trip) return;
    setEditBudget(trip.budget);
    setEditTravelers(trip.travelers);
    setEditOpen(true);
  };

  const saveEdit = () => {
    const travelers = Math.max(1, editTravelers);
    const updated = { ...trip, budget: Math.max(50, editBudget), travelers };
    if (travelers !== trip.travelers) {
      // Re-price the hotel block for the new room count, preserving any applied savings.
      const perRoomCost = trip.hotel.total / Math.max(1, trip.hotel.rooms);
      const rooms = Math.ceil(travelers / 2);
      updated.hotel = { ...trip.hotel, rooms, total: Math.round(perRoomCost * rooms) };
    }
    recomputeBudget(updated);
    updated.agentLog.push({
      at: Date.now(),
      type: "adj",
      title: "Trip details edited",
      detail: `Budget ${money(updated.budget)} • ${updated.travelers} traveler(s)`,
    });
    saveTrip(updated);
    setEditOpen(false);
    refresh();
    toast("Trip updated — budget recalculated", "success");
  };

  if (loading) {
    return (
      <>
        <div className="skeleton" style={{ height: 44, marginBottom: 24, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 340, borderRadius: 22 }} />
      </>
    );
  }

  if (!trip) {
    return (
      <div className="empt">
        <div className="big-ic">
          <Icon name="plane" size={28} />
        </div>
        <h3>No trips yet</h3>
        <p>Let Atlas Agent plan your first journey — it takes under a minute.</p>
        <Link href="/" className="btn btn-purple btn-lg">
          <Icon name="sparkles" size={17} /> Plan a trip
        </Link>
      </div>
    );
  }

  const dateLabel = `${fmtDate(trip.startDate)}`;
  const endLabel = trip.itinerary.length
    ? fmtDate(trip.itinerary[trip.itinerary.length - 1].date)
    : dateLabel;

  return (
    <div>
      {/* ---------- Header ---------- */}
      <div className="page-head">
        <div>
          <span className="kicker">
            <Icon name="pin" size={14} /> TRIP DASHBOARD
          </span>
          <h1>{trip.dest.city}</h1>
          <p className="sub">
            {dateLabel} – {endLabel} • {trip.days} days • {trip.travelers} traveler
            {trip.travelers > 1 ? "s" : ""}
          </p>
        </div>
        <div className="actions">
          {trips.length > 1 && (
            <select
              className="input select"
              style={{ width: 220 }}
              value={trip.id}
              onChange={(e) => router.replace(`/dashboard/overview?trip=${e.target.value}`)}
              aria-label="Switch trip"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.dest.city} — {fmtDate(t.startDate)}
                </option>
              ))}
            </select>
          )}
          <span className="monitor-pill">
            <span className="pulse-dot" /> AGENT MONITORING
          </span>
          <div className="avatar-stack">
            <span className="avatar purple">
              {trip.origin.city.charAt(0)}
            </span>
            <span className="avatar">T</span>
            <span className="avatar more">{trip.travelers}+</span>
          </div>
          <button className="btn btn-purple btn-sm" onClick={openEdit}>
            <Icon name="pencil" size={15} /> Edit Trip
          </button>
        </div>
      </div>

      <div className="ov-grid">
        <div className="ov-left">
          {/* ---------- Budget overview ---------- */}
          <div className="budget-card">
            <div className="budget-head">
              <span className="micro">BUDGET OVERVIEW</span>
              <span className={`pill ${trip.risk === "risk" ? "pill-red" : trip.risk === "watch" ? "pill-amber" : "pill-green"}`}>
                {trip.risk === "risk" ? "Risk" : trip.risk === "watch" ? "Watch" : "Safe zone"}
              </span>
            </div>
            <div className="budget-total mono">{money(trip.budget)}</div>
            <div className="budget-stats">
              <div className="budget-stat">
                <div className="k">SPENT</div>
                <div className="v mono">{money(trip.spent)}</div>
              </div>
              <div className="budget-stat">
                <div className="k">{trip.overrun > 0 ? "OVER BY" : "REMAINING"}</div>
                <div className={`v mono ${trip.overrun > 0 ? "neg" : ""}`}>
                  {money(trip.overrun > 0 ? trip.overrun : trip.remaining)}
                </div>
              </div>
              <div className="budget-stat">
                <div className="k">FORECAST</div>
                <div className={`v mono ${trip.overrun > 0 ? "neg" : "pos"}`}>{money(trip.forecast)}</div>
              </div>
            </div>
            <SegmentedBar segments={segments} budget={trip.budget} />
            <div className="legend">
              {segments.map((s) => (
                <span key={s.key}>
                  <i className="sw" style={{ background: s.color }} />
                  {s.key}
                </span>
              ))}
            </div>
          </div>

          {/* ---------- Detail cards ---------- */}
          <div className="detail-cards">
            <div className="detail-card">
              <div className="dh">
                <span className="ic">
                  <Icon name="plane" size={18} />
                </span>
                <h3>Transportation</h3>
                <span className="pill pill-gray">BEST VALUE</span>
              </div>
              <div className="route-mini">
                {trip.origin.code}
                <span className="dash-line">
                  <Icon name="plane" size={14} />
                </span>
                {trip.dest.code}
              </div>
              <div className="detail-row">
                <span>Airline</span>
                <b>
                  {trip.flight.airline.name} {trip.flight.airline.prefix} {trip.flight.number}
                </b>
              </div>
              <div className="detail-row">
                <span>Route</span>
                <b>
                  {trip.flight.layovers ? "1 stop" : "Direct"} • ~{trip.flight.hours}h {trip.flight.minutes}m
                </b>
              </div>
              {trip.flight.delayedByH > 0 && (
                <div className="detail-row">
                  <span>Status</span>
                  <b style={{ color: "var(--red)" }}>Delayed {trip.flight.delayedByH}h — resolved</b>
                </div>
              )}
              <div className="detail-row total">
                <span>Total</span>
                <b>{money(trip.spend.flights)}</b>
              </div>
            </div>

            <div className="detail-card">
              <div className="dh">
                <span className="ic">
                  <Icon name="bed" size={18} />
                </span>
                <h3>Accommodation</h3>
                <span className="pill pill-purple-soft">AI REC</span>
              </div>
              <div className="detail-row">
                <span>Hotel</span>
                <b>{trip.hotel.name}</b>
              </div>
              <div className="detail-row">
                <span>Area</span>
                <b>{trip.hotel.area}</b>
              </div>
              <div className="detail-row">
                <span>Stay</span>
                <b>
                  {trip.hotel.nights} night{trip.hotel.nights > 1 ? "s" : ""} @ {money(trip.hotel.nightly)}/night
                </b>
              </div>
              {trip.hotel.note && (
                <div className="detail-row">
                  <span>Agent note</span>
                  <b style={{ color: "var(--green-deep)" }}>{trip.hotel.note}</b>
                </div>
              )}
              <div className="detail-row total">
                <span>Total</span>
                <b>{money(trip.hotel.total)}</b>
              </div>
            </div>
          </div>

          {/* ---------- Achievements ---------- */}
          {unlockedList.length > 0 && (
            <div className="card card-pad">
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Achievements</h3>
              <div className="ach-strip">
                {unlockedList.map((a) => (
                  <span className="ach" key={a.id} title={a.desc}>
                    <span className="a-ic">
                      <Icon name={a.icon} size={15} />
                    </span>
                    {a.name}
                  </span>
                ))}
                {unlockedList.length < 4 && (
                  <span className="ach locked">
                    <span className="a-ic">
                      <Icon name="star" size={15} />
                    </span>
                    +{4 - unlockedList.length} more to unlock
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ov-right" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ---------- Agent insight ---------- */}
          <div className="insight-card">
            <div className="h">
              <span className="ic">
                <Icon name="home" size={15} />
              </span>
              AGENT INSIGHT
            </div>
            <p className="msg">{insight.text}</p>
            <Link
              href={`/dashboard/budget?trip=${trip.id}`}
              className="btn btn-purple"
            >
              {insight.cta} <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          {/* ---------- Recent activity ---------- */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>Recent agent activity</h3>
            {trip.agentLog.length === 0 && (
              <p className="muted" style={{ fontSize: 13.5, marginTop: 8 }}>
                Atlas Agent is quiet — activity will appear as the trip evolves.
              </p>
            )}
            {trip.agentLog
              .slice(-4)
              .reverse()
              .map((l, i) => (
                <div className="act-mini" key={i}>
                  <span className={`toast-icon ${l.type === "warn" ? "warn" : l.type === "ok" ? "success" : "info"}`}>
                    <Icon name={l.type === "warn" ? "warn" : l.type === "ok" ? "check" : "sparkles"} size={14} strokeWidth={2.6} />
                  </span>
                  <span>
                    <span className="t">{l.title}</span>
                    <br />
                    <span className="s">{l.detail}</span>
                  </span>
                  <span className="when">{timeAgo(l.at)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ---------- Edit modal ---------- */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit trip">
        <div className="settings-form">
          <div className="field">
            <label htmlFor="e-budget">Budget (USD)</label>
            <div className="input-wrap">
              <Icon name="dollar" size={16} />
              <input
                id="e-budget"
                className="input with-icon"
                type="number"
                min={50}
                step={10}
                value={editBudget}
                onChange={(e) => setEditBudget(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="e-travelers">Travelers</label>
            <div className="input-wrap">
              <Icon name="users" size={16} />
              <input
                id="e-travelers"
                className="input with-icon"
                type="number"
                min={1}
                max={8}
                value={editTravelers}
                onChange={(e) => setEditTravelers(Number(e.target.value))}
              />
            </div>
          </div>
          <p className="muted" style={{ fontSize: 13 }}>
            Changing these values recalculates your spend allocation and risk level.
          </p>
          <button className="btn btn-purple btn-block" onClick={saveEdit}>
            Save changes
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 340, borderRadius: 22 }} />}>
      <Overview />
    </Suspense>
  );
}
