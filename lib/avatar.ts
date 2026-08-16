/**
 * Deterministic cyber avatar generator
 * Creates unique gradient avatars based on nickname hash
 */

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateAvatar(nickname: string): string {
  const hash = hashString(nickname);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40 + (hash % 60)) % 360;
  const hue3 = (hue2 + 30 + (hash % 40)) % 360;
  const sat = 65 + (hash % 25);
  const light1 = 45 + (hash % 15);
  const light2 = 55 + (hash % 15);
  const initial = nickname.charAt(0).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue1},${sat}%,${light1}%)"/>
        <stop offset="50%" style="stop-color:hsl(${hue2},${sat}%,${light2}%)"/>
        <stop offset="100%" style="stop-color:hsl(${hue3},${sat}%,${light1}%)"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#g1)"/>
    <rect x="5" y="5" width="90" height="90" rx="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="50" y="56" font-family="JetBrains Mono, monospace" font-size="42" font-weight="700" fill="white" text-anchor="middle" filter="url(#glow)" opacity="0.95">${initial}</text>
    <circle cx="80" cy="20" r="6" fill="rgba(255,255,255,0.3)"/>
    <circle cx="20" cy="80" r="4" fill="rgba(255,255,255,0.2)"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export const PREDEFINED_AVATARS = [
  { id: "cyber", name: "Cyber", color: "#00f0ff" },
  { id: "matrix", name: "Matrix", color: "#00ff88" },
  { id: "phoenix", name: "Phoenix", color: "#ff7700" },
  { id: "void", name: "Void", color: "#7000ff" },
  { id: "crimson", name: "Crimson", color: "#ff3366" },
  { id: "amber", name: "Amber", color: "#ffcc00" },
];
