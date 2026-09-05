"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Toaster } from "@/components/ui";
import { getSession } from "@/lib/store";

const CRUMBS = {
  "/dashboard/overview": "Overview",
  "/dashboard/trips": "My Trips",
  "/dashboard/budget": "Budget",
  "/dashboard/itinerary": "Travel Plan",
  "/dashboard/agent": "Agent Activity",
  "/dashboard/report": "Trip Report",
  "/dashboard/settings": "Settings",
};

function DashShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/sign-in");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    setSideOpen(false);
  }, [pathname]);

  const tripId = searchParams.get("trip");
  const crumb = CRUMBS[pathname] || (pathname.startsWith("/dashboard/report") ? "Trip Report" : "Dashboard");

  if (!ready) {
    return (
      <div style={{ padding: 40 }}>
        <div className="skeleton" style={{ height: 48, marginBottom: 20, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 22 }} />
      </div>
    );
  }

  return (
    <div className="dash">
      <Toaster />
      <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} activeTrip={tripId} />
      <div className="dash-main">
        <Topbar crumb={crumb} onBurger={() => setSideOpen((v) => !v)} />
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40 }}>
          <div className="skeleton" style={{ height: 320, borderRadius: 22 }} />
        </div>
      }
    >
      <DashShell>{children}</DashShell>
    </Suspense>
  );
}
