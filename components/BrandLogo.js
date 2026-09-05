"use client";

export default function BrandLogo({ light = false, showTagline = false, height = 32 }) {
  return (
    <img
      src="/logo.png"
      alt="Triverse"
      height={height}
      style={{
        display: "block",
        width: "auto",
        height,
        ...(light ? { filter: "brightness(0) invert(1)" } : {}),
      }}
    />
  );
}