"use client";

import { useEffect, useState } from "react";
import Icon from "./Icons";

/* ---------- Toaster ---------- */

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let counter = 0;
    const handler = (e) => {
      const { message, type } = e.detail || {};
      const id = ++counter;
      setItems((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setItems((prev) =>
          prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        setTimeout(() => {
          setItems((prev) => prev.filter((t) => t.id !== id));
        }, 320);
      }, 3800);
    };
    window.addEventListener("triverse:toast", handler);
    return () => window.removeEventListener("triverse:toast", handler);
  }, []);

  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.leaving ? "leaving" : ""}`}>
          <span className={`toast-icon ${t.type || "info"}`}>
            <Icon
              name={t.type === "success" ? "check" : t.type === "warn" ? "warn" : "info"}
              size={15}
              strokeWidth={2.6}
            />
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Modal ---------- */

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Segmented budget bar ---------- */

export function SegmentedBar({ segments, budget, showSafeZone = true, height = 12 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const pct = (v) => Math.max(0, Math.min(100, (v / total) * 100));
  return (
    <div>
      <div className="bar-seg" style={{ height }} aria-hidden="true">
        {segments.map((s) => (
          <span
            key={s.key}
            style={{ width: `${pct(s.value)}%`, background: s.color }}
            title={`${s.key}: $${Math.round(s.value)}`}
          />
        ))}
      </div>
      {showSafeZone && (
        <div className="safe-zone">
          <span>Safe zone marker at {Math.round(budget)}</span>
          <span>—</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Score ring ---------- */

export function RingScore({ score, size = 132, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color =
    score >= 85 ? "#17b26a" : score >= 70 ? "#6c4cf1" : score >= 50 ? "#f5a623" : "#e13b50";
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.2,0.8,0.3,1)" }}
        />
      </svg>
      <div className="center">
        <span className="pct">{score}</span>
        <span className="lbl">score</span>
      </div>
    </div>
  );
}
