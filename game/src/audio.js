// audio.js — semua bunyi dibuat dengan WebAudio, tanpa file suara.
// AudioContext dibuat malas (lazy): baru hidup setelah gestur pertama,
// supaya tidak diblokir kebijakan autoplay browser.

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function setMuted(m) { muted = !!m; }
export function isMuted() { return muted; }

// Satu nada sinus dengan selubung naik-turun yang halus.
function tone(freq, startAt, dur, vol, type) {
  const c = ac();
  if (!c || muted) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, c.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, c.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + startAt + dur);
  osc.connect(gain); gain.connect(c.destination);
  osc.start(c.currentTime + startAt);
  osc.stop(c.currentTime + startAt + dur + 0.05);
}

// Bunyi saat perbedaan ditemukan: dua nada naik yang memuaskan.
export function playFound() {
  tone(660, 0, 0.14, 0.22);
  tone(990, 0.09, 0.22, 0.22);
}

// Bunyi klik salah: dengung rendah yang pendek.
export function playWrong() {
  tone(140, 0, 0.18, 0.16, "sawtooth");
}

// Bunyi hint: lonceng lembut satu nada.
export function playHint() {
  tone(1175, 0, 0.3, 0.15, "triangle");
  tone(1568, 0.12, 0.3, 0.1, "triangle");
}

// Bunyi level selesai: tangga nada naik empat langkah.
export function playLevelClear() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.2, 0.2));
}

// Bunyi menang: arpeggio ceria enam nada.
export function playWin() {
  [523, 659, 784, 1047, 784, 1319].forEach((f, i) => tone(f, i * 0.12, 0.28, 0.2));
}

// Bunyi kalah: tiga nada turun.
export function playLose() {
  [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 0.18, "triangle"));
}

// Bunyi detik terakhir: ketukan pendek saat timer di bawah 10 detik.
export function playTick() {
  tone(880, 0, 0.06, 0.1, "square");
}

