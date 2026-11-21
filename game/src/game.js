// game.js — logika "Hutan Kabut Senja": klik, penanda, counter,
// timer, hint, level, dan layar menang/kalah. Semua gambar datang
// dari scenes.js; semua bunyi dari audio.js.

import { LEVELS, PANEL_W, PANEL_H } from "./differences.js";
import { drawLevel } from "./scenes.js";
import { playFound, playWrong, playHint, playLevelClear, playWin, playLose, playTick } from "./audio.js";

const DIFFS_PER_LEVEL = 7;

export const state = {
  screen: "start", // start | playing | levelclear | win | lose
  levelIndex: 0,
  found: new Set(), // id perbedaan yang sudah ditemukan di level ini
  wrongMarks: [], // {x, y, side, until} — tanda X merah sesaat
  hintsLeft: 3,
  hintPulse: null, // {diff, until} — perbedaan yang sedang disorot hint
  timeLeft: 0,
  score: 0,
  totalFound: 0,
  seed: 1,
  startedAt: 0,
  elapsedMs: 0,
};

let leftCtx, rightCtx, leftCanvas, rightCanvas;
let timerId = null;
let lastTickSecond = -1;

function $(id) { return document.getElementById(id); }

function level() { return LEVELS[state.levelIndex]; }

// Gambar ulang kedua panel + semua penanda yang aktif.
export function render() {
  if (!leftCtx || !rightCtx) return;
  const lv = level();
  drawLevel(leftCtx, lv, "left", state.seed);
  drawLevel(rightCtx, lv, "right", state.seed);
  // Lingkaran hijau di kedua panel untuk tiap perbedaan yang ketemu.
  for (const id of state.found) {
    const d = lv.diffs.find((x) => x.id === id);
    if (!d) continue;
    for (const c of [leftCtx, rightCtx]) {
      c.strokeStyle = "#39d353"; c.lineWidth = 4;
      c.beginPath(); c.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2); c.stroke();
      c.fillStyle = "#39d353";
      c.beginPath(); c.arc(d.x, d.y, 4, 0, Math.PI * 2); c.fill();
    }
  }
  // Denyut hint: lingkaran kuning berdenyut di perbedaan yang disorot.
  if (state.hintPulse && Date.now() < state.hintPulse.until) {
    const d = state.hintPulse.diff;
    const pulse = 6 + Math.sin(Date.now() / 120) * 3;
    for (const c of [leftCtx, rightCtx]) {
      c.strokeStyle = "#ffd23f"; c.lineWidth = 3;
      c.beginPath(); c.arc(d.x, d.y, d.r + pulse, 0, Math.PI * 2); c.stroke();
    }
    requestAnimationFrame(render);
  }
  // Tanda X merah untuk klik salah (hilang sendiri).
  const now = Date.now();
  state.wrongMarks = state.wrongMarks.filter((m) => now < m.until);
  for (const m of state.wrongMarks) {
    const c = m.side === "left" ? leftCtx : rightCtx;
    c.strokeStyle = "#ff4d4d"; c.lineWidth = 4;
    c.beginPath();
    c.moveTo(m.x - 10, m.y - 10); c.lineTo(m.x + 10, m.y + 10);
    c.moveTo(m.x + 10, m.y - 10); c.lineTo(m.x - 10, m.y + 10);
    c.stroke();
  }
}

function updateHud() {
  const lv = level();
  $("hud-level").textContent = `Level ${state.levelIndex + 1}/3 — ${lv.name}`;
  $("hud-left").textContent = `Tersisa ${DIFFS_PER_LEVEL - state.found.size} dari ${DIFFS_PER_LEVEL}`;
  $("hud-timer").textContent = `⏱ ${Math.max(0, Math.ceil(state.timeLeft))} dtk`;
  $("hud-timer").classList.toggle("danger", state.timeLeft <= 10 && state.screen === "playing");
  $("hud-hints").textContent = `Hint: ${state.hintsLeft} (H)`;
  $("hud-score").textContent = `Skor: ${state.score}`;
  $("btn-hint").disabled = state.hintsLeft <= 0 || state.screen !== "playing";
}

// Klik di salah satu panel: cocokkan dengan perbedaan yang belum ketemu.
function onPanelClick(ev, side) {
  if (state.screen !== "playing") return;
  const canvas = side === "left" ? leftCanvas : rightCanvas;
  const rect = canvas.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((ev.clientY - rect.top) / rect.height) * PANEL_H;
  const lv = level();
  const hit = lv.diffs.find((d) => !state.found.has(d.id) &&
    Math.hypot(d.x - x, d.y - y) <= d.r + 6);
  if (hit) {
    state.found.add(hit.id);
    state.totalFound++;
    state.score += 100;
    playFound();
    render(); updateHud();
    if (state.found.size === DIFFS_PER_LEVEL) onLevelComplete();
  } else {
    state.wrongMarks.push({ x, y, side, until: Date.now() + 450 });
    playWrong();
    render();
    setTimeout(render, 480);
  }
}

// ---------- Alur level, timer, hint, menang/kalah ----------

function showOverlay(id) {
  for (const o of document.querySelectorAll(".overlay")) o.classList.add("hidden");
  if (id) $(id).classList.remove("hidden");
}

