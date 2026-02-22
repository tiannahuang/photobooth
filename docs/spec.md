# Photobooth

> A web app that recreates the vintage LA and Korean-style photobooth experience in your browser.

## Overview

Photobooth is a website where users can take photos that recreate two popular photobooth styles:

1. **Korean-style** (inspired by Life4Cuts, Potobox) — standard frame layouts with multiple photos arranged in themed frames, plus a short video clip of the session
2. **Vintage-style** (inspired by BoothByBryant) — classic photo strip format

Users choose their style, take photos with a countdown timer, customize their frames with colors and themes, and download the results. Everything runs client-side — no accounts, no server storage.

## Target Users

General consumers — anyone who wants the fun photobooth experience from their computer or phone without needing to visit a physical booth.

## Core Features (v1)

### Landing Experience
- Two animated curtains mimicking a real photobooth entrance
- Left curtain: "Korean Photobooth" option
- Right curtain: "Vintage Photobooth" option
- Clicking a curtain triggers a slide-open animation (curtains part like real curtains), revealing the next screen

### Photo Capture
- Webcam-based photo capture (front-facing camera on mobile)
- 3-2-1 countdown timer displayed on screen before each photo
- **Korean mode** — user picks a layout before shooting (visual grid of layout thumbnails):
  - 1 photo (single shot)
  - 4 photos — 2x2 horizontal grid
  - 4 photos — 2x2 vertical grid
  - 4 photos — 1x4 vertical strip
  - 8 photos — 2x4 grid
- **Vintage mode** — 4 photos arranged in a classic vertical strip (no layout selection needed)
- After all photos are taken: option to retake all or keep all (no individual retakes)

### Video Clip (Korean Mode Only)
- During the photo session, record a short video clip of the user taking their photos
- Mimics the authentic Korean photobooth experience (Life4Cuts-style)
- Video is downloadable alongside the final photo

### Frame Customization
- **Korean mode:** Frame templates matching the selected layout
- **Vintage mode:** Classic vertical strip frame
- Frame color picker (choose border/background colors)
- Pre-designed aesthetic themes (curated by the site owner):
  - Minimalist
  - Y2K
  - Coquette
  - Cottagecore
  - Additional themes TBD
- Themes include custom assets: stickers, borders, decorative elements
- AI theme generation — user types a description, AI generates frame decorations (stickers, borders, decorative elements positioned around the photos)

### Export
- Download final photo as image file (PNG/JPEG)
- Download video clip (Korean mode)
- All processing happens client-side — no server storage, no accounts

## Future Features

- **Group/multiplayer mode** — multiple people join the same session remotely
- **More photobooth styles** — Japanese purikura, classic American booth, passport photos, etc.
- **Social sharing** — share directly to Instagram, TikTok, etc.
- **Shareable links** — generate a link so others can view your photo (requires server storage)
- **Admin panel** — manage themes and assets through a UI instead of code

## User Flows

### Flow 1: Korean-Style Photobooth

1. **Landing page** — User sees two curtains
2. **Select Korean** — Clicks "Korean Photobooth" curtain → curtains slide open
3. **Choose layout** — Visual grid of layout thumbnails (1, 2x2 horizontal, 2x2 vertical, 1x4, 2x4)
4. **Camera setup** — Webcam feed appears, user positions themselves
5. **Photo capture** — Countdown 3→2→1 for each photo; video recording runs in the background throughout
6. **Review** — All captured photos displayed; option to "Retake All" or "Keep"
7. **Customize frame** — Choose a theme (pre-designed or AI-generated) and/or pick frame colors
8. **Preview final** — See the final composed image with frame
9. **Download** — Download photo (image) and video clip

### Flow 2: Vintage-Style Photobooth

1. **Landing page** — User sees two curtains
2. **Select Vintage** — Clicks "Vintage Photobooth" curtain → curtains slide open
3. **Camera setup** — Webcam feed appears, user positions themselves
4. **Photo capture** — Countdown 3→2→1 for each of 4 photos
5. **Review** — All 4 photos displayed in strip preview; option to "Retake All" or "Keep"
6. **Customize frame** — Choose a theme (pre-designed or AI-generated) and/or pick frame/strip colors
7. **Preview final** — See the final composed strip with frame
8. **Download** — Download photo strip image

## User Roles & Permissions

No user roles or authentication. The app is fully public with no accounts. Every visitor gets the same experience.

**Site owner (you):** Manages themes and assets by updating the codebase directly. No admin panel needed for v1.

## Data Model

No persistent data model — all data is ephemeral and client-side:

