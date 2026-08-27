"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icons";
import Scene from "@/components/Scene";
import { fmtDate, fmtDateShort, money, optimizeItinerary, timeStr, weekday } from "@/lib/engine";
import { saveTrip, toast } from "@/lib/store";
import useActiveTrip from "@/lib/useTrip";

const CAT = {
  TRANSIT: { icon: "plane", pill: "pill-gray" },
  DINING: { icon: "food", pill: "pill-purple-soft" },
  ACTIVITY: { icon: "pin", pill: "pill-purple" },
  LODGING: { icon: "bed", pill: "pill-blue" },
};

const CAT_LABEL = {
  TRANSIT: "TRANSIT",
  DINING: "DINING",
  ACTIVITY: "ACTIVITY",
  LODGING: "LODGING",
};

function itemIcon(it) {
  if (it.flight) return "plane";
  if (it.mode === "train") return "train";
  if (it.mode === "bus") return "bus";
  if (it.mode === "car") return "car";
  if (it.category === "DINING") return "food";
  if (it.category === "ACTIVITY") return "pin";
  return "calendar";
}

function RouteSchematic({ items }) {
  const stops = items
    .filter((i) => !i.removed)
    .map((i) => ({
      t: i.title.replace(/^Lunch at |^Dinner at |^Transfer to |^Flight Arrival|^Return Flight/, "").split(" ").slice(0, 3).join(" "),
      time: timeStr(i.time, 0),
    }))
    .slice(0, 6);
  return (
    <svg viewBox="0 0 320 46" style={{ width: "100%", height: 46 }} role="img" aria-label="Day route schematic">
      <path
        d={`M16 23 C ${40 + stops.length * 0} 6, ${280} 40, 304 23`}
        fill="none"
        stroke="#b9a6ff"
        strokeWidth="2.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      {stops.map((s, i) => {
        const x = 16 + (i / Math.max(1, stops.length - 1)) * 288;
        return (
          <g key={i}>
            <circle cx={x} cy={23} r={i === 0 || i === stops.length - 1 ? 6 : 4.5} fill="#6c4cf1" />
            {i === 0 || i === stops.length - 1 ? (
              <circle cx={x} cy={23} r={2} fill="#fff" />
            ) : null}
            <text x={x} y={8} textAnchor="middle" fontSize="8" fontWeight="700" fill="#878fa8">
              {s.time}
            </text>
            <text x={x} y={42} textAnchor="middle" fontSize="8" fontWeight="600" fill="#3d455f">
              {s.t}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Itinerary() {
  const { trip, refresh, loading } = useActiveTrip();
  const [day, setDay] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDay(1);
  }, [trip?.id]);

  const current = useMemo(() => {
    if (!trip) return null;
    return trip.itinerary.find((d) => d.day === day) || trip.itinerary[0];
  }, [trip, day]);

  const dayTotals = useMemo(() => {
    if (!current || !trip) return null;
    const t = trip.travelers;
    const sum = { Flights: 0, Accommodation: 0, Dining: 0, Activities: 0, Transit: 0 };
    const items = current.items.filter((i) => !i.removed);
    for (const it of items) {
      if (it.category === "DINING") sum.Dining += it.cost * t;
      else if (it.category === "ACTIVITY") sum.Activities += it.cost * t;
      else if (it.category === "TRANSIT" && !it.flight) sum.Transit += it.cost;
    }
    // Allocate booked costs so every day's TOTAL EST sums to the trip forecast:
    // flights split across arrival & departure days, hotel nights billed to the day they begin.
    if (trip.days === 1) {
      sum.Flights = trip.spend.flights;
    } else {
      const outbound = Math.round(trip.spend.flights / 2);
      if (current.day === 1) sum.Flights = outbound;
      else if (current.day === trip.days) sum.Flights = trip.spend.flights - outbound;
    }
    const hotelDays = Math.max(1, trip.days - 1);
    if (current.day <= hotelDays) {
      const perNight = Math.round(trip.spend.hotel / hotelDays);
      sum.Accommodation =
        current.day === hotelDays
          ? trip.spend.hotel - perNight * (hotelDays - 1)
          : perNight;
    }
    return sum;
  }, [current, trip]);

  if (loading) {
    return <div className="skeleton" style={{ height: 400, borderRadius: 22 }} />;
  }

  if (!trip || !current) {
    return (
      <div className="empt">
        <div className="big-ic">
          <Icon name="calendar" size={28} />
        </div>
        <h3>No itinerary yet</h3>
        <p>Plan a trip and Atlas Agent will lay out every day for you.</p>
        <Link href="/" className="btn btn-purple btn-lg">
          <Icon name="sparkles" size={17} /> Plan a trip
        </Link>
      </div>
    );
  }

  const total = dayTotals
    ? dayTotals.Flights + dayTotals.Accommodation + dayTotals.Dining + dayTotals.Activities + dayTotals.Transit
    : 0;

  const runOptimize = () => {
    setBusy(true);
    setTimeout(() => {
      const updated = JSON.parse(JSON.stringify(trip));
      const { logs } = optimizeItinerary(updated);
      saveTrip(updated);
      refresh();
      setBusy(false);
      const first = logs[0];
      toast(
        first.detail === "no changes needed" || logs.length === 1
          ? first.title
          : `Agent optimized: ${logs.map((l) => l.title).join(", ")}`,
        "success"
      );
    }, 700);
  };

  return (
    <div>
      <div className="page-head no-print">
        <div>
          <span className="kicker">
            <Icon name="calendar" size={14} /> DETAILED ITINERARY
          </span>
          <h1>{trip.dest.city} Explorer</h1>
          <p className="sub">
            A comprehensive, day-by-day guide balancing cultural immersion, culinary
            exploration, and seamless transit.
          </p>
        </div>
        <div className="actions">
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Icon name="download" size={16} /> EXPORT PDF
          </button>
          <button className="btn btn-dark" onClick={runOptimize} disabled={busy}>
            <Icon name="sparkles" size={16} style={{ color: "#9b7bff" }} />
            {busy ? "OPTIMIZING…" : "ASK AGENT TO OPTIMIZE"}
          </button>
        </div>
      </div>

      <div className="day-tabs" role="tablist" aria-label="Trip days">
        {trip.itinerary.map((d) => (
          <button
            key={d.day}
            role="tab"
            aria-selected={d.day === current.day}
            className={`day-tab ${d.day === current.day ? "on" : ""}`}
            onClick={() => setDay(d.day)}
          >
            Day {d.day}
            <small>
              {weekday(d.date)} • {fmtDateShort(d.date)}
            </small>
          </button>
        ))}
      </div>

      <div className="itin-grid">
        <div>
          <div className="timeline">
            {current.items
              .filter((i) => !i.removed)
              .map((it) => {
                const cat = CAT[it.category] || CAT.ACTIVITY;
                return (
                  <div className="tl-item" key={it.id}>
                    <span className="tl-ic">
                      <Icon name={itemIcon(it)} size={19} />
                    </span>
                    <div className="tl-main">
                      <div className="tl-time">
                        {timeStr(it.time, it.flight && it.category === "TRANSIT" && it.title === "Flight Arrival" ? trip.flight.delayedByH : 0)}
                        {it.duration ? ` — ${Math.round(it.duration / 15) * 15}m` : ""}
                      </div>
                      <div className="tl-title">{it.title}</div>
                      <div className="tl-desc">{it.desc}</div>
                      {it.flightInfo && (
                        <div style={{ marginTop: 7, fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
                          <Icon name="info" size={13} style={{ display: "inline", verticalAlign: "-2px" }} /> {it.flightInfo}
                        </div>
                      )}
                      {it.note && (
                        <span className="tl-note">
                          <Icon name="sparkles" size={13} /> {it.note}
                        </span>
                      )}
                      <div className="tl-tags">
                        <span className={`pill ${cat.pill}`}>{CAT_LABEL[it.category]}</span>
                        {it.tags.slice(0, 2).map((t) => (
                          <span className="pill pill-gray" key={t}>
                            {t}
                          </span>
                        ))}
                        {it.cost > 0 && (
                          <span className="pill pill-gray">
                            {money(it.cost)}
                            {it.category !== "TRANSIT" ? "/person" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    {it.scene && ["dining", "street-food", "temple", "market", "beach", "park", "garden", "rooftop", "mall", "palace", "gallery", "rice", "volcano", "jungle", "spa", "cooking"].includes(it.scene) && (
                      <div className="tl-thumb">
                        <Scene type={it.scene} style={{ width: "100%", height: "100%" }} />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div>
          <div className="summary-card">
            <h4>
              <span>
                Daily Summary
                <span className="pill pill-blue" style={{ marginLeft: 10 }}>
                  DAY {current.day}
                </span>
              </span>
            </h4>
            <p className="note">
              Estimated expenses for Day {current.day}. Flights are split across your
              arrival and departure days; hotel nights are billed to the day they begin.
            </p>
            {[
              { k: "Flights", icon: "plane", v: dayTotals.Flights, show: dayTotals.Flights > 0 },
              { k: "Accommodation", icon: "bed", v: dayTotals.Accommodation, show: dayTotals.Accommodation > 0 },
              { k: "Dining", icon: "food", v: dayTotals.Dining, show: dayTotals.Dining > 0 },
              { k: "Activities", icon: "pin", v: dayTotals.Activities, show: dayTotals.Activities > 0 },
              { k: "Transit", icon: "car", v: dayTotals.Transit, show: dayTotals.Transit > 0 },
            ]
              .filter((r) => r.show)
              .map((r) => (
                <div className="sum-row" key={r.k}>
                  <span className="s-ic">
                    <Icon name={r.icon} size={16} />
                  </span>
                  <span className="who">{r.k}</span>
                  <span className="amt mono">{money(r.v)}</span>
                </div>
              ))}
            <div className="sum-total">
              <span>TOTAL EST.</span>
              <span className="mono" style={{ fontSize: 22 }}>
                {money(total)}
              </span>
            </div>
            <div className="route-card">
              <div className="rh">
                <span>DAY {current.day} ROUTE</span>
                <span>{trip.dest.city}</span>
              </div>
              <RouteSchematic items={current.items} />
            </div>
            <p className="note" style={{ marginTop: 12, marginBottom: 0 }}>
              {fmtDate(current.date)} — the agent rechecks feasibility every time the plan
              changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 400, borderRadius: 22 }} />}>
      <Itinerary />
    </Suspense>
  );
}
