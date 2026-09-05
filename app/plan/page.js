"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icons";
import Scene from "@/components/Scene";
import ScrollRail from "@/components/ScrollRail";
import { Toaster } from "@/components/ui";
import { getDestination, getOrigin } from "@/lib/data";
import {
  ACHIEVEMENTS,
  FLIGHT_CLASSES,
  ROOM_TYPES,
  agentSteps,
  computeAchievements,
  finalizePlan,
  generatePlan,
  money,
} from "@/lib/engine";
import { getTrips, saveTrip, toast, unlockAchievements } from "@/lib/store";

function defaultDraft() {
  return {
    originId: "yangon",
    destinationId: "bangkok",
    startDate: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
    days: 5,
    budget: 350,
    travelers: 1,
    preferences: ["Food", "Shopping"],
  };
}

function PlanExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(null);
  const [draft, setDraft] = useState(null);
  const [step, setStep] = useState(0);
  const [flightPick, setFlightPick] = useState(null);
  const [hotelPick, setHotelPick] = useState(null);
  const [flightClassId, setFlightClassId] = useState("economy");
  const [roomTypeId, setRoomTypeId] = useState("standard");
  const [trip, setTrip] = useState(null);
  const [statusMsg, setStatusMsg] = useState("Initializing Atlas Agent…");
  const [perm, setPerm] = useState(0);
  const [error, setError] = useState(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // 1 — resolve input from sessionStorage draft or ?to= query
  useEffect(() => {
    const stored = sessionStorage.getItem("triverse:draft");
    let base = null;
    if (stored) {
      try {
        base = JSON.parse(stored);
      } catch {
        base = null;
      }
    }
    const to = searchParams.get("to");
    if (!base && !to) {
      // No form was filled — send the user back to the trip planner.
      router.replace("/trip-planner");
      return;
    }
    if (to && !base) base = { ...defaultDraft(), destinationId: to };
    if (to && base) base = { ...base, destinationId: to };
    const final = base;
    setInput(final);

    // 2 — call the server-side planning API, fall back to client engine
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(final),
        });
        const data = await res.json();
        if (!cancelled) {
          if (data.ok) setDraft(data.draft);
          else setDraft(generatePlan(final));
        }
      } catch {
        if (!cancelled) setDraft(generatePlan(final));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const dest = input ? getDestination(input.destinationId) : null;
  const origin = input ? getOrigin(input.originId) : null;
  const steps = useMemo(
    () =>
      trip
        ? agentSteps(trip)
        : [
            { title: "Understanding your preferences", detail: "Analyzing travel style and past trips" },
            { title: "Searching flights with Atlas", detail: "Querying live route inventory" },
            { title: "Comparing available options", detail: "Filtering by direct flights & minimal layovers" },
            { title: "Finding accommodation", detail: "Scoring stays against your preferences" },
            { title: "Building your travel plan", detail: "Structuring days around your signals" },
            { title: "Optimizing your budget", detail: "Balancing experiences with cost constraints" },
            { title: "Checking trip feasibility", detail: "Final budget validation" },
          ],
    [trip]
  );

  const permTotal = useMemo(() => {
    if (!draft) return 0;
    const base = draft.flightOptions.length * draft.hotelOptions.length * input.days;
    return base * (input.preferences.length || 1) * 14;
  }, [draft, input]);

  // Flight class & room type pickers: reprice every option from the selected
  // catalog entry and recompute budget fit so totals update live.
  const adjFlights = useMemo(() => {
    if (!draft) return [];
    const cls = FLIGHT_CLASSES.find((c) => c.id === flightClassId) || FLIGHT_CLASSES[0];
    const flightShare = draft.input.budget * 0.45;
    return draft.flightOptions.map((f) => {
      const price = Math.round(f.price * cls.mult);
      return {
        ...f,
        cabin: cls.label,
        classId: cls.id,
        price,
        fitsBudget: price * draft.input.travelers <= flightShare,
      };
    });
  }, [draft, flightClassId]);

  const adjHotels = useMemo(() => {
    if (!draft) return [];
    const rt = ROOM_TYPES.find((r) => r.id === roomTypeId) || ROOM_TYPES[0];
    const hotelShare = draft.input.budget * 0.55;
    return draft.hotelOptions.map((h) => {
      const nightly = Math.round(h.nightly * rt.mult);
      const total = nightly * h.nights * h.rooms;
      return {
        ...h,
        roomType: rt.label,
        beds: rt.beds,
        capacity: rt.capacity,
        nightly,
        total,
        fitsBudget: total <= hotelShare,
      };
    });
  }, [draft, roomTypeId]);

  // 3 — animated permutation counter
  useEffect(() => {
    if (!permTotal) return;
    const interval = setInterval(() => {
      setPerm((p) => {
        const next = p + Math.max(1, Math.round(permTotal / 90));
        if (next >= permTotal) {
          clearInterval(interval);
          return permTotal;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [permTotal]);

  // 4 — step machine
  useEffect(() => {
    if (!draft || trip) return;
    const statusByStep = [
      "Understanding your preferences",
      "Searching flights with Atlas",
      "Comparing available options",
      "Finding accommodation",
      "Building your travel plan",
      "Optimizing your budget",
      "Checking trip feasibility",
    ];

    if (step === 2 && flightPick === null) {
      setStatusMsg("Waiting for your flight preference");
      return;
    }
    if (step === 4 && hotelPick === null) {
      setStatusMsg("Waiting for your accommodation preference");
      return;
    }

    setStatusMsg(statusByStep[step] + "…");
    const t = setTimeout(() => {
      setStep((s) => Math.min(s + 1, 6));
    }, 1400 + Math.random() * 900);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [draft, step, flightPick, hotelPick, trip]);

  // 5 — finalize when the machine reaches the end
  useEffect(() => {
    if (!draft || flightPick === null || hotelPick === null || step < 6 || trip) return;
    const fi = adjFlights.findIndex((f) => f.id === flightPick);
    const hi = adjHotels.findIndex((h) => h.id === hotelPick);
    const built = finalizePlan(
      { ...draft, flightOptions: adjFlights, hotelOptions: adjHotels },
      { flightIndex: fi === -1 ? 1 : fi, hotelIndex: hi === -1 ? 1 : hi }
    );

    const stepsLog = agentSteps(built);
    stepsLog.forEach((s, i) =>
      built.agentLog.push({
        at: Date.now() - (7 - i) * 4000,
        type: "ok",
        title: s.title,
        detail: s.detail,
      })
    );

    // flight decision adjustment
    const valueFlight = adjFlights[1];
    if (built.flight.price < valueFlight.price) {
      built.agentLog.push({
        at: Date.now(),
        type: "adj",
        title: "Budget flight selected",
        detail: `${money(valueFlight.price - built.flight.price)} saved vs. direct option`,
      });
    } else if (built.flight.price > valueFlight.price) {
      built.agentLog.push({
        at: Date.now(),
        type: "adj",
        title: "Premium comfort selected",
        detail: `${money(built.flight.price - valueFlight.price)} added for direct service`,
      });
    }

    // hotel decision adjustment
    const valueHotel = adjHotels[0];
    if (built.hotel.total < valueHotel.total) {
      built.agentLog.push({
        at: Date.now(),
        type: "adj",
        title: `${built.hotel.area} hotel`,
        detail: `${money(valueHotel.total - built.hotel.total)} saved vs. baseline`,
      });
    } else {
      built.agentLog.push({
        at: Date.now(),
        type: "adj",
        title: `${built.hotel.name}`,
        detail: `${money(Math.max(0, built.hotel.total - valueHotel.total))} added for comfort tier`,
      });
    }

    saveTrip(built);
    setTrip(built);

    const all = getTrips();
    const achieved = computeAchievements(all);
    const { fresh } = unlockAchievements(achieved, Date.now());
    const meta = ACHIEVEMENTS.find((a) => a.id === fresh[0]);
    if (meta) toast(`Achievement unlocked: ${meta.name}`, "success");

    sessionStorage.removeItem("triverse:draft");
    setPerm(permTotal);
  }, [draft, step, flightPick, hotelPick, trip, adjFlights, adjHotels]);

  const adjustments = useMemo(() => {
    if (!draft || flightPick === null || hotelPick === null) return [];
    const out = [];
    const fp = adjFlights.find((f) => f.id === flightPick);
    const hp = adjHotels.find((h) => h.id === hotelPick);
    if (fp && adjFlights[1]) {
      const delta = fp.price - adjFlights[1].price;
      out.push({
        who: `${fp.airline.name} ${fp.airline.prefix} ${fp.number}`,
        amt: Math.abs(delta),
        kind: delta <= 0 ? "saved" : "added",
        label: delta <= 0 ? "SAVED" : "ADDED",
      });
    }
    if (hp && adjHotels[0]) {
      const delta = hp.total - adjHotels[0].total;
      out.push({
        who: `${hp.name}`,
        amt: Math.abs(delta),
        kind: delta <= 0 ? "saved" : "added",
        label: delta <= 0 ? "SAVED" : "ADDED",
      });
    }
    return out;
  }, [draft, flightPick, hotelPick, adjFlights, adjHotels]);

  if (error) {
    return (
      <div className="plan-wrap">
        <div className="container">
          <div className="empt">
            <div className="big-ic">
              <Icon name="warn" size={28} />
            </div>
            <h3>Atlas Agent hit turbulence</h3>
            <p>{error}</p>
            <Link href="/" className="btn btn-purple">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!draft || !input) {
    return (
      <div className="plan-wrap">
        <div className="container">
          <div className="skeleton" style={{ height: 260, borderRadius: 22, maxWidth: 1060, margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  const atFlightChoice = step >= 2 && flightPick === null && !trip;
  const atHotelChoice = step >= 4 && hotelPick === null && flightPick !== null && !trip;
  const done = Boolean(trip);

  return (
    <div className="plan-wrap">
      <ScrollRail />
      <Toaster />
      <div className="container">
        <div className="plan-head no-print">
          <span className="agent-badge">
            <Icon name="bot" size={15} style={{ color: "var(--purple)" }} />
            ATLAS AGENT — LIVE
          </span>
          <h1>Atlas Agent is planning your trip</h1>
          <p className="meta">
            {dest?.flag} {dest?.city} • {input.days} days • {money(input.budget)} budget •{" "}
            {input.travelers} traveler{input.travelers > 1 ? "s" : ""}
          </p>
        </div>

        <div className="plan-grid">
          <div className="plan-steps">
            {steps.map((s, i) => {
              const isDone = done || i < step || (i === 2 && flightPick !== null && step > 2);
              const isActive = !done && i === step && !atFlightChoice && !atHotelChoice;
              const isPending = !done && i > step;
              return (
                <div
                  key={s.title}
                  className={`step ${isDone ? "done" : ""} ${isActive ? "active" : ""} ${isPending ? "pending" : ""}`}
                >
                  <span className="step-ic">
                    {isDone ? <Icon name="check" size={16} strokeWidth={2.8} /> : <Icon name={i === 6 ? "shield" : i === 5 ? "graph" : i === 3 ? "bed" : i === 1 ? "search" : i === 0 ? "sparkles" : "calendar"} size={16} />}
                  </span>
                  <div className="step-body">
                    <div className="t">{s.title}</div>
                    <div className="d">{s.detail}</div>
                  </div>
                  {isActive && <span className="spinner" aria-label="Working" />}
                </div>
              );
            })}

            {atFlightChoice && (
              <div className="card card-pad" style={{ marginTop: 14 }}>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>
                  Atlas needs one call — pick your flight
                </h3>
                <p className="muted" style={{ fontSize: 13.5, marginBottom: 12 }}>
                  {draft.meta.origin.code} → {draft.meta.dest.code} • {draft.meta.origin.city} to{" "}
                  {draft.meta.dest.city}
                </p>
                <div className="class-row">
                  <label className="class-label" htmlFor="flight-class">
                    Flight class
                  </label>
                  <select
                    id="flight-class"
                    className="input select"
                    value={flightClassId}
                    onChange={(e) => setFlightClassId(e.target.value)}
                  >
                    {FLIGHT_CLASSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="choice-stack">
                  {adjFlights.map((f) => (
                    <button
                      key={f.id}
                      className={`choice ${flightPick === f.id ? "selected" : ""}`}
                      onClick={() => setFlightPick(f.id)}
                    >
                      <span className="ci">
                        <Icon name="plane" size={19} />
                      </span>
                      <span className="cm">
                        <span className="t">
                          {f.airline.name} {f.airline.prefix} {f.number}
                          {f.recommended && (
                            <span className="pill pill-purple-soft" style={{ marginLeft: 8 }}>
                              AI REC
                            </span>
                          )}
                          {f.fitsBudget && (
                            <span className="pill pill-green" style={{ marginLeft: 6 }}>
                              FITS BUDGET
                            </span>
                          )}
                        </span>
                        <br />
                        <span className="s">
                          {f.kind} · {f.cabin} · {f.layovers ? "1 stop" : "Direct"} · ~
                          {Math.floor(f.durationMin / 60)}h {f.durationMin % 60}m
                        </span>
                        <br />
                        <span className="s" style={{ color: "var(--purple)", fontWeight: 700 }}>
                          {draft.meta.origin.code} → {f.airport} ({draft.meta.dest.city})
                        </span>
                        <br />
                        <span className="s">{f.perks}</span>
                      </span>
                      <span className="cp">
                        {money(f.price)}
                        <small>per traveler</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {atHotelChoice && (
              <div className="card card-pad" style={{ marginTop: 14 }}>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>
                  Now your stay — {draft.meta.nights} night{draft.meta.nights > 1 ? "s" : ""}
                </h3>
                <p className="muted" style={{ fontSize: 13.5, marginBottom: 12 }}>
                  Scored against your preferences, budget and location quality.
                </p>
                <div className="class-row">
                  <label className="class-label" htmlFor="room-type">
                    Room type
                  </label>
                  <select
                    id="room-type"
                    className="input select"
                    value={roomTypeId}
                    onChange={(e) => setRoomTypeId(e.target.value)}
                  >
                    {ROOM_TYPES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="choice-stack">
                  {adjHotels.map((h) => (
                    <button
                      key={h.id}
                      className={`choice ${hotelPick === h.id ? "selected" : ""}`}
                      onClick={() => setHotelPick(h.id)}
                    >
                      <span className="ci">
                        <Icon name="bed" size={19} />
                      </span>
                      <span className="cm">
                        <span className="t">
                          {h.name}
                          {h.recommended && (
                            <span className="pill pill-purple-soft" style={{ marginLeft: 8 }}>
                              AI REC
                            </span>
                          )}
                          {h.fitsBudget && (
                            <span className="pill pill-green" style={{ marginLeft: 6 }}>
                              FITS BUDGET
                            </span>
                          )}
                        </span>
                        <br />
                        <span className="s">
                          {h.roomType} · {h.beds} · sleeps {h.capacity}/room · {h.rooms} room{h.rooms > 1 ? "s" : ""}
                        </span>
                        <br />
                        <span className="s">
                          {h.area} · {money(h.nightly)}/night · {h.breakfast ? "Breakfast included" : "No breakfast"} · {h.pool ? "Pool available" : "No pool"}
                        </span>
                      </span>
                      <span className="cp">
                        {money(h.total)}
                        <small>total stay</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {done && (
              <div className="card card-pad" style={{ marginTop: 14 }}>
                <div className="plan-done">
                  <div className="big">
                    <Icon name="check" size={34} strokeWidth={3} />
                  </div>
                  <h2>Your {dest.city} trip is ready</h2>
                  <p>
                    {trip.days}-day travel plan structured around{" "}
                    {trip.preferences.slice(0, 2).join(" & ")} with a{" "}
                    {money(trip.forecast)} forecast against your {money(trip.budget)} budget.
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      className="btn btn-purple btn-lg"
                      onClick={() => router.push(`/dashboard/overview?trip=${trip.id}`)}
                    >
                      Open my trip <Icon name="arrowRight" size={17} />
                    </button>
                    <button
                      className="btn btn-outline btn-lg"
                      onClick={() => router.push(`/dashboard/agent?trip=${trip.id}`)}
                    >
                      Review agent activity
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="plan-side">
            <div className="agent-status">
              <div className="h">
                <span
                  style={{
                    display: "flex",
                    width: 28,
                    height: 28,
                    borderRadius: 9,
                    background: "rgba(62,123,250,0.2)",
                    color: "#7fa7ff",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="bot" size={15} />
                </span>
                AGENT STATUS
              </div>
              <div className="msg">
                {done
                  ? `Plan complete — ${trip.itinerary.length} day${trip.itinerary.length > 1 ? "s" : ""} locked in`
                  : statusMsg}
              </div>
              <div className="sub">
                {done ? (
                  <>Forecast {money(trip.forecast)} • risk level: {trip.risk.toUpperCase()}</>
                ) : (
                  <>
                    Analyzing{" "}
                    <span className="permutations">{perm.toLocaleString()}</span> permutations
                  </>
                )}
              </div>
              {!done && (
                <div style={{ marginTop: 14 }}>
                  <div className="bar">
                    <span
                      style={{
                        width: `${((step + (flightPick ? 0.5 : 0) + (hotelPick ? 0.5 : 0)) / 7) * 100}%`,
                        background: "linear-gradient(90deg, #6c4cf1, #9b7bff)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="live-card">
              <h4>
                REAL-TIME ADJUSTMENTS
                {done && (
                  <span className="pill pill-green">
                    <Icon name="check" size={11} strokeWidth={3} /> LIVE
                  </span>
                )}
              </h4>
              {adjustments.length === 0 && !done && (
                <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
                  Adjustments appear as you make each choice.
                </p>
              )}
              {adjustments.map((a, i) => (
                <div className="adj" key={i}>
                  <span className="who">{a.who}</span>
                  <span className={`amt ${a.kind}`}>
                    {money(a.amt)} {a.label}
                  </span>
                </div>
              ))}
              {done && (
                <>
                  <div className="adj">
                    <span className="who">Local transit pass</span>
                    <span className="amt added">{money(12)} ADDED</span>
                  </div>
                  <div className="adj">
                    <span className="who">Budget headroom check</span>
                    <span className="amt saved">
                      {money(Math.max(0, trip.budget - trip.forecast))} REMAINING
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="live-card">
              <h4>TRIP PREVIEW</h4>
              <div style={{ marginTop: 12, borderRadius: 14, overflow: "hidden", height: 120 }}>
                {dest?.image ? (
                  <img
                    src={dest.image}
                    alt={dest.city}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <Scene type={dest?.scene || "city-night"} style={{ width: "100%", height: "100%" }} />
                )}
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600 }}>
                <span>
                  {origin?.code} ({origin?.city}) → {dest?.code} ({dest?.city})
                </span>
                <span className="muted">{input.days} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="plan-wrap">
          <div className="skeleton" style={{ height: 300, borderRadius: 22, maxWidth: 1060, margin: "0 auto" }} />
        </div>
      }
    >
      <PlanExperience />
    </Suspense>
  );
}
