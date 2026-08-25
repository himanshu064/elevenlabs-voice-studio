import { AudioLines, TriangleAlert } from "lucide-react";
import { TtsStudio } from "@/components/tts/tts-studio";
import { hasApiKey } from "@/lib/elevenlabs";

export default function Home() {
  const apiKeyConfigured = hasApiKey();

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      {/* Subtle branded glow for depth on the dark canvas. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(139,92,246,0.14),transparent_70%)]"
      />

      {/* App bar */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-sky-500 text-white shadow-md shadow-violet-500/25">
              <AudioLines className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Voice Studio
            </span>
          </div>
          <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] text-muted-foreground">
            Powered by ElevenLabs
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            ElevenLabs Voice Studio
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A focused demo for the four things that matter in production speech:{" "}
            <strong className="font-medium text-foreground">
              voice quality
            </strong>
            , <strong className="font-medium text-foreground">emotion</strong>,{" "}
            <strong className="font-medium text-foreground">pacing</strong>, and{" "}
            <strong className="font-medium text-foreground">latency</strong>.
            Tune the controls, generate, and watch the time-to-first-audio
            metric.
          </p>
        </div>

        {!apiKeyConfigured && (
          <div className="mb-8 flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-300">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>
              <strong>No API key detected.</strong> Add{" "}
              <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-xs">
                ELEVENLABS_API_KEY
              </code>{" "}
              to <code>.env.local</code> and restart the dev server. The UI works
              without it - generation will just return an error.
            </span>
          </div>
        )}

        <TtsStudio />
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          Built with Next.js, shadcn/ui, and the ElevenLabs JS SDK. The API key
          stays server-side; audio is streamed through a Route Handler.
        </div>
      </footer>
    </div>
  );
}
