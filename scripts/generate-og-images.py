#!/usr/bin/env python3
"""Generates a social card per project from its Markdown frontmatter.

Every project link used to unfurl with the same generic card. These carry the
project's own title, role, outcome numbers and stack, so a link pasted into
LinkedIn says what it is.

Run after adding or renaming a project:  python3 scripts/generate-og-images.py
"""
from __future__ import annotations

import io
import os
import re
import sys
from pathlib import Path

import yaml
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src/content/projects"
FONTS = ROOT / "static/fonts"
OUT = ROOT / "static/og"

W, H = 1200, 630
BG = (10, 12, 10)
INK = (233, 238, 227)
INK_2 = (168, 176, 162)
DIM = (115, 123, 110)
ACCENT = (169, 207, 159)
LINE = (32, 38, 30)

TRACK_STYLE = {
    "production": ("PRODUCTION", (144, 212, 168)),
    "in-progress": ("IN DEVELOPMENT", (240, 208, 140)),
    "lab": ("LAB", ACCENT),
    "archive": ("ARCHIVE", DIM),
}


def load_font(filename: str, weight: int | None, size: int) -> ImageFont.FreeTypeFont:
    """Loads a woff2 from the site's own fonts, instancing variable ones."""
    font = TTFont(FONTS / filename)
    font.flavor = None
    if weight is not None and "fvar" in font:
        instancer.instantiateVariableFont(font, {"wght": weight}, inplace=True)
    buf = io.BytesIO()
    font.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


def frontmatter(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    return yaml.safe_load(match.group(1)) if match else None


def wrap(draw, text, font, max_width) -> list[str]:
    words, lines, current = text.split(), [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width or not current:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def pill(draw, x, y, label, font, colour, tint):
    pad_x, pad_y = 14, 8
    w = draw.textlength(label, font=font) + pad_x * 2
    h = font.size + pad_y * 2
    draw.rounded_rectangle([x, y, x + w, y + h], radius=int(h / 2), fill=tint)
    draw.text((x + pad_x, y + pad_y - 1), label, font=font, fill=colour)
    return x + w


def tint_of(colour, alpha=0.16):
    return tuple(round(c * alpha + b * (1 - alpha)) for c, b in zip(colour, BG))


def render(meta: dict) -> Image.Image:
    f_title = load_font("BagelFatOne.woff2", None, 74)
    f_title_sm = load_font("BagelFatOne.woff2", None, 56)
    f_meta = load_font("JetBrainsMono-Variable.woff2", 500, 21)
    f_label = load_font("JetBrainsMono-Variable.woff2", 600, 15)
    f_value = load_font("JetBrainsMono-Variable.woff2", 700, 40)
    f_chip = load_font("JetBrainsMono-Variable.woff2", 500, 18)
    f_badge = load_font("JetBrainsMono-Variable.woff2", 600, 16)

    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)

    # Dot grid, fading to the right so it never competes with the text.
    for gy in range(0, H, 26):
        for gx in range(0, W, 26):
            fade = max(0.0, 1 - gx / (W * 0.9))
            v = tuple(round(b + (ACCENT[i] - b) * 0.16 * fade) for i, b in enumerate(BG))
            d.point((gx, gy), v)

    margin = 72
    y = margin

    label, colour = TRACK_STYLE.get(meta.get("track", "production"), TRACK_STYLE["production"])
    if meta.get("progress"):
        label = str(meta["progress"]).upper()
    pill(d, margin, y, label, f_badge, colour, tint_of(colour))
    y += 62

    title = str(meta.get("title", ""))
    font = f_title if len(title) <= 26 else f_title_sm
    lines = wrap(d, title, font, W - margin * 2)[:2]
    for line in lines:
        d.text((margin, y), line, font=font, fill=INK)
        y += int(font.size * 1.06)
    y += 16

    role = str(meta.get("role", ""))
    period = str(meta.get("period", ""))
    sub = f"{role}  ·  {period}" if role and period else role or period
    for line in wrap(d, sub, f_meta, W - margin * 2)[:2]:
        d.text((margin, y), line, font=f_meta, fill=DIM)
        y += 30

    metrics = meta.get("metrics") or []
    if metrics:
        y = H - margin - 168
        x = margin
        for metric in metrics[:3]:
            value = str(metric.get("value", ""))
            mlabel = str(metric.get("label", "")).upper()
            d.text((x, y), value, font=f_value, fill=ACCENT)
            d.text((x, y + 48), mlabel, font=f_label, fill=DIM)
            x += max(
                d.textlength(value, font=f_value), d.textlength(mlabel, font=f_label)
            ) + 56

    stack = meta.get("stack") or []
    if stack:
        x, y = margin, H - margin - 74
        for tech in stack:
            w = d.textlength(tech, font=f_chip) + 26
            if x + w > W - margin:
                break
            d.rounded_rectangle([x, y, x + w, y + 38], radius=19, outline=LINE, width=2)
            d.text((x + 13, y + 9), tech, font=f_chip, fill=INK_2)
            x += w + 10

    footer = "omerekmen.com"
    d.text(
        (W - margin - d.textlength(footer, font=f_meta), H - margin - 8),
        footer,
        font=f_meta,
        fill=DIM,
    )
    d.line([(0, H - 6), (W, H - 6)], fill=ACCENT, width=6)
    return im


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    # Only the base (English) file — one card per project, not per locale.
    files = sorted(p for p in CONTENT.glob("*.md") if not re.search(r"\.[a-z]{2}\.md$", p.name))
    if not files:
        print("No project files found.", file=sys.stderr)
        return 1

    for path in files:
        meta = frontmatter(path)
        if not meta:
            print(f"  skipped {path.name}: no frontmatter", file=sys.stderr)
            continue
        slug = meta.get("slug") or path.stem
        out = OUT / f"{slug}.jpg"
        render(meta).save(out, quality=88, optimize=True, progressive=True)
        print(f"  {slug:32s} {os.path.getsize(out) / 1024:5.1f} KB")

    print(f"\n{len(files)} social cards written to static/og/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
