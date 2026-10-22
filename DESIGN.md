# Actually — dot-matrix site

Audience: iPhone users curious about the app; the site is a calling card, not a manual.
Mood: printed halftone, a newspaper wire photo, quiet and mechanical.
Direction: the entire site is one uniform grid of tiny dots. Nothing is drawn outside the grid;
every text, line and element is just the same dots, rendered darker.

## The grid (dots.css, loaded last on every page)
- Pitch 2px, one 1px dot per cell, one grid across the whole document (mask on `body`).
- Gaps between dots: `#ffffff` (the `html` background). Nothing else ever shows in the gaps.
- Empty page dot: `--dot-base` `#dedede`. Nothing on the page may be lighter than this, so
  white surfaces are remapped to the base and images are multiplied onto it.

## Palette (dot tones only, greyscale)
- Ink (text, primary elements): `#111111`
- Muted text: `#555555`; faint text: `#777777`
- Surfaces/cards: `#c9c9c9`; raised: `#bdbdbd`; lines: `rgba(0,0,0,.2)`
- Status colours collapse to tone: success `#333333`, warning `#444444`, danger `#222222`

## Type
- Existing families stay (Arial on the landing page, DM Sans/Syne on document pages).
- Weights are nudged up one step so letters stay legible at 2px dot resolution.

## Components
- Buttons and links: dark dots; hover changes tone, never adds a colour.
- Cards and panels: a mid-tone dot field, no shadows outside the grid.
- Rules and borders: at least 1px so they still catch a row of dots.

## Avoid
- Any colour hue, gradients that read as glow, or anything lighter than the base dot.
- Elements that sit outside the mask (the grid must never break).
