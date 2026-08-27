"use client";

import { useId } from "react";

/* ============================================================
   Scene — lightweight SVG scene illustrations used as imagery
   throughout Triverse. All vector, no network images.
   ============================================================ */

function Stars({ cx = 20, count = 14, color = "#ffffff" }) {
  const dots = [];
  const rnd = (i) => {
    const x = (i * 37 + 11) % 100;
    const y = (i * 53 + 7) % 100;
    return { x: x * 1.8 + 6, y: y * 0.9, r: (i % 3) + 0.8 };
  };
  for (let i = 0; i < count; i++) {
    const { x, y, r } = rnd(i);
    dots.push(<circle key={i} cx={x} cy={y} r={r} fill={color} opacity={0.75} />);
  }
  return <g style={{ mixBlendMode: "screen" }}>{dots}</g>;
}

const SKYLINE =
  "M0 130 L0 78 L14 78 L14 66 L28 66 L28 84 L42 84 L42 52 L56 52 L56 74 L70 74 L70 40 L86 40 L86 62 L100 62 L100 84 L116 84 L116 56 L130 56 L130 70 L146 70 L146 46 L162 46 L162 78 L178 78 L178 64 L200 64 L200 130 Z";

function Windows({ seed = 0 }) {
  const rects = [];
  const rnd = (i) => ((i * 97 + seed * 13) % 60) / 60;
  for (let i = 0; i < 26; i++) {
    const x = 8 + ((i * 31) % 180);
    const y = 58 + ((i * 17) % 58);
    if (rnd(i) < 0.55) continue;
    rects.push(
      <rect
        key={i}
        x={x}
        y={y}
        width={4.5}
        height={5.5}
        rx={0.8}
        fill={i % 3 === 0 ? "#ffd66b" : i % 3 === 1 ? "#9fc2ff" : "#ffffff"}
        opacity={0.9}
      />
    );
  }
  return <g>{rects}</g>;
}

