"use client";

import { useId } from "react";

/* ============================================================
   Scene — rich, atmospheric SVG illustrations
   ============================================================ */

function Stars({ count = 18, color = "#ffffff" }) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const x = ((i * 47 + 11) % 100) * 1.9 + 4;
    const y = ((i * 59 + 7) % 100) * 0.85;
    const r = (i % 4) * 0.35 + 0.5;
    dots.push(
      <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={0.35 + (i % 3) * 0.2} />
    );
  }
  return <g style={{ mixBlendMode: "screen" }}>{dots}</g>;
}

function Moon({ cx = 155, cy = 32, r = 18 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff8e7" opacity="0.95" />
      <circle cx={cx + 5} cy={cy - 3} r={r - 4} fill="#fffdf5" opacity="0.5" />
      <circle cx={cx - 7} cy={cy - 5} r={r * 0.3} fill="#fef3c7" opacity="0.3" />
    </g>
  );
}

function Clouds({ y = 20, count = 3 }) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const cx = 20 + i * 70 + ((i * 31) % 40);
    const cy = y + ((i * 17) % 18);
    items.push(
      <g key={i} opacity={0.25 + i * 0.08}>
        <ellipse cx={cx} cy={cy} rx={28 + i * 6} ry={8 + i * 2} fill="#fff" />
        <ellipse cx={cx - 14} cy={cy + 3} rx={16} ry={6} fill="#fff" />
        <ellipse cx={cx + 12} cy={cy + 2} rx={14} ry={5} fill="#fff" />
      </g>
    );
  }
  return <g>{items}</g>;
}

