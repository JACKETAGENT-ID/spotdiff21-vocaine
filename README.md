# 🌲 Hutan Kabut Senja — Cari Perbedaan

![Kompetisi](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)
![Peringkat](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/JACKETAGENT-ID/spotdiff21-vocaine/rank.svg)
![Hadiah](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/JACKETAGENT-ID/spotdiff21-vocaine/reward.svg)

Entri untuk [kompetisi Best Spot the Difference Game di make.fun](https://make.fun/c/best-spot-the-difference-game-20261121-0451).

Dua gambar hutan yang nyaris sama, berdampingan. Temukan **7 perbedaan** di tiap level
sebelum timer habis — klik perbedaan di gambar mana pun, penanda hijau muncul di keduanya.

## Level

1. **Tepi Danau** (120 dtk) — senja di tepi danau berkabut
2. **Pondok Jamur** (105 dtk) — pondok jamur di tengah kabut
3. **Kuil Batu Lumut** (90 dtk) — kuil tua yang ditelan lumut

Tiap level makin sulit: timer makin pendek, perbedaan makin tersembunyi.

## Cara main

- 🖱 Klik perbedaan di gambar kiri atau kanan
- 💡 Hint (`H`): maks 3 per level, menyorot satu perbedaan yang belum ketemu
- ↻ Ulang (`R`): mulai dari level 1 · `Enter`: mulai dari layar judul
- Bonus waktu +5 poin per detik tersisa di tiap level · klik salah hanya tanda X merah

## Orisinalitas

Semua gambar digambar murni dengan kode canvas (`game/src/scenes.js`) — tanpa aset
eksternal, tanpa meniru game komersial. Bunyi dibuat dengan WebAudio (`game/src/audio.js`),
tanpa file suara. Nama, tempat, dan adegan adalah karangan sendiri.

## Struktur kode

| File | Tugas |
| --- | --- |
| `game/index.html` | Kerangka halaman + HUD + overlay |
| `game/styles.css` | Tema senja berkabut |
| `game/src/differences.js` | Data 3 level × 7 perbedaan (koordinat + label) |
| `game/src/scenes.js` | Pelukis adegan canvas tiap level + tiap perbedaan |
| `game/src/game.js` | Klik, penanda, counter, timer, hint, level, menang/kalah |
| `game/src/audio.js` | Bunyi WebAudio (ketemu, salah, hint, menang, kalah) |
| `game/src/shots.js` | Keadaan deterministik `?shot=start\|play\|almost\|win` |
| `main.ts` | Menyalin `game/` + `screenshots/` ke output, menulis `dossier.json` |
| `serve.ts` | Server statis `game/` di port 8080 |
| `shoot.py` | 4 screenshot Playwright dari `shots.json` |

## Menjalankan

```sh
node serve.ts            # buka http://localhost:8080
python3 shoot.py         # 4 screenshot ke screenshots/
MAKEFUN_OUTPUT_DIR=out node main.ts   # tulis out/dossier.json
```

Game statis tanpa build step: `game/index.html` dimainkan di desktop Chrome
tanpa satu pun permintaan jaringan.

