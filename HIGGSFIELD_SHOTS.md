# Higgsfield image list

> **Status:** all 18 slots currently use images rendered locally by the render studio (see README → Render studio). These prompts are kept so any slot can be upgraded later with a Higgsfield image or a real photograph: save it under the same file name in `public/shots/`.

The site is built around **18 photography slots**. Until a slot has an image it shows a quiet placeholder marked `[ADD: Higgsfield shot · …]`. The source of truth is `data/shots.ts`; this file is generated from it.

**Why the connector can't do this for you:** the Higgsfield connector in this workspace is read-only. It can list generations already in your account, but it cannot create new ones, and the account currently has 0 credits. Generate the images on higgsfield.ai, and I'll pull them in through the connector.

## How to hand the images over

1. Top up Higgsfield credits and generate each image below on higgsfield.ai (an image model such as Soul, Nano Banana or Seedream works well). Use the aspect ratio shown.
2. For consistent sets, generate **room-on** from **room-off** as the reference image, and generate the five other finishes from the **finish-matte-white** image as the reference.
3. Tell me when they're done. I'll list your generations through the connector, download the ones you pick into `public/shots/` with the file names below, and switch each slot on in `data/shots.ts`.
4. Or do it by hand: save each image as `public/shots/<file name>` (WebP or JPG, about 2400 px on the long side for 16:9, 1600 px for the others, under 600 KB), then set `src: "/shots/<file name>"` for that entry in `data/shots.ts`.

**Rules for every image:** no brand logos, no readable text, no people, generic unbranded fittings, graphite / black / silver palette, no gold or orange cast.

## Images (priority order: 1–3 first, then 4–9)

### 1. `hero-plate.webp` (16/9)
A graphite modular switch plate on a dark plaster wall, lit by a single soft light.

> A single graphite-grey six-module modular switch plate mounted on a dark charcoal plaster wall, one soft light grazing from the upper left revealing the wall texture, the plate perfectly centred, lots of negative space, cinematic. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 2. `room-off.webp` (16/9)
A modern living room at night with the lights off.

> Modern minimalist living room at night, all lights off, only faint blue moonlight through a large window, low sofa, plain plaster walls, gypsum false ceiling with a hidden cove, locked-off wide shot at eye level. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 3. `room-on.webp` (16/9)
The same living room with cove lighting and downlights switched on.

> Exactly the same room, framing and camera as the previous image, now with the lights on: soft neutral-white 3500 K cove light glowing from the ceiling edge, three recessed downlights washing the wall, calm and premium, no orange cast. Use the previous image as the reference. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 4. `finish-matte-white.webp` (1/1)
Matte white modular switch plate.

> Front view of a four-module modular switch plate in matte white, centred on a seamless black background, soft top light, subtle reflection below. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 5. `finish-charcoal.webp` (1/1)
Charcoal modular switch plate.

> Same framing as the matte white plate: a four-module modular switch plate in charcoal grey, seamless black background, soft top light. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 6. `finish-champagne-gold.webp` (1/1)
Champagne metal modular switch plate.

> Same framing: a four-module modular switch plate in a soft brushed champagne metal finish, restrained and pale, seamless black background, soft top light. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 7. `finish-walnut.webp` (1/1)
Walnut wood modular switch plate.

> Same framing: a four-module modular switch plate in dark walnut wood veneer with white switch modules, seamless black background, soft top light. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 8. `finish-black.webp` (1/1)
Gloss black glass modular switch plate.

> Same framing: a four-module modular switch plate in gloss black glass, a single long highlight across the glass, seamless black background. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 9. `finish-silver.webp` (1/1)
Brushed silver modular switch plate.

> Same framing: a four-module modular switch plate in brushed silver aluminium, seamless black background, soft top light. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 10. `line-switches.webp` (4/3)
Modular switches and sockets.

> Three modular switch plates of different sizes arranged at angles on a matte black surface, graphite and white finishes, top-down three-quarter view. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 11. `line-lighting.webp` (4/3)
Recessed downlight and LED profile light.

> A slim recessed LED downlight and a black aluminium LED profile light, both lit with neutral-white light, floating on a black background with a soft glow. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 12. `line-wires.webp` (4/3)
Coils of house wire.

> Neat coils of unbranded house wire in red, black, blue and grey, stacked on a dark graphite surface, side light catching the insulation. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 13. `line-fans.webp` (4/3)
Ceiling fan from below.

> A minimal matte black ceiling fan photographed from directly below against a dark ceiling, motion-free, symmetrical. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 14. `line-smart.webp` (4/3)
Smart glass touch switch.

> A black glass smart touch switch panel on a dark wall, two softly glowing white touch indicators, close three-quarter view. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 15. `film-plan.webp` (4/5)
An electrical layout drawing on a dark desk.

> Top-down view of an architectural electrical layout drawing on a dark desk, a silver pen beside it, switch and light symbols visible but no readable text, single soft desk light. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 16. `film-wire.webp` (4/5)
Conduits and wires running through an unfinished wall.

> Unfinished grey wall with neatly chased channels holding grey conduit pipes and red, black and blue wires, raking side light, clean construction detail. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 17. `film-protect.webp` (4/5)
A distribution board with a row of MCBs.

> Close-up of a clean distribution board with a neat row of plain white miniature circuit breakers, one small green indicator lit, dark surroundings, no brand marks. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

### 18. `film-finish.webp` (4/5)
A finished switch plate on a painted wall with soft light.

> A finished graphite modular switch plate on a smooth painted wall, soft neutral light from a wall washer above, calm and complete. Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.

## Optional: hero video

If you later make a short Higgsfield video of the hero (a slow push-in on the switch plate, 6–8 s, 16:9, no audio, under 6 MB), save it as `public/video/hero.mp4` and set `heroVideo: "/video/hero.mp4"` in `data/config.ts`.
