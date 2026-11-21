// scenes.js — semua gambar digambar murni dengan kode canvas.
// Tanpa aset eksternal, tanpa gambar dari luar. Panel kiri = asli,
// panel kanan = berubah (perbedaan digambar oleh pelukis tiap diff).

import { PANEL_W, PANEL_H } from "./differences.js";

// RNG deterministik supaya kedua panel identik kecuali perbedaannya,
// dan supaya screenshot dengan ?seed= tetap sama setiap kali.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sky(ctx, top, mid, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function stars(ctx, rng, count, yMax) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = rng() * PANEL_W, y = rng() * yMax, r = 0.6 + rng() * 1.4;
    ctx.globalAlpha = 0.35 + rng() * 0.6;
    ctx.fillStyle = "#ffeecf";
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function mist(ctx, rng, yBase) {
  // Kabut: pita-pita elips tembus pandang di dekat tanah/air.
  ctx.save();
  for (let i = 0; i < 7; i++) {
    const x = rng() * PANEL_W, y = yBase + rng() * 46 - 23;
    const w = 90 + rng() * 130, h = 12 + rng() * 14;
    const g = ctx.createRadialGradient(x, y, 2, x, y, w / 2);
    g.addColorStop(0, "rgba(220,228,255,0.20)");
    g.addColorStop(1, "rgba(220,228,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, w / 2, h, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function pine(ctx, x, y, s, dark) {
  // Pohon pinus segitiga berlapis.
  ctx.save();
  ctx.fillStyle = dark;
  ctx.fillRect(x - 3 * s, y - 6 * s, 6 * s, 6 * s);
  for (let i = 0; i < 3; i++) {
    const w = (46 - i * 11) * s, h = 34 * s, ty = y - (i * 24 + 6) * s;
    ctx.beginPath();
    ctx.moveTo(x, ty - h); ctx.lineTo(x - w / 2, ty); ctx.lineTo(x + w / 2, ty);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------- Level 1: Tepi Danau ----------
function drawLake(ctx, side, rng) {
  sky(ctx, "#2b2350", "#c96f4a", "#f2a65e");
  // Matahari senja + pantulannya di air.
  ctx.fillStyle = "#ffd9a0";
  ctx.beginPath(); ctx.arc(150, 150, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3a2f5e";
  ctx.fillRect(0, 210, PANEL_W, 190);
  const g = ctx.createLinearGradient(0, 210, 0, 400);
  g.addColorStop(0, "rgba(242,166,94,0.55)");
  g.addColorStop(1, "rgba(58,47,94,0.1)");
  ctx.fillStyle = g; ctx.fillRect(0, 210, PANEL_W, 190);
  // Riak air.
  ctx.strokeStyle = "rgba(255,220,170,0.35)"; ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    const y = 235 + i * 17, x = 60 + rng() * 420, w = 26 + rng() * 50;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }
  // Pegunungan jauh.
  ctx.fillStyle = "#4a3a72";
  ctx.beginPath(); ctx.moveTo(0, 210); ctx.lineTo(120, 130); ctx.lineTo(230, 210); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(300, 210); ctx.lineTo(430, 120); ctx.lineTo(560, 210); ctx.closePath(); ctx.fill();
  // Pinus di tepi.
  pine(ctx, 40, 250, 1.0, "#241d42");
  pine(ctx, 520, 245, 1.15, "#241d42");
  pine(ctx, 490, 262, 0.8, "#2e2552");
  // Dermaga kayu.
  ctx.fillStyle = "#5a3d2b";
  ctx.fillRect(270, 240, 90, 12);
  ctx.fillStyle = "#6e4a33";
  for (let i = 0; i < 5; i++) ctx.fillRect(274 + i * 17, 232, 13, 8);
  ctx.fillRect(282, 252, 8, 60); ctx.fillRect(340, 252, 8, 60);
  // Teratai kedua (yang di 180,330 digambar pelukis diff "teratai").
  ctx.fillStyle = "#3f7d4e";
  ctx.beginPath(); ctx.ellipse(420, 350, 24, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Kunang-kunang.
  ctx.fillStyle = "#ffe98a";
  for (let i = 0; i < 8; i++) {
    ctx.globalAlpha = 0.5 + rng() * 0.5;
    ctx.beginPath(); ctx.arc(30 + rng() * 500, 200 + rng() * 130, 2.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  stars(ctx, rng, 26, 120);
  mist(ctx, rng, 300);
}

// ---------- Level 2: Pondok Jamur ----------
function drawCottage(ctx, side, rng) {
  sky(ctx, "#1f2a4a", "#7a5a8a", "#e08a5e");
  stars(ctx, rng, 30, 110);
  // Tanah + jalan batu.
  ctx.fillStyle = "#2c4632"; ctx.fillRect(0, 280, PANEL_W, 120);
  ctx.fillStyle = "#8a7a68";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.ellipse(230 + i * 8, 330 + i * 12, 16, 7, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Pondok: badan + atap jamur merah.
  ctx.fillStyle = "#c98f5f"; ctx.fillRect(190, 180, 180, 110);
  ctx.fillStyle = "#b3402f";
  ctx.beginPath(); ctx.ellipse(280, 180, 125, 62, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#f4ead8";
  const spots = [[225, 150], [268, 132], [312, 148], [348, 162]];
  for (const [x, y] of spots) { ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill(); }
  // Cerobong + pintu + jendela bundar.
  ctx.fillStyle = "#7a5a44"; ctx.fillRect(140, 96, 22, 66);
  ctx.fillStyle = "#5a3d2b"; ctx.fillRect(262, 220, 36, 70);
  ctx.fillStyle = "#ffd98a"; ctx.beginPath(); ctx.arc(262, 258, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3a2f5e"; ctx.beginPath(); ctx.arc(282, 182, 20, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#f4ead8"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(282, 182, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(262, 182); ctx.lineTo(302, 182); ctx.stroke();
  // Pagar kayu kanan.
  ctx.fillStyle = "#6e4a33";
  for (let i = 0; i < 4; i++) ctx.fillRect(470 + i * 18, 258, 10, 44);
  ctx.fillRect(466, 268, 80, 6);
  // Bunga-bunga.
  const flowers = [[120, 320, "#e87aa0"], [452, 322, "#e87aa0"], [90, 350, "#ffd98a"], [500, 350, "#ffd98a"]];
  for (const [x, y, c] of flowers) {
    ctx.fillStyle = c;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
  }
  // Jamur kecil di (118,332) digambar pelukis diff "jamur" (kanan saja).
  pine(ctx, 60, 300, 0.9, "#1d2f24");
  pine(ctx, 540, 296, 0.8, "#1d2f24");
  mist(ctx, rng, 330);
}

// ---------- Level 3: Kuil Batu Lumut ----------
function drawTemple(ctx, side, rng) {
  sky(ctx, "#141a33", "#3d4a6e", "#8a6a8a");
  stars(ctx, rng, 40, 130);
  // Bulan purnama pucat di balik kabut.
  ctx.fillStyle = "#e8e4d8";
  ctx.beginPath(); ctx.arc(470, 66, 26, 0, Math.PI * 2); ctx.fill();
  // Lantai batu.
  ctx.fillStyle = "#3a3a44"; ctx.fillRect(0, 300, PANEL_W, 100);
  ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, 320 + i * 20); ctx.lineTo(560, 320 + i * 20); ctx.stroke(); }
  // Gapura batu.
  ctx.fillStyle = "#5a5a66";
  ctx.fillRect(120, 90, 26, 220); ctx.fillRect(414, 90, 26, 220);
  ctx.fillRect(100, 66, 360, 26);
  ctx.fillRect(112, 96, 336, 12);
  // Patung penjaga di tengah.
  ctx.fillStyle = "#6e6e7a";
  ctx.fillRect(180, 150, 44, 90);
  ctx.beginPath(); ctx.arc(202, 132, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(168, 240, 68, 16);
  ctx.fillStyle = "#8a8a96";
  ctx.beginPath(); ctx.arc(202, 162, 5, 0, Math.PI * 2); ctx.fill();
  // Obor kiri.
  ctx.fillStyle = "#4a3524"; ctx.fillRect(86, 210, 10, 60);
  ctx.fillStyle = "#3a2f22"; ctx.beginPath(); ctx.arc(91, 206, 12, 0, Math.PI * 2); ctx.fill();
  // Mangkuk persembahan.
  ctx.fillStyle = "#7a5a44";
  ctx.beginPath(); ctx.ellipse(332, 306, 26, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(326, 306, 12, 12);
  // Batu rune kanan.
  ctx.fillStyle = "#4a4a58";
  ctx.beginPath(); ctx.moveTo(422, 232); ctx.lineTo(446, 262); ctx.lineTo(422, 292); ctx.lineTo(398, 262); ctx.closePath(); ctx.fill();
  // Sulur dan lumut di dinding gapura.
  ctx.strokeStyle = "#3f7d4e"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(120, 100); ctx.quadraticCurveTo(150, 160, 128, 220); ctx.stroke();
  ctx.fillStyle = "#4a8a58";
  // Bercak lumut di (152,332) digambar pelukis diff "lumut" (kanan saja).
  ctx.beginPath(); ctx.ellipse(500, 350, 26, 9, 0, 0, Math.PI * 2); ctx.fill();
  mist(ctx, rng, 320);
}

// ---------- Pelukis perbedaan ----------
// Setiap diff digambar berbeda di panel kiri vs kanan.
const DIFF_PAINT = {
  danau: {
    bebek: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#f4ead8"; ctx.beginPath(); ctx.ellipse(430, 298, 16, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(444, 290, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#e8912d"; ctx.beginPath(); ctx.moveTo(450, 290); ctx.lineTo(458, 293); ctx.lineTo(450, 296); ctx.closePath(); ctx.fill(); } },
    bulan: (ctx, side) => { ctx.fillStyle = "#ffe9b0"; ctx.beginPath(); ctx.arc(92, 72, 22, 0, Math.PI * 2); ctx.fill(); if (side === "right") { ctx.fillStyle = "#2b2350"; ctx.beginPath(); ctx.arc(102, 66, 20, 0, Math.PI * 2); ctx.fill(); } },
    teratai: (ctx, side) => { if (side === "left") { ctx.fillStyle = "#3f7d4e"; ctx.beginPath(); ctx.ellipse(178, 332, 30, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#e8a7c8"; ctx.beginPath(); ctx.arc(178, 328, 7, 0, Math.PI * 2); ctx.fill(); } },
    lentera: (ctx, side) => { ctx.fillStyle = side === "left" ? "#ffb347" : "#4dd0c4"; ctx.beginPath(); ctx.arc(302, 208, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#5a3d2b"; ctx.fillRect(300, 196, 4, 6); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.arc(298, 204, 4, 0, Math.PI * 2); ctx.fill(); },
    ikan: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#c9d6ff"; ctx.beginPath(); ctx.ellipse(252, 282, 14, 6, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(240, 276); ctx.lineTo(230, 270); ctx.lineTo(238, 284); ctx.closePath(); ctx.fill(); } },
    bintang: (ctx, side) => { if (side === "left") { ctx.fillStyle = "#ffeecf"; ctx.beginPath(); ctx.arc(468, 58, 3, 0, Math.PI * 2); ctx.fill(); } },
    ranting: (ctx, side) => { if (side === "right") { ctx.strokeStyle = "#241d42"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(516, 148); ctx.lineTo(540, 132); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(528, 140); ctx.lineTo(536, 124); ctx.stroke(); } },
  },
  pondok: {
    asap: (ctx, side) => { if (side === "left") { ctx.fillStyle = "rgba(230,230,240,0.75)"; ctx.beginPath(); ctx.arc(148, 62, 10, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(158, 46, 13, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(170, 28, 15, 0, Math.PI * 2); ctx.fill(); } },
    jendela: (ctx, side) => { ctx.fillStyle = side === "left" ? "#ffd98a" : "#20263a"; ctx.beginPath(); ctx.arc(282, 182, 20, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#f4ead8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(282, 182, 20, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(262, 182); ctx.lineTo(302, 182); ctx.stroke(); },
    kucing: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#2b2b33"; ctx.beginPath(); ctx.ellipse(382, 108, 16, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(396, 100, 7, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(391, 95); ctx.lineTo(393, 88); ctx.lineTo(396, 94); ctx.closePath(); ctx.fill(); } },
    jamur: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#b3402f"; ctx.beginPath(); ctx.ellipse(118, 332, 12, 7, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#f4ead8"; ctx.fillRect(115, 332, 5, 8); } },
    bunga: (ctx, side) => { ctx.fillStyle = side === "left" ? "#e87aa0" : "#7aa0e8"; for (let p = 0; p < 5; p++) { const a = (p / 5) * Math.PI * 2; ctx.beginPath(); ctx.arc(452 + Math.cos(a) * 6, 322 + Math.sin(a) * 6, 4, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(452, 322, 3.5, 0, Math.PI * 2); ctx.fill(); },
    pagar: (ctx, side) => { if (side === "left") { ctx.fillStyle = "#6e4a33"; ctx.fillRect(502, 258, 10, 44); } },
    batu: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#8a7a68"; ctx.beginPath(); ctx.ellipse(232, 352, 16, 7, 0, 0, Math.PI * 2); ctx.fill(); } },
  },
  kuil: {
    mata: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#ffe98a"; ctx.beginPath(); ctx.arc(202, 162, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2b2b33"; ctx.beginPath(); ctx.arc(202, 162, 2.5, 0, Math.PI * 2); ctx.fill(); } },
    obor: (ctx, side) => { if (side === "left") { ctx.fillStyle = "#ffb347"; ctx.beginPath(); ctx.moveTo(91, 200); ctx.quadraticCurveTo(80, 182, 91, 172); ctx.quadraticCurveTo(102, 182, 91, 200); ctx.fill(); ctx.fillStyle = "#ffe98a"; ctx.beginPath(); ctx.arc(91, 190, 5, 0, Math.PI * 2); ctx.fill(); } },
    sulur: (ctx, side) => { if (side === "right") { ctx.strokeStyle = "#3f7d4e"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(468, 122); ctx.quadraticCurveTo(490, 150, 470, 180); ctx.stroke(); } },
    mangkuk: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#e8912d"; ctx.beginPath(); ctx.arc(332, 298, 6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(342, 300, 5, 0, Math.PI * 2); ctx.fill(); } },
    rune: (ctx, side) => { if (side === "left") { ctx.strokeStyle = "#7ae8ff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(422, 246); ctx.lineTo(422, 278); ctx.moveTo(410, 258); ctx.lineTo(434, 258); ctx.stroke(); } },
    burung: (ctx, side) => { if (side === "left") { ctx.fillStyle = "#1d1d26"; ctx.beginPath(); ctx.ellipse(282, 72, 12, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(292, 68, 5, 0, Math.PI * 2); ctx.fill(); } },
    lumut: (ctx, side) => { if (side === "right") { ctx.fillStyle = "#4a8a58"; ctx.beginPath(); ctx.ellipse(152, 332, 30, 10, 0, 0, Math.PI * 2); ctx.fill(); } },
  },
};

const BASE_SCENES = { danau: drawLake, pondok: drawCottage, kuil: drawTemple };

// Gambar satu panel utuh: adegan dasar + perbedaan untuk sisi itu.
// seed membuat elemen acak (bintang, kunang-kunang) deterministik.
export function drawLevel(ctx, level, side, seed) {
  const rng = mulberry32(seed * 7919 + level.diffs.length * 131);
  BASE_SCENES[level.id](ctx, side, rng);
  const painters = DIFF_PAINT[level.id] || {};
  for (const d of level.diffs) {
    const paint = painters[d.id];
    if (paint) paint(ctx, side);
  }
}