| Data | Type | Lifecycle |
|------|------|-----------|
| Webcam stream | MediaStream | Active during capture |
| Captured photos | Blob/Canvas | In-memory during session |
| Video recording | Blob | In-memory during session (Korean mode) |
| Selected layout | State | In-memory during session |
| Selected theme | State | In-memory during session |
| Frame color | State | In-memory during session |
| Final composed image | Canvas → Blob | Generated on demand for download |

## Pages / Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Two curtains — Korean vs Vintage selection |
| `/korean` | Korean Mode | Layout selection → capture → customize → download |
| `/vintage` | Vintage Mode | Capture → customize → download |

Note: The Korean and Vintage flows may be multi-step within a single route (stepper/wizard pattern) rather than separate routes for each step.

## Integrations

| Service | Purpose | Details |
|---------|---------|---------|
| AI Image Generation API | Generate frame decorations from text prompts | TBD — OpenAI DALL-E, Stability AI, or similar |
| Browser MediaDevices API | Webcam access | `navigator.mediaDevices.getUserMedia()` |
| Browser MediaRecorder API | Video recording (Korean mode) | Records webcam stream during capture |
| Canvas API | Photo composition | Composing photos into frames client-side |

## Design & UX

### Visual Style
- **Clean & modern** — minimal UI, generous whitespace, sleek animations
- Curtain animation should feel tactile and satisfying
- Countdown timer should be large and prominent
- Frame customization UI should be visual (color swatches, theme thumbnails)

### Responsive Design
- **Desktop and mobile equally** — responsive design that works great on both
- Desktop: laptop webcam
- Mobile: front-facing camera
- Layout adapts to screen size

### Aesthetic Themes (v1)
- Minimalist
- Y2K
- Coquette
- Cottagecore
- Owner can add more themes by adding assets to the codebase

### Custom Assets
- Owner-created stickers, borders, and decorative elements
- Stored as static assets in the project
- Used by pre-designed themes

## Non-Functional Requirements

- **Performance:** Photo capture and frame rendering should feel instant. No loading spinners during the core photo flow.
- **Privacy:** No photos or videos are uploaded to any server. All processing is client-side.
- **Browser support:** Modern browsers (Chrome, Safari, Firefox, Edge). Webcam access required.
- **Accessibility:** Keyboard navigable, sufficient color contrast, screen reader labels for key actions.

## Deployment & Infrastructure

- **Hosting:** Vercel (free tier)
- **Domain:** Default Vercel domain (e.g., `photobooth.vercel.app`) for now
- **CI/CD:** Automatic deploys from GitHub via Vercel
- **Environments:** Production only for v1 (add staging later if needed)
- **Server-side requirements:** Minimal — the app is primarily client-side. Only server requirement is the AI API proxy (to keep API keys secret)

## Tech Stack

| Category | Choice | Reasoning |
|----------|--------|-----------|
| Language | TypeScript | Type safety, better DX, industry standard |
| Frontend | Next.js 15 (App Router) | Largest ecosystem, native Vercel integration, great library support for webcam/canvas |
| UI Components | shadcn/ui + Tailwind CSS | Clean minimal aesthetic, full code ownership, accessible Radix primitives |
| Animations | Framer Motion | Declarative API perfect for curtain animations, countdown timers, page transitions |
| AI Generation | TBD (decide after core is built) | Candidates: Runware/FLUX (fastest, cheapest), Leonardo AI, DALL-E 3 |
| Hosting | Vercel (free tier) | Native Next.js support, automatic GitHub deploys |
| Analytics | Vercel Analytics | Free, zero-config, basic page views + web vitals |

### Key Browser APIs Used
- `navigator.mediaDevices.getUserMedia()` — Webcam access
- `MediaRecorder` API — Video recording (Korean mode)
- `Canvas` API — Photo composition into frames
- `URL.createObjectURL()` / `Blob` — Client-side file downloads

### Key Packages
```
next                  - Frontend framework
react / react-dom     - UI library
typescript            - Type safety
tailwindcss           - Utility-first CSS
@radix-ui/*           - Accessible UI primitives (via shadcn/ui)
framer-motion         - Animations
@vercel/analytics     - Analytics
```

### Not Needed for v1
- Database / ORM — no persistent data
- Authentication — no user accounts
- File storage — all client-side
- Payments — free app
- Email — no notifications

## Open Questions

- Which AI image generation API to use for frame decorations?
- Exact list of aesthetic themes and assets for v1?
- Should the video clip have any overlay/branding?
- Domain name?
