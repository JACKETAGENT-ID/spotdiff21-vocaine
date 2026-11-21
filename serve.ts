// serve.ts — server statis kecil untuk memainkan game/ di http://localhost:8080.
// Tanpa dependensi: hanya stdlib Node. Jalankan:  node serve.ts

import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 8080;
const GAME_DIR = join(fileURLToPath(new URL(".", import.meta.url)), "game");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const server = createServer((req, res) => {
  // Hanya GET/HEAD yang dilayani; sisanya ditolak.
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "content-type": "text/plain" });
    res.end("method not allowed");
    return;
  }
  const urlPath = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
  // Tolak path yang mencoba keluar dari game/.
  const file = normalize(join(GAME_DIR, urlPath === "/" ? "index.html" : urlPath));
  if (!file.startsWith(GAME_DIR) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  if (req.method === "GET") createReadStream(file).pipe(res);
  else res.end();
});

server.listen(PORT, () => {
  console.log(`Hutan Kabut Senja: http://localhost:${PORT}/`);
});
