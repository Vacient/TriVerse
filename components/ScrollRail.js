"use client";

// A slim, always-visible Telegram-style scroll rail for the Atlas Agent
// planning page. It replaces the native scrollbar there and mirrors the
// full page scroll from top to the very end. The thumb is draggable and
// clicking the track jumps the viewport.
import { useEffect, useRef, useState } from "react";

export default function ScrollRail() {
  const railRef = useRef(null);
  const thumbRef = useRef(null);
  const dragRef = useRef(null);
  const onRef = useRef(false);
  const [on, setOn] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const scrollable = max > 8;
      if (onRef.current !== scrollable) {
        onRef.current = scrollable;
        setOn(scrollable);
        if (!scrollable) setDragging(false);
      }
      if (!scrollable) return;
      const trackH = rail.clientHeight;
      const thumbH = Math.max(28, (window.innerHeight / doc.scrollHeight) * trackH);
      const travel = trackH - thumbH;
      const y = (window.scrollY / max) * travel;
      thumb.style.height = thumbH + "px";
      thumb.style.transform = "translateY(" + y + "px)";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    // Keep the thumb in sync as the agent adds steps/cards to the page.
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    document.body.classList.add("rail-active");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      document.body.classList.remove("rail-active");
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (clientY) => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const rect = railRef.current.getBoundingClientRect();
    const thumbH = thumbRef.current.offsetHeight;
    const travel = rect.height - thumbH;
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top - thumbH / 2) / travel));
    window.scrollTo({ top: ratio * max, behavior: "auto" });
  };

  const onPointerDown = (e) => {
    if (e.target !== thumbRef.current) return;
    e.preventDefault();
    setDragging(true);
    dragRef.current = { startY: e.clientY, startScroll: window.scrollY };
    railRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const rect = railRef.current.getBoundingClientRect();
    const thumbH = thumbRef.current.offsetHeight;
    const travel = rect.height - thumbH;
    if (travel <= 0) return;
    const delta = e.clientY - dragRef.current.startY;
    const next = dragRef.current.startScroll + (delta / travel) * max;
    window.scrollTo(0, Math.min(max, Math.max(0, next)));
  };

  const onPointerEnd = (e) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    if (railRef.current.hasPointerCapture(e.pointerId)) {
      railRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={railRef}
      className={"scroll-rail" + (on ? " on" : "") + (dragging ? " dragging" : "")}
      onClick={(e) => {
        if (e.target !== thumbRef.current) jumpTo(e.clientY);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      aria-hidden="true"
    >
      <div className="scroll-rail-track" />
      <div ref={thumbRef} className="scroll-rail-thumb" />
    </div>
  );
}