/* ---- Gradient helpers ---- */
function SkyGrad({ uid, stops }) {
  return (
    <defs>
      <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
        {stops.map((c, i) => (
          <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
  );
}

export default function Scene({ type = "city-night", className = "", style }) {
  const uid = useId().replace(/[:]/g, "");
  const g = (id) => `url(#${uid}-${id})`;

  let skyStops = ["#0d0f2b", "#1a1a4e", "#2d2070"];
  let art = null;

  switch (type) {

    /* ================================================================
       CITY NIGHT — deep atmospheric skyline with glowing windows
       ================================================================ */
    case "city-night":
      skyStops = ["#0a0c24", "#151840", "#2a1f6e", "#4a3598"];
      art = (
        <>
          <Moon cx={155} cy={30} r={16} />
          <Stars count={14} />
          <Clouds y={48} count={3} />
          {/* far skyline */}
          <path d="M0 130 L0 78 L16 78 L16 64 L30 64 L30 82 L46 82 L46 50 L62 50 L62 72 L78 72 L78 38 L94 38 L94 60 L110 60 L110 82 L128 82 L128 54 L144 54 L144 70 L160 70 L160 44 L176 44 L176 76 L194 76 L194 62 L200 62 L200 130 Z" fill="#15173d" />
          {/* windows */}
          {Array.from({ length: 28 }).map((_, i) => {
            const x = 10 + ((i * 31) % 180);
            const y = 58 + ((i * 17) % 56);
            if (y > 82) return null;
            const lit = ((i * 7 + 3) % 10) < 7;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={4.5}
                height={5.5}
                rx={0.8}
                fill={lit ? (i % 3 === 0 ? "#ffd66b" : i % 3 === 1 ? "#9fc2ff" : "#fff") : "#1a1c44"}
                opacity={lit ? 0.9 : 0.5}
              />
            );
          })}
          {/* midground buildings */}
          <path d="M0 130 L0 94 L24 94 L24 72 L42 72 L42 96 L60 96 L60 64 L78 64 L78 86 L96 86 L96 52 L114 52 L114 78 L132 78 L132 68 L150 68 L150 90 L170 90 L170 58 L188 58 L188 88 L200 88 L200 130 Z" fill="#0e1133" opacity="0.9" />
          {/* foreground glow */}
          <path d="M0 112 C36 104 72 116 108 108 C144 100 170 112 200 106 L200 130 L0 130 Z" fill="#1a1f55" opacity="0.7" />
          <path d="M0 120 C50 114 100 122 150 116 C175 113 190 118 200 116 L200 130 L0 130 Z" fill="#232a6e" opacity="0.5" />
          {/* water reflection */}
          <path d="M0 126 C50 122 100 128 150 124 C175 122 190 126 200 124 L200 130 L0 130 Z" fill="#2a3488" opacity="0.35" />
        </>
      );
      break;

    /* ================================================================
       DINING — warm restaurant interior with candlelight
       ================================================================ */
    case "dining":
      skyStops = ["#1a1028", "#2d1a42", "#3d2558"];
      art = (
        <>
          {/* warm ambient glow */}
          <ellipse cx="100" cy="36" rx="80" ry="44" fill="#ffd9a8" opacity="0.15" />
          {/* back wall */}
          <rect x="0" y="30" width="200" height="100" fill="#1f1430" />
          {/* wall texture lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="0" y1={48 + i * 18} x2="200" y2={48 + i * 18} stroke="#2a1e40" strokeWidth="1" opacity="0.5" />
          ))}
          {/* table */}
          <ellipse cx="100" cy="98" rx="66" ry="20" fill="#3d2418" />
          <ellipse cx="100" cy="96" rx="66" ry="20" fill="#5a3720" />
          <ellipse cx="100" cy="94" rx="62" ry="18" fill="#6b4226" />
          {/* tablecloth edge */}
          <path d="M40 94 Q100 86 160 94" stroke="#4a2e1a" strokeWidth="3" fill="none" />
          {/* plates */}
          <ellipse cx="66" cy="88" rx="16" ry="8" fill="#f5f0e8" />
          <ellipse cx="66" cy="88" rx="10" ry="5" fill="#e8dcc8" />
          <ellipse cx="134" cy="88" rx="16" ry="8" fill="#f5f0e8" />
          <ellipse cx="134" cy="88" rx="10" ry="5" fill="#e8dcc8" />
          {/* food on plates */}
          <ellipse cx="66" cy="86" rx="7" ry="3.5" fill="#d4956b" />
          <ellipse cx="134" cy="86" rx="7" ry="3.5" fill="#8fbc6b" />
          {/* wine glasses */}
          <path d="M90 88 L90 72 L86 72 M90 72 L94 72" stroke="#d4c8e8" strokeWidth="1.2" fill="none" opacity="0.8" />
          <ellipse cx="90" cy="88" rx="4" ry="1.5" fill="#d4c8e8" opacity="0.4" />
          <path d="M110 88 L110 72 L106 72 M110 72 L114 72" stroke="#d4c8e8" strokeWidth="1.2" fill="none" opacity="0.8" />
          <ellipse cx="110" cy="88" rx="4" ry="1.5" fill="#d4c8e8" opacity="0.4" />
          {/* candle */}
          <rect x="97" y="78" width="6" height="10" rx="2" fill="#f5e6d0" />
          <ellipse cx="100" cy="74" rx="4" ry="6" fill="#ffb347" opacity="0.9" />
          <ellipse cx="100" cy="72" rx="2.5" ry="4" fill="#fff5e0" opacity="0.9" />
          {/* candle glow */}
          <circle cx="100" cy="68" r="20" fill="#ffb347" opacity="0.08" />
          {/* wall art */}
          <rect x="20" y="38" width="28" height="20" rx="3" fill="#2a1e40" stroke="#3d2d58" strokeWidth="1" />
          <circle cx="34" cy="46" r="5" fill="#4a3070" />
          <rect x="150" y="38" width="28" height="20" rx="3" fill="#2a1e40" stroke="#3d2d58" strokeWidth="1" />
          <path d="M158 54 L164 42 L170 54 Z" fill="#4a3070" />
        </>
      );
      break;

    /* ================================================================
       MARKET — vibrant night market with string lights
       ================================================================ */
    case "market":
      skyStops = ["#120a24", "#1e1240", "#2d1858", "#3d2070"];
      art = (
        <>
          <Stars count={12} />
          <Moon cx={160} cy={28} r={14} />
          {/* ground */}
          <path d="M0 130 L0 108 L200 108 L200 130 Z" fill="#0f0820" />
          {/* string lights */}
          <path d="M0 50 Q50 40 100 48 Q150 56 200 44" stroke="#2a1a4a" strokeWidth="1.5" fill="none" />
          {[10, 30, 55, 75, 100, 125, 145, 170, 190].map((x, i) => (
            <circle key={i} cx={x} cy={44 + Math.sin(i * 0.8) * 6} r={3} fill={i % 2 ? "#ffd66b" : "#ff8fb5"} opacity="0.9" />
          ))}
          {/* stall awnings */}
          <path d="M12 72 L58 72 L58 44 L12 44 Z" fill="#2a1860" />
          <path d="M12 44 L35 34 L58 44 Z" fill="#ff5edb" />
          <path d="M72 72 L118 72 L118 44 L72 44 Z" fill="#1a3a6a" />
          <path d="M72 44 L95 34 L118 44 Z" fill="#35e2ff" />
          <path d="M132 72 L188 72 L188 44 L132 44 Z" fill="#2a4a1a" />
          <path d="M132 44 L160 34 L188 44 Z" fill="#7cffb2" />
          {/* stall interiors */}
          <rect x="18" y="52" width="34" height="20" rx="2" fill="#0f0820" opacity="0.6" />
          <circle cx="28" cy="62" r="4" fill="#ffb36b" />
          <circle cx="42" cy="62" r="4" fill="#ff8fb5" />
          <rect x="78" y="52" width="34" height="20" rx="2" fill="#0f0820" opacity="0.6" />
          <circle cx="88" cy="62" r="4" fill="#8fc3ff" />
          <circle cx="102" cy="62" r="4" fill="#35e2ff" />
          <rect x="138" y="52" width="34" height="20" rx="2" fill="#0f0820" opacity="0.6" />
          <circle cx="148" cy="62" r="4" fill="#7cffb2" />
          <circle cx="162" cy="62" r="4" fill="#ffd66b" />
          {/* people silhouettes */}
          <ellipse cx="40" cy="100" rx="6" ry="8" fill="#1a1240" />
          <circle cx="40" cy="88" r="4" fill="#1a1240" />
          <ellipse cx="80" cy="102" rx="6" ry="8" fill="#1a1240" />
          <circle cx="80" cy="90" r="4" fill="#1a1240" />
          <ellipse cx="130" cy="100" rx="6" ry="8" fill="#1a1240" />
          <circle cx="130" cy="88" r="4" fill="#1a1240" />
          {/* ground texture */}
          <path d="M0 110 Q50 106 100 110 Q150 114 200 108" stroke="#1a0e32" strokeWidth="2" fill="none" opacity="0.6" />
        </>
      );
      break;

    /* ================================================================
       PARK — lush green park with pond and trees
       ================================================================ */
    case "park":
      skyStops = ["#7bb8e0", "#a8d8f0", "#d4eef8"];
      art = (
        <>
          {/* sun */}
          <circle cx="155" cy="28" r="18" fill="#fff5d6" />
          <circle cx="155" cy="28" r="14" fill="#fffae6" />
          <Clouds y={16} count={3} />
          {/* distant hills */}
          <path d="M0 88 Q40 64 80 78 Q120 92 160 72 Q180 62 200 74 L200 130 L0 130 Z" fill="#8fc97a" opacity="0.5" />
          {/* pond */}
          <ellipse cx="100" cy="114" rx="64" ry="14" fill="#5ba8d6" />
          <ellipse cx="100" cy="112" rx="58" ry="12" fill="#6dbce0" opacity="0.8" />
          <ellipse cx="100" cy="110" rx="48" ry="9" fill="#8dd4f0" opacity="0.5" />
          {/* water shimmer */}
          <path d="M70 110 Q85 106 100 110 Q115 114 130 110" stroke="#fff" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M80 114 Q95 110 110 114 Q125 118 140 114" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.3" />
          {/* tree left */}
          <rect x="38" y="62" width="8" height="52" fill="#6b4226" rx="2" />
          <ellipse cx="42" cy="52" rx="30" ry="24" fill="#3d7a2f" />
          <ellipse cx="32" cy="56" rx="18" ry="16" fill="#4a8f38" />
          <ellipse cx="52" cy="48" rx="16" ry="14" fill="#5da14e" />
          {/* tree right */}
          <rect x="154" y="58" width="8" height="56" fill="#6b4226" rx="2" />
          <ellipse cx="158" cy="48" rx="28" ry="22" fill="#3d7a2f" />
          <ellipse cx="148" cy="52" rx="16" ry="14" fill="#4a8f38" />
          <ellipse cx="168" cy="44" rx="14" ry="12" fill="#5da14e" />
          {/* grass foreground */}
          <path d="M0 122 Q30 116 60 120 Q90 124 120 118 Q150 112 180 116 Q200 118 200 120 L200 130 L0 130 Z" fill="#5da14e" />
          <path d="M0 126 Q40 120 80 125 Q120 130 160 124 Q180 122 200 126 L200 130 L0 130 Z" fill="#4a8f38" />
          {/* small flowers */}
          {[30, 70, 110, 150, 180].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={120 - i * 2} r={2.5} fill={i % 2 ? "#ff8fb5" : "#ffd66b"} />
              <circle cx={x} cy={120 - i * 2} r={1} fill="#fff" opacity="0.6" />
            </g>
          ))}
          {/* bench */}
          <rect x="82" y="108" width="36" height="4" rx="1.5" fill="#8b6b4a" />
          <rect x="86" y="112" width="2" height="8" fill="#6b4226" />
          <rect x="110" y="112" width="2" height="8" fill="#6b4226" />
        </>
      );
      break;

    /* ================================================================
       TEMPLE — golden pagoda at sunset
       ================================================================ */
    case "temple":
      skyStops = ["#1a0a3e", "#5a2070", "#c96060", "#ffb36b"];
      art = (
        <>
          <Stars count={8} />
          <Moon cx={160} cy={30} r={14} />
          {/* distant mountains */}
          <path d="M0 100 Q30 74 60 90 Q90 106 120 84 Q150 62 180 80 Q200 90 200 96 L200 130 L0 130 Z" fill="#1a1240" opacity="0.6" />
          {/* main stupa */}
          <path d="M80 108 L100 36 L120 108 Z" fill="#e8a94e" />
          <path d="M86 108 L100 46 L114 108 Z" fill="#ffcf7d" />
          <path d="M92 108 L100 56 L108 108 Z" fill="#ffe8b0" />
          {/* spire */}
          <path d="M100 36 L100 18 L97 26 L100 18 L103 26 Z" fill="#ffd66b" />
          {/* hti (umbrella) */}
          <line x1="100" y1="18" x2="100" y2="8" stroke="#ffd66b" strokeWidth="1.5" />
          <circle cx="100" cy="6" r="3" fill="#ffd66b" />
          {/* base */}
          <path d="M60 108 L100 78 L140 108 Z" fill="#c98a3c" />
          <path d="M50 108 L70 108 L70 96 L130 96 L130 108 L150 108 L140 92 L60 92 Z" fill="#e8a94e" />
          <rect x="92" y="84" width="16" height="24" rx="3" fill="#5b3218" />
          {/* surrounding stupas */}
          <path d="M50 106 L58 68 L66 106 Z" fill="#d4956b" />
          <path d="M54 106 L58 76 L62 106 Z" fill="#e8a94e" />
          <path d="M134 106 L142 68 L150 106 Z" fill="#d4956b" />
          <path d="M138 106 L142 76 L146 106 Z" fill="#e8a94e" />
          {/* ground */}
          <path d="M0 106 C40 98 80 110 120 106 C160 102 180 108 200 104 L200 130 L0 130 Z" fill="#1a0a30" />
          <path d="M0 112 C40 106 80 116 120 112 C160 108 180 114 200 110 L200 130 L0 130 Z" fill="#120820" />
          {/* warm glow */}
          <circle cx="100" cy="50" r="40" fill="#ffd66b" opacity="0.06" />
        </>
      );
      break;

    /* ================================================================
       STREET FOOD — neon-lit food stall at night
       ================================================================ */
    case "street-food":
      skyStops = ["#0f0820", "#1a1040", "#2d1558"];
      art = (
        <>
          <Stars count={10} color="#ff9ef0" />
          {/* ground */}
          <path d="M0 130 L0 108 L200 108 L200 130 Z" fill="#0a0418" />
          {/* stall */}
          <rect x="36" y="62" width="128" height="46" rx="8" fill="#1e1240" />
          <rect x="36" y="62" width="128" height="14" rx="7" fill="#ff5edb" opacity="0.95" />
          {/* stall frame */}
          <rect x="36" y="62" width="128" height="46" rx="8" fill="none" stroke="#3d2070" strokeWidth="1.5" />
          {/* steam */}
          <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.35">
            <path d="M56 90 c4-8 10-10 12-16 M98 88 c4-8 10-10 12-16 M140 90 c4-8 10-10 12-16" />
          </g>
          {/* food items */}
          {[48, 72, 96, 120, 144].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="100" r={7} fill={i % 2 ? "#ffb36b" : "#ffd66b"} />
              <circle cx={x - 2} cy={98} r={1.5} fill="#fff" opacity="0.3" />
            </g>
          ))}
          {/* stall legs */}
          <rect x="44" y="108" width="5" height="16" rx="2" fill="#0f0820" />
          <rect x="151" y="108" width="5" height="16" rx="2" fill="#0f0820" />
          {/* neon sign */}
          <rect x="68" y="44" width="64" height="18" rx="6" fill="#1a0a30" />
          <text x="100" y="57" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="11" fill="#ff5edb" letterSpacing="1.5">STREET FOOD</text>
          {/* neon glow */}
          <rect x="68" y="44" width="64" height="18" rx="6" fill="none" stroke="#ff5edb" strokeWidth="1.5" opacity="0.6" />
          {/* people */}
          <ellipse cx="30" cy="118" rx="5" ry="7" fill="#1a1240" />
          <circle cx="30" cy="108" r="3.5" fill="#1a1240" />
          <ellipse cx="170" cy="116" rx="5" ry="7" fill="#1a1240" />
          <circle cx="170" cy="106" r="3.5" fill="#1a1240" />
        </>
      );
      break;

    /* ================================================================
       BEACH — tropical beach with palm trees
       ================================================================ */
    case "beach":
      skyStops = ["#5ba8d6", "#8dd4f0", "#ffd9a8", "#ffb36b"];
      art = (
        <>
          <circle cx="155" cy="30" r="18" fill="#fffae6" />
          <circle cx="155" cy="30" r="14" fill="#fffdf5" />
          {/* ocean */}
          <path d="M0 92 C30 84 60 90 90 84 C120 78 160 84 200 78 L200 130 L0 130 Z" fill="#2d8fd6" opacity="0.9" />
          <path d="M0 98 C40 90 80 98 120 92 C160 86 180 92 200 90 L200 130 L0 130 Z" fill="#4db8e8" />
          {/* waves */}
          <path d="M20 96 Q35 92 50 96 Q65 100 80 96" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M120 88 Q135 84 150 88 Q165 92 180 88" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4" />
          {/* sand */}
          <path d="M0 110 C50 104 100 112 150 106 C175 104 190 108 200 106 L200 130 L0 130 Z" fill="#f5d6a8" />
          <path d="M0 116 C50 110 100 118 150 112 C175 110 190 114 200 112 L200 130 L0 130 Z" fill="#e8c896" />
          {/* palm tree left */}
          <path d="M30 116 Q28 80 34 50" stroke="#8b6b3a" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M34 50 Q20 44 10 48 Q26 46 34 50 Q30 38 24 32 Q32 44 38 48 Q46 38 52 32 Q48 44 38 48 Q50 44 58 48 Q44 46 34 50" fill="#2d7a1f" />
          <path d="M34 50 Q20 44 10 48 Q26 46 34 50 Q30 38 24 32 Q32 44 38 48 Q46 38 52 32 Q48 44 38 48 Q50 44 58 48 Q44 46 34 50" fill="#3d9a2f" opacity="0.7" />
          {/* palm tree right */}
          <path d="M170 114 Q168 78 172 54" stroke="#8b6b3a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M172 54 Q160 48 152 52 Q165 50 172 54 Q168 44 164 38 Q170 46 174 50 Q178 42 182 38 Q178 46 174 50 Q182 48 188 52 Q175 50 172 54" fill="#2d7a1f" />
          {/* coconut */}
          <circle cx="172" cy="52" r="3" fill="#6b4226" />
          {/* beach umbrella */}
          <line x1="100" y1="78" x2="100" y2="118" stroke="#d4c8e8" strokeWidth="2" />
          <path d="M82 78 Q100 62 118 78 Z" fill="#ff5edb" opacity="0.85" />
          <path d="M82 78 Q100 62 118 78 Z" fill="none" stroke="#ff8fb5" strokeWidth="1" />
        </>
      );
      break;

    /* ================================================================
       GARDEN — serene botanical garden
       ================================================================ */
    case "garden":
      skyStops = ["#0f2d4d", "#1d5c8f", "#39c2a8"];
      art = (
        <>
          <Stars count={8} />
          <Moon cx={150} cy={28} r={14} />
          {/* ground */}
          <path d="M0 130 L0 104 L200 104 L200 130 Z" fill="#0a1a2a" opacity="0.7" />
          {/* garden beds */}
          <ellipse cx="60" cy="114" rx="40" ry="12" fill="#1a3a2a" />
          <ellipse cx="140" cy="114" rx="40" ry="12" fill="#1a3a2a" />
          {/* trees */}
          {[48, 100, 152].map((x, i) => (
            <g key={x}>
              <rect x={x - 3} y={64 + i * 4} width="6" height={46 - i * 4} fill="#3d2410" rx="2" />
              <ellipse cx={x} cy={56 + i * 2} rx={22 - i * 2} ry={18 - i * 2} fill={i % 2 ? "#2d6b4a" : "#1d4a32"} />
              <ellipse cx={x - 6} cy={60 + i * 2} rx={14} ry={12} fill={i % 2 ? "#3d8a5f" : "#2d6b4a"} />
              <ellipse cx={x + 4} cy={52 + i * 2} rx={12} ry={10} fill={i % 2 ? "#4a9f6f" : "#3d8a5f"} />
            </g>
          ))}
          {/* glowing plants */}
          {[30, 72, 114, 156, 190].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={118 - i * 2} r={4} fill={i % 2 ? "#7cffb2" : "#c98af0"} opacity="0.7" />
              <circle cx={x} cy={118 - i * 2} r={1.5} fill="#fff" opacity="0.5" />
            </g>
          ))}
          {/* path */}
          <path d="M0 124 Q50 118 100 120 Q150 122 200 118" stroke="#2a4a3a" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M0 124 Q50 118 100 120 Q150 122 200 118" stroke="#3a5a4a" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" />
        </>
      );
      break;

    /* ================================================================
       CITY NEON — futuristic neon cityscape
       ================================================================ */
    case "city-neon":
      skyStops = ["#0a0418", "#1a0a3e", "#2d1058"];
      art = (
        <>
          <Stars count={12} color="#ff9ef0" />
          {/* buildings */}
          <path d="M0 130 L0 82 L24 82 L24 58 L40 58 L40 88 L56 88 L56 46 L74 46 L74 80 L92 80 L92 34 L108 34 L108 72 L126 72 L126 56 L144 56 L144 86 L164 86 L164 48 L182 48 L182 82 L200 82 L200 130 Z" fill="#120a2a" />
          {/* neon outlines */}
          <g fill="none" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
            <path d="M40 64 h16 M56 60 v12" stroke="#ff5edb" />
            <path d="M100 40 h16 M116 36 v12" stroke="#35e2ff" />
            <path d="M156 54 h16 M172 50 v12" stroke="#ffd66b" />
            <path d="M66 90 h14 M80 86 v10" stroke="#7cffb2" />
            <path d="M130 62 h12 M142 58 v10" stroke="#c98af0" />
          </g>
          {/* windows */}
          {Array.from({ length: 24 }).map((_, i) => {
            const x = 8 + ((i * 31) % 180);
            const y = 52 + ((i * 17) % 60);
            if (y > 84) return null;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={5}
                height={6}
                rx={1}
                fill={i % 4 === 0 ? "#ff5edb" : i % 4 === 1 ? "#35e2ff" : i % 4 === 2 ? "#ffd66b" : "#7cffb2"}
                opacity={0.65 + (i % 3) * 0.12}
              />
            );
          })}
          {/* foreground */}
          <path d="M0 116 C50 110 100 120 150 114 C175 112 190 116 200 114 L200 130 L0 130 Z" fill="#0a0418" opacity="0.9" />
          {/* neon reflections */}
          <path d="M0 120 C50 116 100 124 150 118 C175 116 190 120 200 118" stroke="#ff5edb" strokeWidth="1" fill="none" opacity="0.15" />
        </>
      );
      break;

    /* ================================================================
       RICE — terraced rice fields
       ================================================================ */
    case "rice":
      skyStops = ["#7bb8e0", "#a8d8f0", "#d4eef8", "#e8f7d9"];
      art = (
        <>
          <circle cx="150" cy="30" r="16" fill="#fffae6" />
          <Clouds y={14} count={2} />
          {/* mountains */}
          <path d="M0 90 Q20 50 50 70 Q70 82 90 64 Q110 46 140 60 Q170 74 200 58 L200 130 L0 130 Z" fill="#8fc97a" opacity="0.4" />
          {/* terraces */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path
                d={`M${i * 50} 130 C${i * 50 + 10} 100 ${i * 50 + 24} 78 ${i * 50 + 40} 64 C${i * 50 + 56} 78 ${i * 50 + 70} 100 ${i * 50 + 80} 130 Z`}
                fill={i % 2 ? "#5da14e" : "#3d7a2f"}
              />
              {/* water in terrace */}
              <path
                d={`M${i * 50 + 8} 128 C${i * 50 + 16} 108 ${i * 50 + 24} 96 ${i * 50 + 34} 90 C${i * 50 + 42} 96 ${i * 50 + 50} 108 ${i * 50 + 58} 128 Z`}
                fill="#8dd4f0"
                opacity="0.6"
              />
              {/* water shimmer */}
              <path
                d={`M${i * 50 + 18} 112 L${i * 50 + 44} 112`}
                stroke="#fff"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
          ))}
          {/* foreground grass */}
          <path d="M0 124 Q50 118 100 122 Q150 126 200 120 L200 130 L0 130 Z" fill="#5da14e" opacity="0.8" />
        </>
      );
      break;

    /* ================================================================
       VOLCANO — dramatic volcanic landscape
       ================================================================ */
    case "volcano":
      skyStops = ["#1a0a3e", "#5a2070", "#b0476f", "#ffb36b"];
      art = (
        <>
          <Stars count={8} />
          {/* volcano */}
          <path d="M20 130 L90 48 L110 48 L180 130 Z" fill="#2a1a3a" />
          <path d="M90 48 L100 24 L110 48 Z" fill="#3d2558" />
          {/* lava glow */}
          <path d="M96 40 C96 32 100 28 100 24 C100 28 104 32 104 40 Z" fill="#ff6b3d" opacity="0.9" />
          <circle cx="100" cy="28" r="8" fill="#ffb36b" opacity="0.25" />
          <circle cx="100" cy="28" r="16" fill="#ff6b3d" opacity="0.1" />
          {/* lava flow */}
          <path d="M100 48 Q96 70 102 90 Q98 106 100 130" stroke="#ff6b3d" strokeWidth="4" fill="none" opacity="0.7" strokeLinecap="round" />
          <path d="M100 48 Q96 70 102 90 Q98 106 100 130" stroke="#ffb36b" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
          {/* ground */}
          <path d="M0 130 L0 116 C50 110 150 110 200 116 L200 130 Z" fill="#1a0a20" />
          <path d="M20 130 C50 114 150 114 180 130 Z" fill="#120618" />
          {/* smoke */}
          <g opacity="0.2">
            <ellipse cx="100" cy="16" rx="14" ry="10" fill="#aaa" />
            <ellipse cx="90" cy="8" rx="10" ry="8" fill="#bbb" />
            <ellipse cx="110" cy="6" rx="8" ry="6" fill="#ccc" />
          </g>
        </>
      );
      break;

    /* ================================================================
       JUNGLE — dense tropical rainforest
       ================================================================ */
    case "jungle":
      skyStops = ["#1a2a1a", "#2d4a2d", "#3d6b3d", "#5da14e"];
      art = (
        <>
          {/* sun rays */}
          <g opacity="0.15">
            <path d="M100 0 L70 80 L80 80 Z" fill="#ffd66b" />
            <path d="M100 0 L100 80 L110 80 Z" fill="#ffd66b" />
            <path d="M100 0 L130 80 L120 80 Z" fill="#ffd66b" />
          </g>
          {/* background foliage */}
          <path d="M0 130 C20 60 44 34 70 26 C56 52 48 90 52 130 Z" fill="#0f3d1f" />
          <path d="M30 130 C60 48 90 22 120 14 C102 48 96 88 100 130 Z" fill="#14532d" />
          <path d="M80 130 C112 40 146 20 176 16 C158 52 152 92 156 130 Z" fill="#1c7a3d" />
          {/* midground */}
          <path d="M0 130 C30 110 70 116 100 108 C130 100 170 106 200 100 L200 130 Z" fill="#0a2a14" opacity="0.9" />
          {/* foreground vines */}
          <path d="M40 66 C56 58 72 66 84 56 M120 48 C136 40 152 48 164 38" stroke="#7cffb2" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          {/* flowers */}
          <circle cx="70" cy="72" r="3" fill="#ff5edb" opacity="0.8" />
          <circle cx="144" cy="54" r="3" fill="#ffd66b" opacity="0.8" />
          <circle cx="110" cy="80" r="2.5" fill="#ff8fb5" opacity="0.8" />
        </>
      );
      break;

    /* ================================================================
       SPA — tranquil wellness space
       ================================================================ */
    case "spa":
      skyStops = ["#d9c8ff", "#ede0ff", "#f6f0ff"];
      art = (
        <>
          {/* warm glow */}
          <circle cx="100" cy="50" r="60" fill="#ffd9a8" opacity="0.12" />
          {/* pool */}
          <ellipse cx="100" cy="108" rx="80" ry="16" fill="#8fd3d6" opacity="0.7" />
          <ellipse cx="100" cy="106" rx="68" ry="13" fill="#a9e4e2" opacity="0.8" />
          <ellipse cx="100" cy="104" rx="52" ry="9" fill="#c8f0f0" opacity="0.6" />
          {/* steam */}
          <g opacity="0.25">
            <ellipse cx="80" cy="80" rx="10" ry="14" fill="#fff" />
            <ellipse cx="100" cy="74" rx="8" ry="12" fill="#fff" />
            <ellipse cx="120" cy="78" rx="10" ry="14" fill="#fff" />
          </g>
          {/* flower arrangement */}
          <g transform="translate(100 88)">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="0" cy="-24" rx="6" ry="13" fill="#c98af0" opacity="0.8" transform={`rotate(${a})`} />
            ))}
            <circle r="7" fill="#ffd66b" />
            <circle r="3" fill="#fff" opacity="0.5" />
          </g>
          {/* bamboo */}
          {[30, 170].map((x, i) => (
            <g key={i}>
              <rect x={x} y={70} width="4" height={48} fill="#7fb86b" rx="2" />
              <rect x={x} y={76} width="4" height="2" fill="#5da14e" />
              <rect x={x} y={90} width="4" height="2" fill="#5da14e" />
              <rect x={x} y={104} width="4" height="2" fill="#5da14e" />
            </g>
          ))}
        </>
      );
      break;

    /* ================================================================
       COOKING — warm kitchen with cooking fire
       ================================================================ */
    case "cooking":
      skyStops = ["#3d1a0a", "#5a2a14", "#7a3d1e"];
      art = (
        <>
          {/* warm glow */}
          <circle cx="100" cy="60" r="50" fill="#ffb36b" opacity="0.12" />
          {/* back wall */}
          <rect x="0" y="40" width="200" height="90" fill="#2a1508" />
          {/* counter */}
          <rect x="30" y="80" width="140" height="14" rx="3" fill="#4a2a14" />
          <rect x="30" y="80" width="140" height="4" fill="#5a3a1a" />
          {/* pot */}
          <path d="M60 80 L60 64 A20 10 0 0 1 100 64 L100 80 Z" fill="#3a3a3f" />
          <ellipse cx="80" cy="64" rx="20" ry="10" fill="#ffb36b" opacity="0.8" />
          {/* steam */}
          <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.3">
            <path d="M72 58 C70 48 76 42 78 36 M88 56 C90 46 84 40 82 34" />
          </g>
          {/* pan */}
          <ellipse cx="140" cy="80" rx="20" ry="6" fill="#3a3a3f" />
          <ellipse cx="140" cy="78" rx="16" ry="5" fill="#ff8f6b" opacity="0.7" />
          <rect x="170" y="60" width="8" height="28" rx="3" fill="#5a3b1a" />
          {/* hanging utensils */}
          <line x1="40" y1="48" x2="160" y2="48" stroke="#3d2410" strokeWidth="2" />
          <path d="M60 48 L60 62" stroke="#5a3b1a" strokeWidth="3" strokeLinecap="round" />
          <path d="M90 48 L90 64" stroke="#5a3b1a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M130 48 L130 58" stroke="#5a3b1a" strokeWidth="3" strokeLinecap="round" />
          {/* fire glow */}
          <circle cx="80" cy="74" r="12" fill="#ff6b3d" opacity="0.08" />
        </>
      );
      break;

    /* ================================================================
       ROOFTOP — rooftop bar with city view
       ================================================================ */
    case "rooftop":
      skyStops = ["#0a0c24", "#151840", "#2d1858", "#5a2070"];
      art = (
        <>
          <Stars count={16} />
          <Moon cx={155} cy={28} r={14} />
          {/* city skyline */}
          <path d="M0 130 L0 84 L18 84 L18 64 L34 64 L34 82 L50 82 L50 52 L66 52 L66 74 L82 74 L82 40 L98 40 L98 62 L114 62 L114 78 L132 78 L132 56 L148 56 L148 72 L164 72 L164 46 L180 46 L180 80 L200 80 L200 130 Z" fill="#0e1133" opacity="0.8" />
          {/* building */}
          <rect x="20" y="78" width="160" height="52" fill="#15173d" />
          <rect x="20" y="78" width="160" height="4" fill="#2d2070" />
          {/* railing */}
          <line x1="24" y1="82" x2="176" y2="82" stroke="#4a3598" strokeWidth="2" />
          {[28, 44, 60, 76, 92, 108, 124, 140, 156, 172].map((x) => (
            <line key={x} x1={x} y1="82" x2={x} y2="88" stroke="#4a3598" strokeWidth="1.5" />
          ))}
          {/* table */}
          <rect x="70" y="90" width="60" height="4" rx="2" fill="#2d2070" />
          <rect x="76" y="94" width="2" height="14" fill="#1a1240" />
          <rect x="122" y="94" width="2" height="14" fill="#1a1240" />
          {/* drinks */}
          <path d="M86 90 L86 82 L82 82 M86 82 L90 82" stroke="#ff8fb5" strokeWidth="1.2" fill="none" opacity="0.8" />
          <path d="M110 90 L110 82 L106 82 M110 82 L114 82" stroke="#35e2ff" strokeWidth="1.2" fill="none" opacity="0.8" />
          {/* string lights */}
          <path d="M24 88 Q60 78 100 86 Q140 94 176 82" stroke="#2a1a4a" strokeWidth="1" fill="none" />
          {[34, 54, 74, 94, 114, 134, 154, 170].map((x, i) => (
            <circle key={i} cx={x} cy={84 + Math.sin(i * 0.8) * 4} r={2.5} fill={i % 2 ? "#ffd66b" : "#ff8fb5"} opacity="0.8" />
          ))}
        </>
      );
      break;

    /* ================================================================
       MALL — modern shopping center interior
       ================================================================ */
    case "mall":
      skyStops = ["#1a1a2e", "#2a2a4e", "#3a3a6e"];
      art = (
        <>
          {/* ceiling */}
          <rect x="0" y="0" width="200" height="32" fill="#15172e" />
          {/* skylight */}
          <rect x="60" y="0" width="80" height="20" rx="6" fill="#1a2a4e" />
          <rect x="66" y="4" width="68" height="12" rx="4" fill="#2a4a6e" opacity="0.5" />
          {/* floor */}
          <rect x="0" y="98" width="200" height="32" fill="#10122a" />
          <path d="M0 98 L200 98" stroke="#2a2a4e" strokeWidth="2" />
          {/* floor tiles */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={i} x1={i * 28} y1="106" x2={i * 28} y2="130" stroke="#1a1a3a" strokeWidth="1" opacity="0.5" />
          ))}
          {/* storefronts */}
          <rect x="14" y="44" width="52" height="54" rx="4" fill="#1e2050" />
          <rect x="18" y="48" width="44" height="34" rx="2" fill="#8fc3ff" opacity="0.6" />
          <text x="40" y="68" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9" fill="#fff" opacity="0.8">FASHION</text>
          <rect x="80" y="38" width="40" height="60" rx="4" fill="#1e2050" />
          <rect x="84" y="42" width="32" height="40" rx="2" fill="#ff8fb5" opacity="0.6" />
          <text x="100" y="70" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#fff" opacity="0.8">BEAUTY</text>
          <rect x="134" y="44" width="52" height="54" rx="4" fill="#1e2050" />
          <rect x="138" y="48" width="44" height="34" rx="2" fill="#7cffb2" opacity="0.6" />
          <text x="160" y="68" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9" fill="#fff" opacity="0.8">ELECTRONICS</text>
          {/* escalator */}
          <path d="M70 100 L120 76" stroke="#2a2a4e" strokeWidth="6" strokeLinecap="round" />
          <path d="M70 100 L120 76" stroke="#3a3a5e" strokeWidth="3" strokeLinecap="round" />
          {/* people */}
          <ellipse cx="50" cy="120" rx="4" ry="6" fill="#2a2a4e" />
          <circle cx="50" cy="112" r="3" fill="#2a2a4e" />
          <ellipse cx="150" cy="118" rx="4" ry="6" fill="#2a2a4e" />
          <circle cx="150" cy="110" r="3" fill="#2a2a4e" />
        </>
      );
      break;

    /* ================================================================
       PALACE — ornate royal palace
       ================================================================ */
    case "palace":
      skyStops = ["#1a0a3e", "#4a2060", "#c98a3c", "#ffcf7d"];
      art = (
        <>
          <Stars count={6} />
          <Moon cx={160} cy={28} r={14} />
          {/* ground */}
          <path d="M0 130 L0 104 L200 104 L200 130 Z" fill="#120a20" />
          {/* main building */}
          <rect x="36" y="76" width="128" height="28" rx="2" fill="#b0743c" />
          <rect x="48" y="60" width="104" height="16" rx="2" fill="#c98a3c" />
          <rect x="60" y="48" width="80" height="12" rx="2" fill="#e8a94e" />
          {/* domes */}
          {[68, 100, 132].map((x) => (
            <g key={x}>
              <path d={`M${x - 12} 48 L${x} 28 L${x + 12} 48 Z`} fill="#ffd66b" />
              <path d={`M${x} 28 L${x} 20 L${x + 4} 26 L${x} 20 L${x - 4} 26 Z`} fill="#ffd66b" />
            </g>
          ))}
          {/* entrance */}
          <rect x="84" y="76" width="32" height="28" rx="2" fill="#5b3218" />
          <path d="M88 76 L100 64 L112 76 Z" fill="#3d2410" />
          {/* columns */}
          <rect x="44" y="76" width="5" height="28" fill="#d4956b" />
          <rect x="151" y="76" width="5" height="28" fill="#d4956b" />
          {/* windows */}
          {[56, 72, 116, 132].map((x) => (
            <rect key={x} x={x} y="84" width="10" height="12" rx="2" fill="#3d2410" />
          ))}
          {/* foreground */}
          <path d="M0 118 C40 112 80 120 120 116 C160 112 180 118 200 114 L200 130 L0 130 Z" fill="#0a0418" opacity="0.8" />
          {/* warm window glow */}
          <circle cx="100" cy="90" r="30" fill="#ffd66b" opacity="0.06" />
        </>
      );
      break;

    /* ================================================================
       GALLERY — modern art gallery
       ================================================================ */
    case "gallery":
      skyStops = ["#1a1a2e", "#2a2a4e", "#3a3a5e"];
      art = (
        <>
          {/* walls */}
          <rect x="0" y="28" width="200" height="102" fill="#1a1a3a" />
          {/* floor */}
          <rect x="0" y="100" width="200" height="30" fill="#15152e" />
          <path d="M0 100 L200 100" stroke="#2a2a4a" strokeWidth="1.5" />
          {/* spotlights */}
          {[40, 100, 160].map((x) => (
            <g key={x}>
              <path d={`M${x} 28 L${x - 14} 48 L${x + 14} 48 Z`} fill="#fff" opacity="0.06" />
              <circle cx={x} cy="28" r="2" fill="#fff" opacity="0.7" />
            </g>
          ))}
          {/* artwork 1 */}
          <rect x="18" y="48" width="44" height="36" rx="3" fill="#fff" />
          <rect x="22" y="52" width="36" height="28" fill="#6c4cf1" opacity="0.8" />
          <circle cx="40" cy="62" r="6" fill="#ff8fb5" />
          <circle cx="40" cy="62" r="3" fill="#ffd66b" />
          {/* artwork 2 */}
          <rect x="78" y="44" width="44" height="40" rx="3" fill="#fff" />
          <rect x="82" y="48" width="36" height="32" fill="#1a2a4e" />
          <path d="M86 76 L100 56 L114 76 Z" fill="#3e7bfa" opacity="0.8" />
          <circle cx="94" cy="62" r="4" fill="#35e2ff" opacity="0.6" />
          {/* artwork 3 */}
          <rect x="138" y="50" width="44" height="34" rx="3" fill="#fff" />
          <rect x="142" y="54" width="36" height="26" fill="#17b26a" opacity="0.6" />
          <circle cx="160" cy="64" r="7" fill="#ffd66b" opacity="0.8" />
          {/* person */}
          <ellipse cx="160" cy="114" rx="4" ry="6" fill="#2a2a4a" />
          <circle cx="160" cy="106" r="3" fill="#2a2a4a" />
        </>
      );
      break;

    /* ================================================================
       CITY LIGHTS — twilight city with glowing lights
       ================================================================ */
    case "city-lights":
      skyStops = ["#1a2a5e", "#3a5a9e", "#f2a3c6", "#ffd9a8"];
      art = (
        <>
          <Stars count={8} />
          {/* buildings */}
          <path d="M0 130 L0 88 L44 88 L44 70 L88 70 L88 96 L146 96 L146 62 L200 62 L200 130 Z" fill="#0e1536" />
          {/* windows */}
          {Array.from({ length: 22 }).map((_, i) => {
            const x = 10 + ((i * 29) % 180);
            const y = 56 + ((i * 15) % 56);
            if (y > 84) return null;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={5}
                height={6}
                rx={1}
                fill={i % 3 === 0 ? "#ffd66b" : i % 3 === 1 ? "#ff8fb5" : "#8fc3ff"}
                opacity={0.7 + (i % 3) * 0.1}
              />
            );
          })}
          {/* tower */}
          <path d="M148 62 L154 28 L178 28 L184 62 Z" fill="#0a1030" />
          <rect x="158" y="36" width="8" height="16" rx="2" fill="#ffd66b" opacity="0.9" />
          <circle cx="162" cy="28" r="4" fill="#ff8fb5" opacity="0.9" />
          {/* foreground */}
          <path d="M0 114 C50 108 100 120 150 114 C175 112 190 118 200 114 L200 130 L0 130 Z" fill="#080e24" opacity="0.85" />
          {/* street lights */}
          {[40, 120, 180].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="114" x2={x} y2="104" stroke="#2a3a6a" strokeWidth="1.5" />
              <circle cx={x} cy="102" r={3} fill="#ffd66b" opacity="0.8" />
              <circle cx={x} cy="102" r={8} fill="#ffd66b" opacity="0.08" />
            </g>
          ))}
        </>
      );
      break;

    /* ================================================================
       PLANE — airplane in flight
       ================================================================ */
    case "plane":
      skyStops = ["#5ba8d6", "#8fc3ff", "#d4eef8"];
      art = (
        <>
          <circle cx="155" cy="28" r="16" fill="#fffae6" />
          <Clouds y={60} count={3} />
          <Clouds y={20} count={2} />
          {/* contrail */}
          <path d="M20 62 L180 34" stroke="#fff" strokeWidth="2.5" strokeDasharray="3 10" strokeLinecap="round" opacity="0.5" />
          {/* airplane */}
          <g transform="translate(148 38) rotate(14)">
            <path d="M0 0 C14 -10 34 -10 48 -2 L38 0 L14 4 L4 8 Z" fill="#3d455f" />
            <path d="M34 0 L14 4 L10 10 L22 6 L44 4 Z" fill="#5a6a99" />
            <circle cx="10" cy="5" r="1.6" fill="#6c4cf1" />
            {/* wing */}
            <path d="M20 2 L24 -6 L28 2" fill="#4a5580" />
          </g>
          {/* ground */}
          <path d="M0 124 C50 120 120 124 200 118 L200 130 L0 130 Z" fill="#c8ddf2" opacity="0.4" />
        </>
      );
      break;

    /* ================================================================
       CAR — scenic road trip
       ================================================================ */
    case "car":
      skyStops = ["#5ba8d6", "#8fc3ff", "#d4eef8"];
      art = (
        <>
          <circle cx="155" cy="28" r="16" fill="#fffae6" />
          <Clouds y={18} count={2} />
          {/* road */}
          <path d="M0 130 L0 104 L200 104 L200 130 Z" fill="#3d455f" />
          <path d="M0 110 L200 110" stroke="#fff" strokeWidth="2.5" strokeDasharray="16 12" opacity="0.7" />
          {/* mountains */}
          <path d="M0 104 Q30 74 60 90 Q90 106 120 84 Q150 62 180 80 Q200 88 200 96 L200 104 L0 104 Z" fill="#8fc97a" opacity="0.3" />
          {/* car */}
          <g transform="translate(50 85)">
            <path d="M0 0 C6 -16 20 -18 26 -18 h22 c6 0 18 2 24 14 c4 8 6 8 6 8 h6 a8 8 0 0 1 8 8 v6 h-100 v-6 a8 8 0 0 1 8-8 z" fill="#3d455f" />
            <path d="M12 2 h6 c2 0 4 2 5 4 h-13 c1-2 2-4 2-4 z" fill="#8fc3ff" opacity="0.8" />
            <path d="M60 4 h6 c2 0 4 2 5 4 h-13 z" fill="#8fc3ff" opacity="0.8" />
            <circle cx="24" cy="20" r="7" fill="#131a2e" />
            <circle cx="24" cy="20" r="3" fill="#d8dbe8" />
            <circle cx="76" cy="20" r="7" fill="#131a2e" />
            <circle cx="76" cy="20" r="3" fill="#d8dbe8" />
            {/* headlight glow */}
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#ffd66b" opacity="0.15" />
          </g>
        </>
      );
      break;

    /* ================================================================
       TRAIN — scenic rail journey
       ================================================================ */
    case "train":
      skyStops = ["#1a0a3e", "#2d1858", "#4a3598"];
      art = (
        <>
          <Stars count={8} />
          <Moon cx={160} cy={28} r={14} />
          {/* tracks */}
          <path d="M0 116 L200 116 M0 122 L200 122" stroke="#3d2d58" strokeWidth="3" />
          {/* train */}
          <g transform="translate(40 88)">
            <path d="M0 0 h110 v18 a8 8 0 0 1 -8 8 h-94 a8 8 0 0 1 -8 -8 z" fill="#3d455f" />
            <rect x="10" y="6" width="20" height="12" rx="2.5" fill="#ffd66b" opacity="0.9" />
            <rect x="40" y="6" width="20" height="12" rx="2.5" fill="#ffd66b" opacity="0.9" />
            <rect x="70" y="6" width="20" height="12" rx="2.5" fill="#ffd66b" opacity="0.9" />
            {/* headlight */}
            <circle cx="0" cy="0" r="4" fill="#ffd66b" opacity="0.6" />
            <circle cx="0" cy="0" r="8" fill="#ffd66b" opacity="0.1" />
            <circle cx="20" cy="26" r="6" fill="#131a2e" />
            <circle cx="80" cy="26" r="6" fill="#131a2e" />
          </g>
          {/* ground */}
          <path d="M0 130 L0 118 C50 114 150 114 200 118 L200 130 Z" fill="#0f0820" />
        </>
      );
      break;

    /* ================================================================
       HOTEL — luxury hotel exterior
       ================================================================ */
    case "hotel":
      skyStops = ["#0a0c24", "#1a1a4e", "#2d2070"];
      art = (
        <>
          <Stars count={8} />
          <Moon cx={155} cy={28} r={15} />
          {/* building */}
          <rect x="52" y="32" width="96" height="98" rx="5" fill="#2a1a5a" />
          <rect x="52" y="32" width="96" height="6" fill="#4a3598" />
          {/* windows */}
          {[0, 1, 2, 3, 4].map((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={64 + c * 18}
                y={46 + r * 15}
                width="9"
                height="8"
                rx="1.5"
                fill={r % 2 === c % 2 ? "#ffd66b" : "#8fc3ff"}
                opacity={r % 2 === c % 2 ? 0.9 : 0.6}
              />
            ))
          )}
          {/* entrance */}
          <rect x="80" y="82" width="40" height="48" rx="4" fill="#1a0a3a" />
          <path d="M84 82 L100 68 L116 82 Z" fill="#3d2558" />
          {/* entrance glow */}
          <circle cx="100" cy="90" r="16" fill="#ffd66b" opacity="0.08" />
          {/* awning */}
          <path d="M52 32 L100 16 L148 32 Z" fill="#4a3598" />
          {/* ground */}
          <path d="M0 130 L0 118 C50 114 150 114 200 118 L200 130 Z" fill="#0a0418" />
        </>
      );
      break;

    /* ================================================================
       DEFAULT — fallback city night
       ================================================================ */
    default:
      skyStops = ["#0a0c24", "#151840", "#2a1f6e"];
      art = (
        <>
          <Moon cx={155} cy={30} r={16} />
          <Stars count={12} />
          <path d="M0 130 L0 78 L16 78 L16 64 L30 64 L30 82 L46 82 L46 50 L62 50 L62 72 L78 72 L78 38 L94 38 L94 60 L110 60 L110 82 L128 82 L128 54 L144 54 L144 70 L160 70 L160 44 L176 44 L176 76 L194 76 L194 62 L200 62 L200 130 Z" fill="#141b3d" />
          {Array.from({ length: 22 }).map((_, i) => {
            const x = 10 + ((i * 31) % 180);
            const y = 56 + ((i * 17) % 56);
            if (y > 82) return null;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={4.5}
                height={5.5}
                rx={0.8}
                fill={i % 3 === 0 ? "#ffd66b" : i % 3 === 1 ? "#9fc2ff" : "#fff"}
                opacity={0.75}
              />
            );
          })}
          <path d="M0 118 C40 112 70 124 110 118 C150 112 175 122 200 116 L200 130 L0 130 Z" fill="#1d2a63" opacity="0.8" />
        </>
      );
  }

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 130"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${type} scene`}
    >
      <SkyGrad uid={uid} stops={skyStops} />
      <rect width="200" height="130" fill={g("sky")} />
      {art}
    </svg>
  );
}