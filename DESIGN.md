# Vaulted — Design Tokens (premium-ui taste-lock)

Direction: **engineered / cryptographic dark.** Near-black canvas, single electric-indigo
accent, restrained motion (beams/grid, no confetti). Reads like a security product, not a toy.
Anchor feel: Linear x Story Foundation.

## Palette (locked — matches tailwind.config.js)
| Token        | Hex       | Use                                   |
|--------------|-----------|---------------------------------------|
| bg           | #0B0D12   | page canvas                           |
| panel        | #14171F   | cards                                 |
| panel2       | #1A1E28   | inputs, raised surfaces               |
| border       | #232733   | hairlines                             |
| ink          | #E6E8EE   | primary text                          |
| muted        | #8A90A2   | secondary text                        |
| brand        | #4F46E5   | the ONLY accent (indigo)              |
| brand-hover  | #4338CA   | accent hover                          |
| ok/danger/warn | #22C55E / #EF4444 / #F59E0B | status only        |

Accent discipline: one indigo. No second hue. Gradients = indigo→transparent only.

## Type
- Display: **Space Grotesk** (headlines) — non-Inter, distinctive.
- Body: Inter.
- Mono: JetBrains Mono (proofs, addresses, the "access denied" tagline).

## Radius / spacing / motion
- Radius: `card` = 10px; buttons/pills = lg (8px). Keep consistent — no mixed radii.
- Motion: subtle, purposeful. Background beams/grid + on-mount fade/slide. Durations 0.4–0.8s.
- BLOCKLIST: purple↔pink gradients, glassmorphism blur cards, emoji bullets, generic
  "AI SaaS" hero blobs, multiple accent colors, default shadcn zinc. (see skill blocklist.md)

## Scope (this pass)
Landing page only: hero (animated bg + existing copy), feature bento, footer polish.
DO NOT touch /app or /s/:uuid logic. Crypto flow is frozen.
