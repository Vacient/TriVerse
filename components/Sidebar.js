"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icons";
import { getSession, getTrips } from "@/lib/store";

const NAV = [
  { href: "/dashboard/overview", label: "Overview", icon: "grid" },
  { href: "/dashboard/trips", label: "My Trips", icon: "compass" },
  { href: "/dashboard/budget", label: "Budget", icon: "wallet" },
  { href: "/dashboard/itinerary", label: "Itinerary", icon: "calendar" },
  { href: "/dashboard/agent", label: "Agent Activity", icon: "bot" },
  { href: "/dashboard/settings", label: "Settings", icon: "gear" },
];

export default function Sidebar({ open, onClose, activeTrip }) {
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [riskCount, setRiskCount] = useState(0);

  useEffect(() => {
    setSession(getSession());
    const trips = getTrips();
    setRiskCount(
      trips.filter((t) => t.risk === "risk" && t.decisions.declined.length === 0).length
    );
  }, [pathname]);

  return (
    <>
      {open && <div className="side-backdrop" onClick={onClose} />}
      <aside className={`side ${open ? "open" : ""}`} aria-label="Main navigation">
        <Link href="/" className="brand" onClick={onClose}>
          <span className="brand-mark">
            <Icon name="plane" size={18} />
          </span>
          Triverse
        </Link>

        <nav className="side-nav">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={activeTrip ? `${item.href}?trip=${activeTrip}` : item.href}
                className={`side-link ${active ? "active" : ""}`}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
                {item.href === "/dashboard/budget" && riskCount > 0 && (
                  <span className="badge">{riskCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="side-foot">
          <div className="side-user">
            <span className="avatar purple">
              {session?.name ? session.name.charAt(0).toUpperCase() : "G"}
            </span>
            <div className="who">
              <div className="n">{session?.name || "Guest traveler"}</div>
              <div className="e">{session?.email || "demo mode"}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
