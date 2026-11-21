// shots.js — dukungan query ?shot= untuk screenshot deterministik.
// ?shot=start  → layar judul (level 1 di belakangnya)
// ?shot=play   → level 1 berjalan, 3 dari 7 sudah ditemukan
// ?shot=almost → level 1 hampir selesai, 6 dari 7 ditemukan
// ?shot=win    → layar menang
// &seed=N membuat elemen acak (bintang, kunang-kunang) tetap sama.
// Setelah satu frame ter-render, window.__shotReady = true.

import { initGame, applyShot } from "./game.js";

const params = new URLSearchParams(window.location.search);
const shot = params.get("shot");
const seed = parseInt(params.get("seed") || "1", 10) || 1;

initGame();

if (shot) {
  applyShot(shot, seed);
} else {
  // Tanpa ?shot=, game dibuka biasa: layar judul di atas level 1.
  window.__shotReady = false;
}

// Beri satu frame untuk canvas tergambar penuh, lalu tandai siap.
// Screenshot otomatis menunggu flag ini sebelum memotret.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.__shotReady = true;
  });
});

// Untuk debug manual di konsol: window.__shot() mengembalikan keadaan.
window.__shot = () => ({ shot: shot || "(none)", seed });