function startTimer() {
  stopTimer();
  lastTickSecond = -1;
  timerId = setInterval(() => {
    if (state.screen !== "playing") return;
    state.timeLeft -= 0.25;
    const sec = Math.ceil(state.timeLeft);
    if (sec <= 10 && sec !== lastTickSecond && sec > 0) { lastTickSecond = sec; playTick(); }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      onTimeUp();
    }
    updateHud();
  }, 250);
}

function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}

export function startLevel(index) {
  state.levelIndex = index;
  state.found = new Set();
  state.wrongMarks = [];
  state.hintsLeft = 3;
  state.hintPulse = null;
  state.timeLeft = level().timeLimit;
  state.screen = "playing";
  showOverlay(null);
  render(); updateHud();
  startTimer();
}

function onLevelComplete() {
  stopTimer();
  const bonus = Math.ceil(state.timeLeft) * 5;
  state.score += bonus;
  updateHud();
  if (state.levelIndex + 1 >= LEVELS.length) {
    state.screen = "win";
    state.elapsedMs = Date.now() - state.startedAt;
    playWin();
    $("win-score").textContent = `Skor akhir: ${state.score} — ${state.totalFound} perbedaan ditemukan`;
    showOverlay("overlay-win");
  } else {
    state.screen = "levelclear";
    playLevelClear();
    $("clear-text").textContent =
      `Level ${state.levelIndex + 1} selesai! Bonus waktu +${bonus}. Lanjut ke ${LEVELS[state.levelIndex + 1].name}.`;
    showOverlay("overlay-clear");
    setTimeout(() => { if (state.screen === "levelclear") startLevel(state.levelIndex + 1); }, 2600);
  }
}

function onTimeUp() {
  stopTimer();
  state.screen = "lose";
  playLose();
  $("lose-text").textContent =
    `Waktu habis di ${level().name}. Kamu menemukan ${state.found.size} dari ${DIFFS_PER_LEVEL} perbedaan. Coba lagi!`;
  showOverlay("overlay-lose");
}

export function useHint() {
  if (state.screen !== "playing" || state.hintsLeft <= 0) return;
  const remaining = level().diffs.filter((d) => !state.found.has(d.id));
  if (!remaining.length) return;
  state.hintsLeft--;
  state.hintPulse = { diff: remaining[Math.floor(Math.random() * remaining.length)], until: Date.now() + 2500 };
  playHint();
  render(); updateHud();
  setTimeout(render, 2600);
}

export function startGame() {
  state.score = 0;
  state.totalFound = 0;
  state.startedAt = Date.now();
  startLevel(0);
}

export function restart() {
  startGame();
}

// ---------- API untuk shots.js (keadaan deterministik) ----------

// Terapkan preset screenshot: start | play | almost | win.
export function applyShot(shot, seed) {
  state.seed = seed || 1;
  if (shot === "start") {
    state.screen = "start";
    startLevelSilent();
    showOverlay("overlay-start");
  } else if (shot === "play" || shot === "almost") {
    startGame();
    const n = shot === "play" ? 3 : 6;
    for (const d of level().diffs.slice(0, n)) { state.found.add(d.id); state.totalFound++; }
    state.score = n * 100;
    state.timeLeft = shot === "play" ? 87 : 23;
    render(); updateHud();
  } else if (shot === "win") {
    startGame();
    for (const d of level().diffs) state.found.add(d.id);
    state.totalFound = DIFFS_PER_LEVEL * 3;
    state.score = 2450;
    state.screen = "win";
    stopTimer();
    $("win-score").textContent = "Skor akhir: 2450 — 21 perbedaan ditemukan";
    render(); updateHud();
    showOverlay("overlay-win");
  }
  render(); updateHud();
}

// Level pertama digambar tanpa timer (untuk layar judul).
function startLevelSilent() {
  state.levelIndex = 0;
  state.found = new Set();
  state.wrongMarks = [];
  state.hintsLeft = 3;
  state.hintPulse = null;
  state.timeLeft = level().timeLimit;
  render(); updateHud();
}

// ---------- Inisialisasi ----------
export function initGame() {
  leftCanvas = $("panel-left"); rightCanvas = $("panel-right");
  leftCanvas.width = PANEL_W; leftCanvas.height = PANEL_H;
  rightCanvas.width = PANEL_W; rightCanvas.height = PANEL_H;
  // Konteks 2D wajib diambil di sini — tanpa ini render() tak menggambar apa-apa.
  leftCtx = leftCanvas.getContext("2d");
  rightCtx = rightCanvas.getContext("2d");
  leftCanvas.addEventListener("click", (e) => onPanelClick(e, "left"));
  rightCanvas.addEventListener("click", (e) => onPanelClick(e, "right"));
  $("btn-start").addEventListener("click", startGame);
  $("btn-hint").addEventListener("click", useHint);
  $("btn-restart").addEventListener("click", restart);
  $("btn-again").addEventListener("click", restart);
  $("btn-retry").addEventListener("click", restart);
  $("btn-next").addEventListener("click", () => startLevel(state.levelIndex + 1));
  document.addEventListener("keydown", (e) => {
    if (e.key === "h" || e.key === "H") useHint();
    if (e.key === "r" || e.key === "R") restart();
    if (e.key === "Enter" && state.screen === "start") startGame();
  });
  startLevelSilent();
  showOverlay("overlay-start");
}

