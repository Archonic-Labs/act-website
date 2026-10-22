"""Renders every page in headless Chromium and checks the dot matrix: within each 2px cell only
one pixel position may differ from the white gap, so every dot is the same size on one grid,
and that dot must be darker on text than on empty page.

Run: python3 tests/check_dots.py (serves the repository on a free port itself)."""
import functools
import http.server
import pathlib
import subprocess
import sys
import tempfile
import threading

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ["index.html", "support.html", "privacy.html", "terms.html", "404.html"]
PITCH = 2


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    handler.log_message = lambda *args: None
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def shoot(url, out):
    subprocess.run(
        ["chromium", "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", "--window-size=1280,900", f"--screenshot={out}", url],
        check=True, capture_output=True, timeout=60,
    )
    return Image.open(out).convert("L")


def check(page, image):
    width, height = image.size
    pixels = image.load()
    # Find the dot phase from the first cell that is not white.
    offsets = {}
    for y in range(0, height - PITCH, PITCH):
        for x in range(0, width - PITCH, PITCH):
            for dy in range(PITCH):
                for dx in range(PITCH):
                    if pixels[x + dx, y + dy] < 255:
                        offsets[(dx, dy)] = offsets.get((dx, dy), 0) + 1
    assert offsets, f"{page}: no dots rendered"
    dot = max(offsets, key=offsets.get)
    stray = 0
    tones = set()
    for y in range(dot[1], height, PITCH):
        for x in range(dot[0], width, PITCH):
            tones.add(pixels[x, y])
            for dy in range(PITCH):
                for dx in range(PITCH):
                    if (dx or dy) and x + dx < width and y + dy < height and pixels[x + dx, y + dy] != 255:
                        stray += 1
    total = width * height
    assert stray / total < 0.001, f"{page}: {stray} pixels outside the dot grid"
    assert max(tones) <= 230, f"{page}: dots lighter than the base tone ({max(tones)})"
    assert min(tones) <= 120, f"{page}: no dark dots, so no visible text"
    print(f"ok {page}: dot phase {dot}, tones {min(tones)}-{max(tones)}, stray pixels {stray}")


def main():
    server = serve()
    port = server.server_address[1]
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        for page in PAGES:
            try:
                check(page, shoot(f"http://127.0.0.1:{port}/{page}", f"{tmp}/{page}.png"))
            except AssertionError as error:
                failures += 1
                print(f"FAIL {error}")
    server.shutdown()
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
