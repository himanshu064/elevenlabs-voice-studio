# ElevenLabs Voice Studio

A focused Next.js demo for the four things that matter in production speech with
[ElevenLabs](https://elevenlabs.io): **voice quality**, **emotion**, **pacing**,
and **latency**. Tune the controls, generate, and watch a live
_time-to-first-audio_ metric.

## What this application does

Voice Studio is a browser-based **text-to-speech workbench**. You type (or load
a preset) some text, choose a model and a voice, shape the delivery with emotion
and pacing controls, and generate spoken audio in real time. As the audio
streams back, the app measures and displays how fast the first byte arrived - so
you can _hear_ and _see_ the trade-offs between different ElevenLabs models.

It's intentionally scoped to demonstrate, hands-on, how each lever affects the
result:

| Concern           | In the UI                                                      | ElevenLabs feature                                              |
| ----------------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| **Voice quality** | Voice picker + model selector                                  | `eleven_multilingual_v2` (fidelity) vs `eleven_v3` (expressive) |
| **Emotion**       | Stability / Similarity / Style sliders, Speaker boost, v3 tags | `voice_settings` + v3 inline audio tags (`[whispers]`)          |
| **Pacing**        | Speed slider + `<break time="1.0s" />` insertion               | `voice_settings.speed` + SSML breaks                            |
| **Latency**       | Model selector + measured **time-to-first-audio**              | `eleven_flash_v2_5` (~75ms) + the streaming endpoint            |

## Features

- **Text-to-speech generation** - synthesize up to 5,000 characters per request,
  with a live character counter.
- **Live model list** - models are fetched from your account at runtime (not
  hardcoded) and merged with curated latency/quality descriptions. Any model
  your account can't use is shown **disabled with an "unavailable" badge**.
- **Live voice list** - the voice dropdown is populated from your account's
  voices, with name, descriptor, and a category badge.
- **Emotion controls** - Stability, Similarity, and Style sliders plus a Speaker
  boost toggle, mapped directly to ElevenLabs `voice_settings`.
- **Pacing controls** - a Speed slider and a one-click **Insert pause** button
  that injects `<break time="1.0s" />` at the cursor.
- **v3 audio tags** - write inline emotion tags such as `[whispers]`,
  `[excited]`, `[laughs]` and hear them interpreted by the expressive model.
- **One-click presets** - ready-made prompts + settings (Neutral narration,
  Excited announcement, Calm & soothing, Dramatic with pauses, Expressive v3)
  that demonstrate each effect instantly.
- **Streaming playback + latency metrics** - audio is streamed and the app
  reports **time to first audio**, total time, audio size, and character count
  after each generation.
- **Built-in audio player** - play/pause, seekable progress, elapsed/total time,
  mute, and **download** of the generated clip.
- **Resilient by design** - the UI renders without an API key (generation
  returns a friendly error), and if the models endpoint fails it falls back to a
  curated list so the studio stays usable.
- **Server-side key** - the ElevenLabs API key never reaches the browser; all
  calls go through Next.js Route Handlers.
- **Polished, responsive dark UI** - built with shadcn/ui + Tailwind CSS v4, with
  a sticky settings panel and a mobile-friendly layout.

## Getting started

### 1. Add your API key

Create `.env.local` in the project root:

```bash
ELEVENLABS_API_KEY=your_key_here
```

Get a key from **elevenlabs.io → Profile → API Keys**. The free tier is enough
to try the demo. The key is only ever read server-side - it never reaches the
browser.

### 2. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The UI renders without a key; generation just
returns a friendly error until the key is present.

## Architecture

The API key stays on the server. The browser talks to three Route Handlers,
which call the ElevenLabs SDK and stream audio back.

```
src/
├─ app/
│  ├─ api/
│  │  ├─ tts/route.ts        # POST → streams synthesized audio (Node runtime)
│  │  ├─ voices/route.ts     # GET  → lists the account's voices (cached 60s)
│  │  └─ models/route.ts     # GET  → lists the account's models (cached 5m)
│  ├─ layout.tsx
│  └─ page.tsx               # app shell; checks for the API key
├─ components/
│  ├─ tts/                   # feature components
│  │  ├─ tts-studio.tsx      # orchestrator: owns form state, composes the rest
│  │  ├─ model-selector.tsx
│  │  ├─ voice-selector.tsx
│  │  ├─ text-panel.tsx
│  │  ├─ preset-list.tsx
│  │  ├─ emotion-controls.tsx
│  │  ├─ pacing-controls.tsx
│  │  ├─ settings-panel.tsx
│  │  ├─ generate-panel.tsx
│  │  └─ metrics-grid.tsx
│  ├─ shared/               # reusable, feature-agnostic UI
│  │  ├─ audio-player.tsx    # play/seek/mute/download, built from shadcn parts
│  │  ├─ labeled-slider.tsx
│  │  ├─ section-heading.tsx
│  │  └─ stat-card.tsx
│  └─ ui/                    # shadcn/ui primitives
├─ hooks/
│  ├─ use-voices.ts          # fetches /api/voices
│  ├─ use-models.ts          # fetches /api/models, merges with curated metadata
│  └─ use-tts.ts             # POST + stream read, TTFB/total timing, URL cleanup
└─ lib/
   ├─ elevenlabs.ts          # server-only SDK client factory
   ├─ constants.ts           # curated models, presets, defaults
   ├─ models.ts              # merge live models with curated metadata
   ├─ types.ts               # shared domain types
   └─ format.ts              # time / bytes formatting helpers
```

**Design notes**

- **Streaming for real latency.** `/api/tts` uses the SDK's streaming endpoint;
  the client reads the response with a `ReadableStream` reader and records the
  timestamp of the first byte, which is what the _time-to-first-audio_ stat
  shows.
- **Logic in hooks, presentation in components.** `use-tts` owns fetching,
  stream reading, timing, and object-URL lifecycle; `use-voices` / `use-models`
  own their fetches; components stay declarative.
- **Dynamic + curated models.** The live `/v1/models` list drives availability,
  while curated metadata supplies the latency/quality badges and blurbs the API
  doesn't provide (see `lib/models.ts`).
- **Server-only key.** `lib/elevenlabs.ts` imports `server-only` so the client
  factory can never be bundled into the browser.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
[shadcn/ui](https://ui.shadcn.com) · [lucide-react](https://lucide.dev) ·
[`@elevenlabs/elevenlabs-js`](https://github.com/elevenlabs/elevenlabs-js)

## Deployment

Deploy to **[Vercel](https://vercel.com)** (or any Node host):

1. Push the repo and import it in Vercel.
2. Add `ELEVENLABS_API_KEY` under **Settings → Environment Variables**
   (Production + Preview).
3. Deploy.

The `/api/tts` route runs on the Node.js runtime (required for audio
streaming), not Edge.

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