export default function Scene({ type = "city-night", className = "", style }) {
  const uid = useId().replace(/[:]/g, "");
  const g = (id) => `url(#${uid}-${id})`;

  let art = null;
  let sky = "linear";
  let skyStops = ["#2a1f66", "#4b2fc4"];
  let extra = null;

  switch (type) {
    case "city-night":
      skyStops = ["#241a5e", "#6c4cf1", "#b076e8"];
      art = (
        <>
          <circle cx="162" cy="34" r="16" fill="#ffe9b3" opacity="0.95" />
          <circle cx="156" cy="30" r="14" fill={g("sky")} opacity="0.9" />
          <Stars count={10} />
          <path d="M0 130 L0 96 L200 96 L200 130 Z" fill="#0e1330" opacity="0.55" />
          <path d={SKYLINE} fill="#141b3d" />
          <Windows seed={3} />
          <path d="M0 118 C40 112 70 124 110 118 C150 112 175 122 200 116 L200 130 L0 130 Z" fill="#1d2a63" opacity="0.8" />
          <path d="M0 126 C50 122 90 128 140 124 C170 122 190 126 200 124 L200 130 L0 130 Z" fill="#2b3d8f" opacity="0.5" />
        </>
      );
      break;

    case "city-neon":
      skyStops = ["#12082e", "#3a1163"];
      art = (
        <>
          <Stars count={9} color="#ff9ef0" />
          <path d="M0 130 L0 84 L22 84 L22 60 L36 60 L36 88 L52 88 L52 48 L70 48 L70 80 L88 80 L88 36 L104 36 L104 74 L122 74 L122 58 L140 58 L140 86 L160 86 L160 50 L178 50 L178 84 L200 84 L200 130 Z" fill="#1a0f3d" />
          <g fill="none" strokeWidth="3" strokeLinecap="round">
            <path d="M40 66 h16 M56 62 v12" stroke="#ff5edb" />
            <path d="M100 44 h16 M116 40 v12" stroke="#35e2ff" />
            <path d="M156 58 h16 M172 54 v12" stroke="#ffd66b" />
            <path d="M66 94 h12 M78 90 v10" stroke="#7cffb2" />
          </g>
          <path d={SKYLINE} fill="#241255" opacity="0.85" />
          <Windows seed={7} />
          <path d="M0 124 L200 124 L200 130 L0 130 Z" fill="#0d0726" />
        </>
      );
      break;

    case "city-lights":
      skyStops = ["#1b2a5e", "#4a63d6", "#f2a3c6"];
      art = (
        <>
          <Stars count={8} />
          <path d="M0 130 L0 92 L46 92 L46 74 L92 74 L92 100 L150 100 L150 66 L200 66 L200 130 Z" fill="#101b45" />
          <Windows seed={5} />
          <path d="M152 66 L158 34 L176 34 L182 66 Z" fill="#0d1536" />
          <rect x="161" y="40" width="8" height="14" rx="2" fill="#ffd66b" />
          <circle cx="166" cy="32" r="4" fill="#ff8fb5" />
          <path d="M0 118 C50 112 100 124 150 118 C175 115 190 120 200 118 L200 130 L0 130 Z" fill="#0a1130" opacity="0.85" />
        </>
      );
      break;

    case "beach":
      skyStops = ["#ffb36b", "#ff8fb5", "#8f7bff"];
      art = (
        <>
          <circle cx="150" cy="42" r="20" fill="#fff3c4" />
          <path d="M0 96 C30 84 60 88 90 82 C120 76 160 80 200 74 L200 130 L0 130 Z" fill="#2d8fd6" opacity="0.9" />
          <path d="M0 106 C40 100 90 106 140 100 C170 97 190 100 200 99 L200 130 L0 130 Z" fill="#57b7e8" />
          <path d="M0 118 C50 112 110 118 200 112 L200 130 L0 130 Z" fill="#ffe0b0" />
          <path d="M30 118 C30 92 40 78 48 72 C56 66 60 58 58 48 C62 60 66 62 68 56 C72 62 78 58 80 52 C80 66 76 74 70 80 C78 84 82 94 82 118 Z" fill="#14532d" />
          <path d="M34 116 C30 100 36 88 44 82 C52 76 54 68 52 60 C56 70 60 72 62 68 C66 74 72 72 74 66 C74 78 72 84 66 90 C72 92 76 100 76 116 Z" fill="#166534" opacity="0.9" />
        </>
      );
      break;

    case "garden":
      skyStops = ["#0f2d4d", "#1d5c8f", "#39c2a8"];
      art = (
        <>
          <Stars count={8} />
          <path d="M0 130 L0 104 L200 104 L200 130 Z" fill="#0b2438" opacity="0.7" />
          {[44, 96, 148].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 108 L${x} ${56 - i * 6} L${x + 22} ${56 - i * 6} L${x + 22} 108 Z`} fill="#3f2d63" />
              <path d={`M${x} ${56 - i * 6} L${x + 22} ${56 - i * 6} L${x + 11} ${34 - i * 6} Z`} fill="#3f2d63" />
              <ellipse cx={x + 11} cy={56 - i * 6} rx={26} ry={11} fill={i % 2 ? "#7b2f8f" : "#2fae8f"} opacity="0.95" />
              <path d={`M${x - 22} ${58 - i * 6} A24 10 0 0 1 ${x + 44} ${58 - i * 6}`} fill="none" stroke="#d9fff4" strokeWidth="2" opacity="0.6" />
            </g>
          ))}
          <circle cx="150" cy="30" r="14" fill="#d9fff4" opacity="0.9" />
        </>
      );
      break;

    case "temple":
      skyStops = ["#2a1a5e", "#b0476f", "#ffb36b"];
      art = (
        <>
          <Stars count={7} />
          <path d="M0 130 L0 112 L200 112 L200 130 Z" fill="#1c1040" opacity="0.8" />
          <path d="M100 40 L100 26 L94 32 L100 20 L106 32 L100 26" fill="#ffd66b" />
          <path d="M70 108 L100 52 L130 108 Z" fill="#8a5a2b" />
          <path d="M58 108 L100 42 L142 108 Z" fill="#b0743c" />
          <path d="M46 108 L100 30 L154 108 Z" fill="#ffcf7d" />
          <path d="M62 108 L62 96 L138 96 L138 108 Z" fill="#e8a94e" />
          <path d="M50 108 L70 108 L70 92 L130 92 L130 108 L150 108 L140 96 L60 96 Z" fill="#c98a3c" />
          <rect x="92" y="84" width="16" height="24" rx="3" fill="#5b3218" />
          <circle cx="100" cy="70" r="7" fill="#ffb36b" opacity="0.9" />
          <path d="M46 108 C30 108 24 112 20 112 L200 112 C190 110 160 108 154 108 Z" fill="#3d2410" opacity="0.8" />
        </>
      );
      break;

    case "park":
      skyStops = ["#bfe3ff", "#e8f7ff"];
      art = (
        <>
          <circle cx="160" cy="30" r="16" fill="#ffe9a8" />
          <path d="M0 100 C40 88 90 96 200 84 L200 130 L0 130 Z" fill="#7fb86b" />
          <path d="M0 112 C60 102 120 110 200 102 L200 130 L0 130 Z" fill="#5da14e" />
          <path d="M28 112 C28 92 34 82 40 78 C46 74 50 70 48 62 C52 70 56 72 58 68 C62 74 66 70 68 66 C68 76 64 80 60 84 C66 86 70 92 70 112 Z" fill="#2f6b32" />
          <path d="M150 112 C150 96 156 88 162 84 C168 80 170 76 168 70 C172 76 176 78 178 74 C182 80 186 76 188 72 C188 82 184 86 180 90 C186 92 190 98 190 112 Z" fill="#3c7d3f" />
          <ellipse cx="100" cy="122" rx="52" ry="9" fill="#3f8fd6" opacity="0.7" />
          <path d="M34 96 C44 94 52 92 60 92 M158 98 C168 96 176 94 186 92" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </>
      );
      break;

    case "market":
      skyStops = ["#241a5e", "#8f5bd1"];
      art = (
        <>
          <Stars count={6} />
          <path d="M0 130 L0 108 L200 108 L200 130 Z" fill="#191238" />
          <path d="M10 76 L190 76" stroke="#1a1240" strokeWidth="3" />
          {[16, 64, 112, 160].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 78 L${x + 10} 40 L${x + 38} 40 L${x + 48} 78 Z`} fill={i % 2 ? "#e8598f" : "#5f43c9"} />
              <path d={`M${x + 8} 40 L${x + 40} 40 L${x + 40} 34 L${x + 8} 34 Z`} fill="#ffffff" opacity="0.9" />
              <rect x={x + 12} y={56} width={24} height={22} rx={3} fill="#191238" />
              <circle cx={x + 19} cy={66} r={3.4} fill="#ffd66b" />
              <circle cx={x + 29} cy={66} r={3.4} fill="#ff8fb5" />
            </g>
          ))}
          <path d="M0 82 C40 76 80 88 120 82 C160 76 180 84 200 82" stroke="#ffd66b" strokeWidth="1.6" strokeDasharray="5 7" fill="none" />
        </>
      );
      break;

    case "dining":
      skyStops = ["#2c1f5e", "#6c4cf1"];
      art = (
        <>
          <path d="M0 130 L0 60 L200 60 L200 130 Z" fill="#241a52" />
          <rect x="26" y="34" width="58" height="96" rx="6" fill="#e8e2ff" opacity="0.9" />
          <rect x="116" y="34" width="58" height="96" rx="6" fill="#ffd9e6" opacity="0.9" />
          <rect x="94" y="86" width="12" height="34" fill="#8a63c9" />
          <path d="M60 74 v30 M52 74 v30" stroke="#3a2a7c" strokeWidth="5" strokeLinecap="round" />
          <path d="M140 74 v30 M132 74 v30" stroke="#b04d75" strokeWidth="5" strokeLinecap="round" />
          <path d="M62 64 h26 M134 64 h26" stroke="#4b3a9c" strokeWidth="3" opacity="0.7" />
          <circle cx="52" cy="50" r="12" fill="#ffd66b" opacity="0.95" />
        </>
      );
      break;

    case "street-food":
      skyStops = ["#160b33", "#4a1a6e"];
      art = (
        <>
          <Stars count={6} color="#ff9ef0" />
          <path d="M0 130 L0 112 L200 112 L200 130 Z" fill="#0e0824" />
          <rect x="30" y="66" width="140" height="46" rx="8" fill="#2a1660" />
          <rect x="30" y="66" width="140" height="14" rx="7" fill="#ff5edb" opacity="0.9" />
          <path d="M46 112 v10 M66 112 v10 M86 112 v10 M106 112 v10 M126 112 v10 M146 112 v10" stroke="#120b2e" strokeWidth="6" strokeLinecap="round" />
          {[40, 62, 84, 106, 128, 150].map((x) => (
            <circle key={x} cx={x} cy="104" r="6" fill="#ffb36b" />
          ))}
          <g fill="none" stroke="#ffd9f2" strokeWidth="2.4" strokeLinecap="round" opacity="0.85">
            <path d="M52 94 c2-6 8-8 10-13 M96 92 c2-6 8-8 10-13 M138 94 c2-6 8-8 10-13" />
          </g>
        </>
      );
      break;

    case "rooftop":
      skyStops = ["#10142e", "#3a1163", "#b0476f"];
      art = (
        <>
          <Stars count={12} />
          <path d="M0 130 L0 108 L200 108 L200 130 Z" fill="#0b1020" />
          <path d={SKYLINE} fill="#171f45" opacity="0.9" />
          <path d="M20 84 L180 84 L180 108 L20 108 Z" fill="#1e2a5c" />
          <rect x="36" y="70" width="52" height="38" rx="5" fill="#27377a" />
          <path d="M36 76 h52 M36 88 h52" stroke="#0b1020" strokeWidth="3" opacity="0.6" />
          <path d="M62 84 v-8 a16 16 0 0 1 32 0 v8" fill="none" stroke="#ffd66b" strokeWidth="2" />
          <circle cx="78" cy="70" r="3.4" fill="#ffd66b" />
          <circle cx="62" cy="70" r="3.4" fill="#ff8fb5" />
          <path d="M20 84 C60 76 100 90 140 82 C160 78 175 82 180 82" stroke="#ffd66b" strokeWidth="1.4" strokeDasharray="4 6" fill="none" />
        </>
      );
      break;

    case "spa":
      skyStops = ["#d9c8ff", "#f6eaff"];
      art = (
        <>
          <ellipse cx="100" cy="108" rx="86" ry="18" fill="#8fd3d6" opacity="0.85" />
          <ellipse cx="100" cy="106" rx="66" ry="13" fill="#a9e4e2" opacity="0.9" />
          <g transform="translate(100 88)">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="0" cy="-26" rx="7.5" ry="15" fill="#c98af0" opacity="0.85" transform={`rotate(${a})`} />
            ))}
            <circle r="8" fill="#ffd66b" />
          </g>
          <path d="M30 130 C30 116 34 108 38 104 M170 130 C170 116 166 108 162 104" stroke="#7fb86b" strokeWidth="4" strokeLinecap="round" />
        </>
      );
      break;

    case "cooking":
      skyStops = ["#4a2c1a", "#b0476f"];
      art = (
        <>
          <path d="M0 130 L0 96 L200 96 L200 130 Z" fill="#241207" opacity="0.8" />
          <path d="M60 86 h80 a12 12 0 0 1 12 12 v0 a12 12 0 0 1 -12 12 h-80 a12 12 0 0 1 -12 -12 v0 a12 12 0 0 1 12 -12 z" fill="#3a3a3f" />
          <ellipse cx="100" cy="88" rx="40" ry="7" fill="#ffb36b" opacity="0.9" />
          <rect x="172" y="70" width="10" height="34" rx="4" fill="#5a3b1a" />
          <g fill="none" stroke="#ffe9d9" strokeWidth="2.6" strokeLinecap="round" opacity="0.85">
            <path d="M84 78 c3-7 9-9 12-14 M104 76 c3-7 9-9 12-14" />
          </g>
          <circle cx="182" cy="38" r="9" fill="#ffd66b" opacity="0.8" />
        </>
      );
      break;

    case "palace":
      skyStops = ["#2a1a5e", "#c98a3c", "#ffcf7d"];
      art = (
        <>
          <Stars count={6} />
          <path d="M0 130 L0 110 L200 110 L200 130 Z" fill="#241233" opacity="0.8" />
          <rect x="40" y="86" width="120" height="24" fill="#c98a3c" />
          <rect x="52" y="70" width="96" height="16" fill="#e8a94e" />
          {[64, 100, 136].map((x) => (
            <g key={x}>
              <path d={`M${x - 16} 70 L${x} 54 L${x + 16} 70 Z`} fill="#ffd66b" />
              <path d={`M${x} 54 L${x} 46 L${x + 5} 51 L${x} 46 L${x - 5} 51 Z`} fill="#ffd66b" />
            </g>
          ))}
          <rect x="88" y="86" width="24" height="24" fill="#5b3218" />
          <rect x="76" y="96" width="10" height="14" rx="2" fill="#3d2410" />
          <rect x="114" y="96" width="10" height="14" rx="2" fill="#3d2410" />
        </>
      );
      break;

    case "gallery":
      skyStops = ["#23233f", "#4a4a75"];
      art = (
        <>
          <path d="M0 130 L0 60 L200 60 L200 130 Z" fill="#1b1b33" />
          <rect x="20" y="40" width="52" height="44" rx="4" fill="#fff" />
          <rect x="84" y="30" width="42" height="54" rx="4" fill="#fff" />
          <rect x="138" y="44" width="42" height="40" rx="4" fill="#fff" />
          <path d="M28 72 L44 56 L56 70 L62 64 L72 72 Z" fill="#6c4cf1" />
          <circle cx="105" cy="48" r="8" fill="#ff8fb5" />
          <path d="M92 74 L102 62 L112 72 L118 64 L126 74 Z" fill="#3e7bfa" />
          <rect x="146" y="54" width="26" height="20" fill="#17b26a" />
          <circle cx="159" cy="62" r="6" fill="#ffd66b" />
        </>
      );
      break;

    case "rice":
      skyStops = ["#bfe3ff", "#e8f7d9"];
      art = (
        <>
          <circle cx="154" cy="34" r="14" fill="#ffe9a8" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${i * 70} 130 C${i * 70 + 10} 92 ${i * 70 + 26} 70 ${i * 70 + 40} 58 C${i * 70 + 54} 70 ${i * 70 + 64} 92 ${i * 70 + 70} 130 Z`}
              fill={i === 1 ? "#7fb86b" : "#5da14e"}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <path
              key={`w${i}`}
              d={`M${i * 70 + 6} 128 C${i * 70 + 14} 104 ${i * 70 + 22} 92 ${i * 70 + 30} 86 C${i * 70 + 38} 92 ${i * 70 + 46} 104 ${i * 70 + 54} 128 Z`}
              fill="#8fd3d6"
              opacity="0.75"
            />
          ))}
        </>
      );
      break;

    case "volcano":
      skyStops = ["#2a1a5e", "#b0476f", "#ffb36b"];
      art = (
        <>
          <Stars count={6} />
          <circle cx="100" cy="58" r="22" fill="#ffd9a8" opacity="0.9" />
          <path d="M30 130 L92 52 L108 52 L170 130 Z" fill="#3a2a55" />
          <path d="M92 52 L100 30 L108 52 Z" fill="#5a4a7a" />
          <path d="M96 44 C96 36 100 32 100 30 C100 32 104 36 104 44 Z" fill="#ff8f6b" />
          <path d="M0 130 L0 118 C50 112 150 112 200 118 L200 130 Z" fill="#241a40" />
          <path d="M30 130 C50 116 150 116 170 130 Z" fill="#1c1433" opacity="0.9" />
        </>
      );
      break;

    case "jungle":
      skyStops = ["#1d3b2f", "#2f6b4f"];
      art = (
        <>
          <path d="M0 130 C20 60 44 34 70 26 C56 52 48 90 52 130 Z" fill="#14532d" />
          <path d="M30 130 C60 48 90 22 120 14 C102 48 96 88 100 130 Z" fill="#166534" />
          <path d="M80 130 C112 40 146 20 176 16 C158 52 152 92 156 130 Z" fill="#1c7a3d" />
          <path d="M0 130 C30 110 70 116 100 108 C130 100 170 106 200 100 L200 130 Z" fill="#0f3d22" opacity="0.9" />
          <path d="M40 66 C56 58 72 66 84 56 M120 48 C136 40 152 48 164 38" stroke="#ffd66b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </>
      );
      break;

    case "plane":
      skyStops = ["#8fc3ff", "#d9ecff"];
      art = (
        <>
          <circle cx="160" cy="30" r="16" fill="#fff3c4" />
          <path d="M20 96 L180 48" stroke="#fff" strokeWidth="2.4" strokeDasharray="2 8" strokeLinecap="round" />
          <g transform="translate(148 42) rotate(18)">
            <path d="M0 0 C14 -10 34 -10 48 -2 L38 0 L14 4 L4 8 Z" fill="#3d455f" />
            <path d="M34 0 L14 4 L10 10 L22 6 L44 4 Z" fill="#5a6a99" />
            <circle cx="10" cy="5" r="1.6" fill="#6c4cf1" />
          </g>
          <path d="M0 130 L0 118 C60 112 140 112 200 118 L200 130 Z" fill="#c3d9f2" opacity="0.7" />
        </>
      );
      break;

    case "car":
      skyStops = ["#8fc3ff", "#d9ecff"];
      art = (
        <>
          <circle cx="160" cy="30" r="16" fill="#fff3c4" />
          <path d="M0 110 L200 110 M0 130 L0 110 L200 110 L200 130 Z" fill="#5a6a99" opacity="0.4" />
          <path d="M0 118 h200" stroke="#fff" strokeWidth="2" strokeDasharray="14 10" opacity="0.8" />
          <g transform="translate(70 92)">
            <path d="M0 0 C6 -16 20 -18 26 -18 h22 c6 0 18 2 24 14 c4 8 6 8 6 8 h6 a8 8 0 0 1 8 8 v6 h-100 v-6 a8 8 0 0 1 8-8 z" fill="#3d455f" />
            <path d="M12 2 h6 c2 0 4 2 5 4 h-13 c1-2 2-4 2-4 z" fill="#8fc3ff" />
            <path d="M60 4 h6 c2 0 4 2 5 4 h-13 z" fill="#8fc3ff" />
            <circle cx="24" cy="20" r="7" fill="#131a2e" />
            <circle cx="24" cy="20" r="3" fill="#d8dbe8" />
            <circle cx="76" cy="20" r="7" fill="#131a2e" />
            <circle cx="76" cy="20" r="3" fill="#d8dbe8" />
          </g>
        </>
      );
      break;

    case "train":
      skyStops = ["#241a5e", "#8f5bd1"];
      art = (
        <>
          <Stars count={6} />
          <path d="M0 130 L0 118 L200 118 L200 130 Z" fill="#241a40" />
          <path d="M0 112 h200 M0 120 h200" stroke="#5a4a7a" strokeWidth="4" />
          <g transform="translate(40 88)">
            <path d="M0 0 h110 v18 a8 8 0 0 1 -8 8 h-94 a8 8 0 0 1 -8 -8 z" fill="#3d455f" />
            <rect x="10" y="6" width="20" height="12" rx="2.5" fill="#ffd66b" />
            <rect x="40" y="6" width="20" height="12" rx="2.5" fill="#ffd66b" />
            <rect x="70" y="6" width="20" height="12" rx="2.5" fill="#ffd66b" />
            <circle cx="20" cy="26" r="6" fill="#131a2e" />
            <circle cx="80" cy="26" r="6" fill="#131a2e" />
          </g>
        </>
      );
      break;

    case "hotel":
      skyStops = ["#2c1f5e", "#6c4cf1"];
      art = (
        <>
          <Stars count={7} />
          <path d="M0 130 L0 96 L200 96 L200 130 Z" fill="#191238" />
          <rect x="60" y="34" width="80" height="78" rx="6" fill="#3f3178" />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={72 + c * 17}
                y={48 + r * 14}
                width="9"
                height="8"
                rx="1.5"
                fill={r % 2 === c % 2 ? "#ffd66b" : "#8fc3ff"}
                opacity="0.9"
              />
            ))
          )}
          <rect x="86" y="66" width="28" height="46" rx="4" fill="#241a52" />
          <path d="M92 88 h16 M92 96 h16" stroke="#ffd66b" strokeWidth="2" />
          <path d="M60 34 h80 l-6 -12 h-68 z" fill="#5a4ac9" />
        </>
      );
      break;

    case "mall":
      skyStops = ["#1b2a5e", "#4a63d6"];
      art = (
        <>
          <Stars count={6} />
          <path d="M0 130 L0 102 L200 102 L200 130 Z" fill="#101b45" />
          <path d="M30 102 L30 46 C30 40 40 36 48 36 L152 36 C160 36 170 40 170 46 L170 102 Z" fill="#232c55" />
          <rect x="40" y="50" width="52" height="40" rx="3" fill="#8fc3ff" opacity="0.8" />
          <rect x="108" y="50" width="52" height="40" rx="3" fill="#ff8fb5" opacity="0.8" />
          <rect x="74" y="66" width="52" height="36" rx="4" fill="#101b45" />
          <path d="M88 66 h24 M88 78 h24 M88 90 h24" stroke="#8fc3ff" strokeWidth="2.5" opacity="0.9" />
        </>
      );
      break;

    default:
      skyStops = ["#241a5e", "#6c4cf1"];
      art = (
        <>
          <Stars count={10} />
          <path d={SKYLINE} fill="#141b3d" />
          <Windows seed={2} />
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
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          {skyStops.map((c, i) => (
            <stop key={i} offset={(i / (skyStops.length - 1)) * 100 + "%"} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width="200" height="130" fill={g("sky")} />
      {extra}
      {art}
    </svg>
  );
}
