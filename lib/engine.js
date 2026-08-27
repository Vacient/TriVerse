/* ============================================================
   TRIVERSE AI — Planning / budget / disruption engine
   Pure functions, shared by client and API routes.
   ============================================================ */

import { getDestination, getOrigin, PREFERENCES } from "./data";

/* ---------- utils ---------- */

export function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toLowerCase();
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const money = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

export function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function weekday(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function timeStr(minutes, delayH = 0) {
  const total = Math.round(minutes + (delayH || 0) * 60) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ---------- plan generation ---------- */

export function generatePlan(input) {
  const dest = getDestination(input.destinationId);
  const origin = getOrigin(input.originId);
  const days = Math.min(10, Math.max(1, Number(input.days) || 5));
  const travelers = Math.min(8, Math.max(1, Number(input.travelers) || 1));
  const budget = Math.min(20000, Math.max(50, Number(input.budget) || 350));
  const preferences = (input.preferences || []).filter((p) =>
    PREFERENCES.some((x) => x.id === p)
  );

  const basePrice = dest.flightPrice[origin.code] ?? 150;
  const rnd = mulberry32(hashString(JSON.stringify(input)));

  const airlines = [
    { name: "AirAsia", prefix: "FD" },
    { name: "Scoot", prefix: "TR" },
    { name: "Cathay Pacific", prefix: "CX" },
    { name: "Singapore Airlines", prefix: "SQ" },
    { name: "VietJet", prefix: "VJ" },
  ];

  const flightOptions = [
    {
      id: "f-budget",
      kind: "Budget",
      airline: airlines[Math.floor(rnd() * airlines.length)],
      number: 240 + Math.floor(rnd() * 700),
      price: Math.round(basePrice * 0.88),
      layovers: 1,
      durationMin: 250 + Math.floor(rnd() * 90),
      perks: "1 stop · 20kg checked bag",
    },
    {
      id: "f-value",
      kind: "Best value",
      airline: airlines[Math.floor(rnd() * airlines.length)],
      number: 240 + Math.floor(rnd() * 700),
      price: Math.round(basePrice),
      layovers: 0,
      durationMin: 130 + Math.floor(rnd() * 60),
      perks: "Direct · 23kg checked bag · meal included",
    },
    {
      id: "f-premium",
      kind: "Premium",
      airline: airlines[Math.floor(rnd() * airlines.length)],
      number: 240 + Math.floor(rnd() * 700),
      price: Math.round(basePrice * 1.55),
      layovers: 0,
      durationMin: 115 + Math.floor(rnd() * 45),
      perks: "Direct · lounge access · seat selection",
    },
  ];

  const nights = Math.max(1, days - 1);
  const hotelOptions = dest.hotels.map((h) => ({
    id: `h-${h.tier}`,
    ...h,
    nights,
    rooms: Math.ceil(travelers / 2),
    total: h.nightly * nights * Math.ceil(travelers / 2),
  }));

  return {
    draftId: uid(),
    input: {
      originId: input.originId,
      destinationId: input.destinationId,
      startDate: input.startDate,
      days,
      travelers,
      budget,
      preferences,
    },
    meta: {
      origin,
      dest,
      nights,
    },
    flightOptions,
    hotelOptions,
  };
}

function weightedPick(pool, rnd, prefs, used) {
  const available = used ? pool.filter((p) => !used.has(p.name)) : pool;
  const src = available.length ? available : pool;
  const weighted = src.map((item) => {
    const overlap = item.tags.filter((t) => prefs.includes(t)).length;
    return { item, w: 1 + overlap * 3 + rnd() };
  });
  weighted.sort((a, b) => b.w - a.w);
  const item = weighted[0].item;
  if (used) used.add(item.name);
  return item;
}

export function finalizePlan(draft, { flightIndex = 1, hotelIndex = 1 } = {}) {
  const { meta, input } = draft;
  const { origin, dest, nights } = meta;
  const prefs = input.preferences.length ? input.preferences : ["Food"];
  const rnd = mulberry32(hashString(draft.draftId + flightIndex + hotelIndex));

  const flight = draft.flightOptions[flightIndex] || draft.flightOptions[1];
  const hotel = draft.hotelOptions[hotelIndex] || draft.hotelOptions[1];

  const departMin = 6 * 60 + 30; // 06:30
  const flightH = Math.round(flight.durationMin / 60);
  const flightM = flight.durationMin % 60;
  const arriveMin = departMin + flight.durationMin + 60; // +1h airport time

  const itinerary = [];
  const days = input.days;

  for (let d = 0; d < days; d++) {
    const items = [];
    const used = new Set();
    const isFirst = d === 0;
    const isLast = d === days - 1;

    if (isFirst) {
      items.push({
        id: uid(),
        time: arriveMin,
        title: "Flight Arrival",
        desc: `Arrive at ${dest.city} Airport (${dest.code}). Proceed through immigration and baggage claim.`,
        category: "TRANSIT",
        cost: 0,
        duration: 60,
        tags: [],
        scene: "plane",
        flightInfo: `${flight.airline.name} ${flight.airline.prefix} ${flight.number} • Terminal 1`,
        flight: true,
      });

      const transfer = dest.transfers[dest.transfers.length - 1]; // car by default
      items.push({
        id: uid(),
        time: arriveMin + 90,
        title: `Airport Transfer to ${hotel.name}`,
        desc: `Private car transfer from ${dest.code} to ${hotel.name}, ${hotel.area}.`,
        category: "TRANSIT",
        cost: transfer.cost,
        duration: 45,
        tags: [],
        scene: "car",
        mode: transfer.mode,
        transferCosts: dest.transfers,
      });
    }

    const lunch = weightedPick(dest.foods, rnd, prefs, used);
    items.push({
      id: uid(),
      time: 12 * 60,
      title: lunch.name,
      desc: lunch.desc,
      category: "DINING",
      cost: lunch.cost,
      duration: 75,
      tags: lunch.tags,
      scene: lunch.scene,
    });

    if (!isLast || days === 1) {
      const attr = weightedPick(dest.attractions, rnd, prefs, used);
      items.push({
        id: uid(),
        time: 14 * 60,
        title: attr.name,
        desc: attr.desc,
        category: "ACTIVITY",
        cost: attr.cost,
        duration: attr.hours * 60,
        tags: attr.tags,
        scene: attr.scene,
      });
    }

    if (!isFirst) {
      const baseMorning = [...dest.attractions, ...dest.foods.filter((f) => f.cost <= 8)];
      const morningPool = baseMorning.filter(
        (p) => !p.tags.includes("Nightlife") && !p.name.includes("Night")
      );
      const morning = weightedPick(morningPool.length ? morningPool : baseMorning, rnd, prefs, used);
      const morningCategory = morning.tags.some((t) => ["Shopping", "Nature", "Culture", "Relaxation"].includes(t)) || !morning.tags.includes("Food")
        ? "ACTIVITY"
        : "DINING";
      items.unshift({
        id: uid(),
        time: 9 * 60,
        title: morning.name,
        desc: morning.desc,
        category: morningCategory,
        cost: morning.cost,
        duration: morning.hours ? morning.hours * 60 : 90,
        tags: morning.tags,
        scene: morning.scene,
      });
    }

    const dinner = weightedPick(dest.foods, rnd, prefs, used);
    items.push({
      id: uid(),
      time: 18 * 60 + 30,
      title: dinner.name,
      desc: dinner.desc,
      category: "DINING",
      cost: dinner.cost,
      duration: 90,
      tags: dinner.tags,
      scene: dinner.scene,
    });

    if (isLast) {
      items.push({
        id: uid(),
        time: 13 * 60 + 30,
        title: "Transfer to Airport",
        desc: `Head to ${dest.code} with your bags — check-in opens 2h before departure.`,
        category: "TRANSIT",
        cost: Math.round(dest.transfers[0].cost),
        duration: 45,
        tags: [],
        scene: "car",
      });
      items.push({
        id: uid(),
        time: 16 * 60,
        title: "Return Flight",
        desc: `Depart ${dest.code} for ${origin.code}. ${flightH}h ${flightM}m, arrival ${origin.city}.`,
        category: "TRANSIT",
        cost: 0,
        duration: flight.durationMin,
        tags: [],
        scene: "plane",
        flightInfo: `${flight.airline.name} ${flight.airline.prefix} ${flight.number + 1} • ${flight.layovers ? "1 stop" : "Direct"}`,
        flight: true,
      });
    }

    items.sort((a, b) => a.time - b.time);
    itinerary.push({ day: d + 1, date: addDays(input.startDate, d), items });
  }

  const trip = {
    id: uid(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: "planned",
    origin,
    dest,
    startDate: input.startDate,
    days,
    travelers: input.travelers,
    budget: input.budget,
    preferences: prefs,
    flight: {
      ...flight,
      departMin,
      arriveMin,
      depart: timeStr(departMin),
      arrive: timeStr(arriveMin),
      hours: flightH,
      minutes: flightM,
      delayedByH: 0,
    },
    hotel,
    itinerary,
    spend: { flights: 0, hotel: 0, dining: 0, activities: 0, transit: 0 },
    forecast: 0,
    spent: 0,
    remaining: 0,
    overrun: 0,
    risk: "safe",
    decisions: {
      flightChoice: flightIndex,
      hotelChoice: hotelIndex,
      applied: [],
      declined: [],
    },
    disruptions: [],
    agentLog: [],
  };

  recomputeBudget(trip);
  trip.recommendations = buildRecommendations(trip);
  return trip;
}

/* ---------- budget ---------- */

export function recomputeBudget(trip) {
  const t = trip.travelers;
  const s = { flights: 0, hotel: 0, dining: 0, activities: 0, transit: 0 };
  for (const day of trip.itinerary) {
    for (const it of day.items) {
      if (it.removed) continue;
      if (it.category === "DINING") s.dining += it.cost * t;
      else if (it.category === "ACTIVITY") s.activities += it.cost * t;
      else if (it.category === "TRANSIT") s.transit += it.cost;
    }
  }
  s.flights = trip.flight.price * t;
  s.hotel = trip.hotel.total;
  trip.spend = s;
  const forecast = s.flights + s.hotel + s.dining + s.activities + s.transit;
  trip.forecast = Math.round(forecast);
  trip.spent = Math.round(forecast * 0.8);
  trip.remaining = Math.max(0, trip.budget - trip.spent);
  trip.overrun = Math.max(0, trip.forecast - trip.budget);
  trip.risk = trip.forecast > trip.budget
    ? "risk"
    : trip.forecast >= trip.budget * 0.94
      ? "watch"
      : "safe";
  trip.updatedAt = Date.now();
  return trip;
}

export function insightText(trip) {
  const { dest, overrun, risk, budget, forecast } = trip;
  const headroom = budget - forecast;
  if (risk === "risk") {
    return {
      tone: "risk",
      text: `Your current spending pace is slightly higher than planned. Based on historical data for ${dest.city}, you may exceed your budget by ${money(overrun)}.`,
      cta: "Optimize Remaining Trip",
    };
  }
  if (risk === "watch") {
    return {
      tone: "watch",
      text: `You are tracking close to your limit with just ${money(headroom)} of headroom. One impulse purchase could push you over.`,
      cta: "Optimize Remaining Trip",
    };
  }
  return {
    tone: "safe",
    text: `You are pacing ${money(headroom)} under budget. If this holds, you will land well within your ${money(budget)} target.`,
    cta: "Keep Current Plan",
  };
}

/* ---------- recommendations ---------- */

export function buildRecommendations(trip) {
  const recs = [];
  const arrivalDay = trip.itinerary[0];
  const transferItem = arrivalDay.items.find(
    (it) => it.transferCosts && !it.removed
  );

  if (transferItem && transferItem.mode === "car") {
    const carCost = transferItem.cost;
    const train = transferItem.transferCosts.find((t) => t.mode !== "car");
    const save = Math.max(4, carCost - (train ? train.cost : 0));
    recs.push({
      id: "rail-transfer",
      icon: "train",
      title: "Replace airport taxi with rail link",
      detail: `Swap the private car for the ${train ? train.name : "public rail link"} and save ${money(save)}.`,
      save,
      available: save >= 4,
    });
  }

  const paid = [];
  for (const day of trip.itinerary.slice(0, -1)) {
    for (const it of day.items) {
      if (it.category === "ACTIVITY" && it.cost >= 5 && !it.removed) paid.push({ day, it });
    }
  }
  if (paid.length) {
    paid.sort((a, b) => b.it.cost - a.it.cost);
    const best = paid[0];
    recs.push({
      id: "free-attraction",
      icon: "ticket",
      title: "Free attraction swap",
      detail: `Replace "${best.it.title}" with a free viewpoint that matches your style — save ${money(best.it.cost)}.`,
      save: best.it.cost,
      available: true,
      target: best.it.id,
    });
  }

  if (trip.hotel.nights >= 2) {
    const save = Math.max(6, Math.round(trip.hotel.nightly * 0.4 * Math.min(2, trip.hotel.nights)));
    recs.push({
      id: "hotel-switch",
      icon: "bed",
      title: "Switch final two hotel nights",
      detail: `Move your last two nights to a nearby value stay while keeping the same area — save ${money(save)}.`,
      save,
      available: true,
    });
  }

  return recs;
}

export function applyRecommendation(trip, recId) {
  if (trip.decisions.applied.some((a) => a.id === recId)) return trip;
  const rec = trip.recommendations.find((r) => r.id === recId);
  if (!rec || !rec.available) return trip;

  if (recId === "rail-transfer") {
    const transferItem = trip.itinerary[0].items.find(
      (it) => it.transferCosts && !it.removed
    );
    if (transferItem) {
      const train = transferItem.transferCosts.find((t) => t.mode !== "car");
      transferItem.mode = train ? train.mode : "train";
      transferItem.cost = transferItem.cost - rec.save;
      transferItem.desc = `Take the ${train ? train.name : "airport rail link"} to ${trip.hotel.name}, ${trip.hotel.area}. Faster at rush hour.`;
      transferItem.note = `Optimized by agent — saved ${money(rec.save)}`;
      transferItem.scene = "train";
    }
  }

  if (recId === "free-attraction" && rec.target) {
    for (const day of trip.itinerary) {
      const it = day.items.find((x) => x.id === rec.target);
      if (it) {
        it.cost = 0;
        it.note = `Swapped to free viewpoint — saved ${money(rec.save)}`;
        it.title = `${it.title} (Free Viewpoint)`;
        break;
      }
    }
  }

  if (recId === "hotel-switch") {
    trip.hotel.note = `Final ${Math.min(2, trip.hotel.nights)} night(s) moved to value stay — saved ${money(rec.save)}`;
    trip.hotel.total = Math.max(0, trip.hotel.total - rec.save);
  }

  trip.decisions.applied.push({ id: recId, at: Date.now(), save: rec.save });
  trip.agentLog.push({
    at: Date.now(),
    type: "adj",
    title: `Applied: ${rec.title}`,
    detail: `${money(rec.save)} saved`,
  });
  recomputeBudget(trip);
  return trip;
}

export function declineRecommendation(trip, recId) {
  if (
    trip.decisions.applied.some((a) => a.id === recId) ||
    trip.decisions.declined.some((a) => a.id === recId)
  ) {
    return trip;
  }
  const rec = trip.recommendations.find((r) => r.id === recId);
  if (!rec) return trip;
  trip.decisions.declined.push({ id: recId, at: Date.now(), save: rec.save });
  trip.agentLog.push({
    at: Date.now(),
    type: "warn",
    title: `Declined: ${rec.title}`,
    detail: `Kept original plan — ${money(rec.save)} not saved`,
  });
  trip.updatedAt = Date.now();
  return trip;
}

export function autoOptimize(trip) {
  const best = trip.recommendations
    .filter(
      (r) =>
        r.available &&
        !trip.decisions.applied.some((a) => a.id === r.id) &&
        !trip.decisions.declined.some((d) => d.id === r.id)
    )
    .sort((a, b) => b.save - a.save)[0];
  if (!best) return { trip, applied: null };
  applyRecommendation(trip, best.id);
  return { trip, applied: best };
}

/* ---------- itinerary optimization ---------- */

export function optimizeItinerary(trip) {
  const before = trip.forecast;
  const logs = [];

  if (trip.forecast > trip.budget) {
    // Swap priciest paid activity for a free option
    let target = null;
    for (const day of trip.itinerary) {
      for (const it of day.items) {
        if (it.category === "ACTIVITY" && it.cost >= 5 && !it.removed) {
          if (!target || it.cost > target.it.cost) target = { it };
        }
      }
    }
    if (target) {
      const saved = target.it.cost;
      target.it.cost = 0;
      target.it.note = `Agent swapped to free alternative — saved ${money(saved)}`;
      logs.push({ title: "Trimmed a paid activity", detail: `${money(saved)} saved` });
    }

    // Downgrade car transfer if still over
    if (trip.forecast > trip.budget) {
      const transferItem = trip.itinerary[0].items.find(
        (it) => it.transferCosts && !it.removed && it.mode === "car"
      );
      if (transferItem) {
        const train = transferItem.transferCosts.find((t) => t.mode !== "car");
        const saved = transferItem.cost - (train ? train.cost : 0);
        if (saved > 0) {
          transferItem.mode = train.mode;
          transferItem.cost = train.cost;
          transferItem.note = `Agent switched to ${train.name} — saved ${money(saved)}`;
          logs.push({ title: "Switched airport transfer", detail: `${money(saved)} saved` });
        }
      }
    }
  } else {
    logs.push({
      title: "Itinerary already optimal",
      detail: `Forecast is ${money(trip.budget - trip.forecast)} under budget — no changes needed`,
    });
  }

  recomputeBudget(trip);
  logs.forEach((l) =>
    trip.agentLog.push({ at: Date.now(), type: "adj", title: l.title, detail: l.detail })
  );
  return { trip, logs, before };
}

/* ---------- disruption ---------- */

export function triggerDisruption(trip) {
  if (trip.disruptions.length) return { trip, event: null };

  const delayH = 4;
  const shift = delayH * 60;
  const day1 = trip.itinerary[0];
  const flightItem = day1.items.find((it) => it.flight && !it.returnFlight);
  const adjustments = [];

  // 1 — remove conflicting afternoon activity
  const conflict = day1.items.find(
    (it) => it.category === "ACTIVITY" && !it.removed
  );
  if (conflict) {
    day1.items = day1.items.filter((it) => it.id !== conflict.id);
    adjustments.push({
      title: "Removed Conflicting Activity",
      detail: `Original ${timeStr(conflict.time)} "${conflict.title}" slot was unviable.`,
    });
  }

  // 2 — reschedule dinner +2h
  const dinner = day1.items.find(
    (it) => it.category === "DINING" && it.time >= 17 * 60 && !it.removed
  );
  if (dinner) {
    dinner.time += 2 * 60;
    dinner.note = "Rescheduled by agent after flight delay";
    adjustments.push({
      title: "Rescheduled Dinner",
      detail: `Pushed reservation from ${timeStr(dinner.time - 120)} to ${timeStr(dinner.time)}.`,
    });
  }

  // 3 — preserve preferences: move matching item to tomorrow
  if (trip.days > 1 && conflict) {
    const day2 = trip.itinerary[1];
    day2.items = day2.items.filter((it) => it.id !== conflict.id);
    const taken = new Set(day2.items.map((it) => it.time));
    conflict.time = taken.has(9 * 60) ? 11 * 60 : 9 * 60;
    conflict.note = "Moved to tomorrow to preserve your priority";
    day2.items = [...day2.items, conflict].sort((a, b) => a.time - b.time);
    adjustments.push({
      title: "Preserved Preferences",
      detail: `"${conflict.title}" moved to Tomorrow to ensure your ${conflict.tags[0] || "top"} priority.`,
    });
  }

  // 4 — retime arrival-day plans past the delayed arrival
  const newArrival = (flightItem ? flightItem.time : 9 * 60) + shift;
  let retimed = 0;
  for (const it of day1.items) {
    if (it.removed || it.title === "Flight Arrival" || it.time >= newArrival + 30) continue;
    it.time += shift;
    retimed += 1;
  }
  if (retimed) {
    adjustments.push({
      title: "Retimed Arrival Day",
      detail: `Shifted ${retimed} arrival-day plan${retimed === 1 ? "" : "s"} past the new ${timeStr(newArrival)} arrival.`,
    });
  }

  // 5 — budget verified
  adjustments.push({
    title: "Budget Impact Verified",
    detail: "Cancellation fees avoided. Net change: $0.",
  });

  trip.flight.delayedByH = delayH;
  trip.flight.arrive = timeStr(trip.flight.arriveMin, delayH);
  trip.status = "disrupted";
  trip.disruptions.push({
    id: uid(),
    at: Date.now(),
    flight: `${trip.flight.airline.name} ${trip.flight.airline.prefix} ${trip.flight.number}`,
    delayH,
    adjustments,
  });

  trip.agentLog.push({
    at: Date.now(),
    type: "warn",
    title: `Disruption: ${trip.flight.airline.name} ${trip.flight.airline.prefix} ${trip.flight.number} delayed ${delayH}h`,
    detail: "Triverse AI reorganized the itinerary automatically",
  });
  adjustments.forEach((a) =>
    trip.agentLog.push({ at: Date.now(), type: "ok", title: a.title, detail: a.detail })
  );

  recomputeBudget(trip);
  return { trip, event: trip.disruptions[0] };
}

/* ---------- agent steps ---------- */

export function agentSteps(trip) {
  return [
    {
      title: "Understanding your preferences",
      detail: `Analyzed travel style and past trips — top signals: ${trip.preferences.slice(0, 3).join(", ")}.`,
    },
    {
      title: "Searching flights with Atlas",
      detail: `Found ${trip.flightOptions?.length || 3} potential routes from ${trip.origin.code} to ${trip.dest.code}.`,
    },
    {
      title: "Comparing available options",
      detail: "Filtered by direct flights & minimal layovers.",
    },
    {
      title: "Finding accommodation",
      detail: `Secured ${trip.hotel.name} stay in ${trip.hotel.area}.`,
    },
    {
      title: "Building your itinerary",
      detail: `Structured ${trip.days} ${trip.days === 1 ? "day" : "days"} of activities around ${trip.preferences.slice(0, 2).join(" & ")}.`,
    },
    {
      title: "Optimizing your budget",
      detail: `Balancing luxury experiences with overall cost constraints — forecast ${money(trip.forecast)}.`,
    },
    {
      title: "Checking trip feasibility",
      detail:
        trip.risk === "risk"
          ? `Budget finalization flagged ${money(trip.overrun)} over — recommendations ready.`
          : "Budget finalization complete — plan is feasible.",
    },
  ];
}

/* ---------- report ---------- */

export function computeReport(trip) {
  const { budget, forecast, overrun } = trip;
  const applied = trip.decisions.applied;
  const declined = trip.decisions.declined;
  const decided = applied.length + declined.length;

  const budgetScore =
    forecast <= budget
      ? 100
      : Math.max(0, Math.round(100 - (overrun / budget) * 100));
  const decisionScore = decided === 0 ? 70 : Math.round((applied.length / decided) * 100);
  const disruptionScore = trip.disruptions.length ? 100 : 75;

  const score = Math.round(
    budgetScore * 0.55 + decisionScore * 0.3 + disruptionScore * 0.15
  );

  const level =
    score >= 85
      ? "Expert Traveler"
      : score >= 70
        ? "Smart Planner"
        : score >= 50
          ? "Balanced Explorer"
          : "Needs Guidance";

  const strengths = [];
  const weaknesses = [];

  if (forecast <= budget) {
    strengths.push(`Forecast ${money(headroomOf(trip))} under your ${money(budget)} budget`);
  } else {
    weaknesses.push(`Forecast exceeded budget by ${money(overrun)}`);
  }
  if (applied.length >= 2) {
    strengths.push(`Applied ${applied.length} AI optimizations totaling ${money(applied.reduce((s, a) => s + a.save, 0))} saved`);
  } else if (decided > 0 && applied.length === 0) {
    weaknesses.push(`Declined all ${declined.length} optimization suggestions while over plan`);
  }
  if (trip.disruptions.length) {
    strengths.push("Handled a live flight disruption with zero budget impact");
  }
  if (trip.preferences.length >= 3) {
    strengths.push(`Rich preference profile (${trip.preferences.length} signals) for sharper AI planning`);
  }
  if (trip.risk === "watch" && applied.length === 0) {
    weaknesses.push("Riding close to the budget edge with no buffer");
  }

  const breakdown = [
    { key: "Flights", value: trip.spend.flights, color: "#131a2e" },
    { key: "Hotel", value: trip.spend.hotel, color: "#6c4cf1" },
    { key: "Activities", value: trip.spend.activities, color: "#3e7bfa" },
    { key: "Dining", value: trip.spend.dining, color: "#ff4d7d" },
    { key: "Transit", value: trip.spend.transit, color: "#17b26a" },
  ];

  const nextSteps = [];
  if (trip.risk === "risk") nextSteps.push("Apply pending budget recommendations before departure.");
  if (declined.length) nextSteps.push(`Reconsider ${declined.length} declined saving idea${declined.length > 1 ? "s" : ""} — they cost ${money(declined.reduce((s, d) => s + d.save, 0))} in total.`);
  if (!trip.disruptions.length) nextSteps.push("Enable live disruption protection before you fly.");
  nextSteps.push("Share the itinerary PDF with your travel companions.");

  return {
    score,
    percentage: score,
    level,
    budgetScore,
    decisionScore,
    disruptionScore,
    correct: applied.length + (forecast <= budget ? 1 : 0),
    risky: declined.length + (forecast > budget ? 1 : 0),
    strengths,
    weaknesses,
    breakdown,
    nextSteps,
  };
}

function headroomOf(trip) {
  return Math.max(0, trip.budget - trip.forecast);
}

/* ---------- achievements ---------- */

export const ACHIEVEMENTS = [
  { id: "first-trip", icon: "compass", name: "First Journey", desc: "Plan your first trip with Atlas Agent" },
  { id: "budget-guardian", icon: "shield", name: "Budget Guardian", desc: "Finish planning with forecast at or under budget" },
  { id: "optimizer", icon: "sparkles", name: "Smart Optimizer", desc: "Apply 3 AI recommendations" },
  { id: "risk-navigator", icon: "radar", name: "Risk Navigator", desc: "Resolve a live disruption with zero budget impact" },
  { id: "globetrotter", icon: "globe", name: "Globetrotter", desc: "Plan trips to 3 different destinations" },
  { id: "taste-maker", icon: "star", name: "Taste Maker", desc: "Pick 4+ preferences for a single trip" },
];

export function computeAchievements(trips) {
  const unlocked = {};
  const check = (id, at) => {
    if (!unlocked[id]) unlocked[id] = at;
  };
  const cities = new Set();
  for (const t of trips) {
    check("first-trip", t.createdAt);
    cities.add(t.dest.id);
    if (t.forecast <= t.budget) check("budget-guardian", t.updatedAt);
    if (t.decisions.applied.length >= 3) check("optimizer", t.updatedAt);
    if (t.disruptions.length) check("risk-navigator", t.disruptions[0].at);
    if (t.preferences.length >= 4) check("taste-maker", t.createdAt);
  }
  if (cities.size >= 3) {
    const latest = trips.reduce((m, t) => Math.max(m, t.createdAt), 0);
    check("globetrotter", latest);
  }
  return unlocked;
}
