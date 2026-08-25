"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_VOICE_SETTINGS,
  MAX_TEXT_LENGTH,
} from "@/lib/constants";
import type { Preset, VoiceSettings } from "@/lib/types";
import { useVoices } from "@/hooks/use-voices";
import { useModels } from "@/hooks/use-models";
import { useTts } from "@/hooks/use-tts";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModelSelector } from "@/components/tts/model-selector";
import { TextPanel } from "@/components/tts/text-panel";
import { PresetList } from "@/components/tts/preset-list";
import { GeneratePanel } from "@/components/tts/generate-panel";
import { SettingsPanel } from "@/components/tts/settings-panel";

const INITIAL_TEXT =
  "Welcome to the ElevenLabs voice studio. Adjust the emotion, pacing, and latency controls, then press generate to hear the difference.";

/**
 * Top-level orchestrator for the TTS studio. Owns the "form" state (text,
 * model, voice, settings) and composes the feature components. All async work
 * lives in the `useVoices` / `useTts` hooks.
 */
export function TtsStudio() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [voiceId, setVoiceId] = useState("");
  const [settings, setSettings] = useState<VoiceSettings>(
    DEFAULT_VOICE_SETTINGS
  );

  const { voices, loading: voicesLoading, error: voicesError } = useVoices();
  const { models, loading: modelsLoading } = useModels();
  const { generate, loading, error, audioUrl, metrics } = useTts();

  // Fall back to the first available voice until the user picks one - derived
  // rather than synced via an effect.
  const effectiveVoiceId = voiceId || voices[0]?.voiceId || "";

  const updateSetting = useCallback(
    <K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const applyPreset = useCallback((preset: Preset) => {
    setText(preset.text);
    setSettings({ ...DEFAULT_VOICE_SETTINGS, ...preset.settings });
    if (preset.modelId) setModelId(preset.modelId);
  }, []);

  const resetSettings = useCallback(
    () => setSettings(DEFAULT_VOICE_SETTINGS),
    []
  );

  const handleGenerate = useCallback(() => {
    generate({ text, voiceId: effectiveVoiceId, modelId, voiceSettings: settings });
  }, [generate, text, effectiveVoiceId, modelId, settings]);

  const isExpressiveModel = useMemo(
    () => models.find((m) => m.id === modelId)?.expressive ?? false,
    [models, modelId]
  );

  return (
    <div className="flex flex-col gap-8">
      <ModelSelector
        models={models}
        value={modelId}
        onChange={setModelId}
        loading={modelsLoading}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Composer: text → presets → generate/result, one cohesive panel. */}
        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <TextPanel
              value={text}
              onChange={setText}
              maxLength={MAX_TEXT_LENGTH}
            />
            <Separator />
            <PresetList onSelect={applyPreset} />
            <Separator />
            <GeneratePanel
              onGenerate={handleGenerate}
              disabled={!text.trim()}
              loading={loading}
              error={error}
              audioUrl={audioUrl}
              metrics={metrics}
            />
          </CardContent>
        </Card>

        <SettingsPanel
          voices={voices}
          voicesLoading={voicesLoading}
          voicesError={voicesError}
          voiceId={effectiveVoiceId}
          onVoiceChange={setVoiceId}
          settings={settings}
          onSettingChange={updateSetting}
          onReset={resetSettings}
          isExpressiveModel={isExpressiveModel}
        />
      </div>
    </div>
  );
}
