// differences.js — data perbedaan "Hutan Kabut Senja".
// Satu level = 7 perbedaan. Koordinat dalam ruang panel 560x400.
// "side" yang digambar ditentukan scenes.js: kiri = asli, kanan = berubah.

export const PANEL_W = 560;
export const PANEL_H = 400;

export const LEVELS = [
  {
    id: "danau",
    name: "Tepi Danau",
    hint: "Senja di tepi danau berkabut",
    timeLimit: 120,
    diffs: [
      { id: "bebek",   x: 430, y: 298, r: 26, label: "Bebek tambahan" },
      { id: "bulan",   x: 92,  y: 72,  r: 30, label: "Bentuk bulan" },
      { id: "teratai", x: 178, y: 332, r: 24, label: "Daun teratai hilang" },
      { id: "lentera", x: 302, y: 208, r: 22, label: "Warna lentera" },
      { id: "ikan",    x: 252, y: 282, r: 24, label: "Ikan melompat" },
      { id: "bintang", x: 468, y: 58,  r: 18, label: "Bintang hilang" },
      { id: "ranting", x: 516, y: 148, r: 24, label: "Ranting pinus" },
    ],
  },
  {
    id: "pondok",
    name: "Pondok Jamur",
    hint: "Pondok jamur di tengah kabut",
    timeLimit: 105,
    diffs: [
      { id: "asap",    x: 148, y: 62,  r: 26, label: "Asap cerobong" },
      { id: "jendela", x: 282, y: 182, r: 26, label: "Cahaya jendela" },
      { id: "kucing",  x: 382, y: 108, r: 24, label: "Kucing di atap" },
      { id: "jamur",   x: 118, y: 332, r: 22, label: "Jamur kecil" },
      { id: "bunga",   x: 452, y: 322, r: 22, label: "Warna bunga" },
      { id: "pagar",   x: 502, y: 282, r: 24, label: "Papan pagar" },
      { id: "batu",    x: 232, y: 352, r: 22, label: "Batu jalan" },
    ],
  },
  {
    id: "kuil",
    name: "Kuil Batu Lumut",
    hint: "Kuil tua yang ditelan lumut",
    timeLimit: 90,
    diffs: [
      { id: "mata",    x: 202, y: 162, r: 24, label: "Mata patung" },
      { id: "obor",    x: 92,  y: 202, r: 24, label: "Api obor" },
      { id: "sulur",   x: 468, y: 122, r: 24, label: "Sulur tambahan" },
      { id: "mangkuk", x: 332, y: 302, r: 24, label: "Isi mangkuk" },
      { id: "rune",    x: 422, y: 262, r: 22, label: "Cahaya rune" },
      { id: "burung",  x: 282, y: 72,  r: 22, label: "Burung di gapura" },
      { id: "lumut",   x: 152, y: 332, r: 26, label: "Bercak lumut" },
    ],
  },
];

// Bantuan kecil untuk logika game: ambil level berdasarkan indeks,
// dan hitung berapa perbedaan yang belum ditemukan.
export function getLevel(index) {
  return LEVELS[index] || null;
}

export function levelCount() {
  return LEVELS.length;
}

export function diffsPerLevel() {
  return LEVELS[0].diffs.length;
}

