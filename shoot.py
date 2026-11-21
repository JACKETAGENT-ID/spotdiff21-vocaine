#!/usr/bin/env python3
"""shoot.py — memotret 4 screenshot game dari shots.json.

Memakai Playwright sync API dengan Chromium yang sudah terpasang di
~/.cache/ms-playwright/chromium-1148. Viewport 1280x720, menunggu
window.__shotReady, menyimpan JPEG kualitas 85 ke screenshots/.

Gagal (exit != 0) bila ada pageerror atau respons HTTP >= 400
(selain favicon). Jalankan server dulu:  node serve.ts
Lalu:  python3 shoot.py
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
CHROME = Path.home() / ".cache/ms-playwright/chromium-1148/chrome-linux/chrome"
OUT = HERE / "screenshots"


def main() -> int:
    shots = json.loads((HERE / "shots.json").read_text())["shots"]
    OUT.mkdir(parents=True, exist_ok=True)
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=str(CHROME), args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))

        def on_response(resp):
            if resp.status >= 400 and "favicon" not in resp.url:
                errors.append(f"HTTP {resp.status}: {resp.url}")

        page.on("response", on_response)
        for shot in shots:
            page.goto(shot["url"], wait_until="load")
            try:
                page.wait_for_function("window.__shotReady === true", timeout=10000)
            except Exception as e:
                errors.append(f"{shot['file']}: __shotReady tak muncul: {e}")
                continue
            page.wait_for_timeout(400)
            dest = OUT / shot["file"]
            page.screenshot(path=str(dest), type="jpeg", quality=85)
            size = dest.stat().st_size
            print(f"shot {shot['file']} ok ({size} byte)")
            if size > 262144:
                errors.append(f"{shot['file']}: {size} byte > batas 256 KiB")
        browser.close()
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
