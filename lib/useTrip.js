"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrip, getTrips } from "./store";

/* Resolves the trip a dashboard page should show:
   1) ?trip=<id> query param, else
   2) the most recently updated trip, else null. */
export default function useActiveTrip() {
  const searchParams = useSearchParams();
  const tripParam = searchParams.get("trip");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let t = tripParam ? getTrip(tripParam) : null;
    if (!t) {
      const all = getTrips();
      t = all[0] || null;
    }
    setTrip(t);
    setLoading(false);
  }, [tripParam]);

  const refresh = () => {
    const t = tripParam ? getTrip(tripParam) : getTrips()[0] || null;
    setTrip(t);
    return t;
  };

  return { trip, setTrip, refresh, loading };
}
