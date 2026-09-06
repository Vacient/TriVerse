"use client";

// Floating, Telegram-style scroll-down button for the Atlas Agent planning
// page (flight/hotel choice). It stays visible while there is still content
// below the viewport and fades out automatically once the bottom of the page
// is reached. Clicking it smooth-scrolls the viewport down toward the next
// section.
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icons";

const EDGE = 48; // px of remaining scroll before the button hides

export default function ScrollDownButton() {
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);
  const shown = useRef(false);

  useEffect(() => {
    const measure = () => {
      raf.current = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const next = max > EDGE && window.scrollY < max - EDGE;
      if (shown.current !== next) {
        shown.current = next;
        setVisible(next);
      }
    };

    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(measure);
    };

    // Keep state in sync as the agent reveals new cards and the page grows.
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const scrollDown = () => {
    window.scrollBy({ top: Math.round(window.innerHeight * 0.85), behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={"scroll-down-btn" + (visible ? " on" : "")}
      onClick={scrollDown}
      aria-label="Scroll down"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="chevronDown" size={22} strokeWidth={2.4} />
    </button>
  );
}
