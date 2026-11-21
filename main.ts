// main.ts — program penyerahan "Hutan Kabut Senja".
// Menyalin game/ dan screenshots/ dari repo ini ke direktori output,
// lalu menulis /output/dossier.json lewat buildDossier dari
// ./vendor/makefun-game.ts (salinan kit, tanpa perubahan).
// Dijalankan dua kali oleh grader; kedua run harus menulis byte yang sama.
//   MAKEFUN_OUTPUT_DIR=out node main.ts   (di luar grader, /output diganti out)

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

// Batas yang dipakai scorer bounty ini (dari RULES.txt):
// teks dossier maks 160 KiB, maks 4 screenshot @ 256 KiB,
// game/ maks 993 entri dan 48 MiB.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
};

// Akar repo = folder yang menampung main.ts ini.
const repoRoot = dirname(fileURLToPath(import.meta.url));
// Grader memberi /output; di luar grader, MAKEFUN_OUTPUT_DIR menggantikannya.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Hapus isi lama (hanya game/, screenshots/, dossier.json) supaya
// run kedua menulis hasil yang persis sama — tanpa menghapus
// direktori output itu sendiri, yang di grader bisa berupa mount point.
for (const name of ["game", "screenshots", "dossier.json"]) {
  const p = join(outDir, name);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

// Salin game dan screenshot apa adanya (file biasa, tanpa symlink).
// Dereferensikan symlink bila ada, supaya /output hanya berisi file biasa.
cpSync(join(repoRoot, "game"), join(outDir, "game"), { recursive: true, dereference: true });
cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true, dereference: true });

// Dossier dihitung dari hasil salinan di outDir, bukan dari repo,
// supaya yang tertulis persis menggambarkan isi /output.
// buildDossier mengembalikan byte JSON kanonis (makefun/dossier/v1).
writeFileSync(join(outDir, "dossier.json"), buildDossier(outDir, CAPS));

console.log(`wrote ${outDir}/dossier.json`);

