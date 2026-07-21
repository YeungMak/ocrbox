import { useEffect, useMemo, useRef } from "react";

import { useTtsStore } from "@/store/use-tts-store";
import { getSupportedVoices, pickDefaultVoice } from "@/utils/voice-selection";

export function useSpeechSynthesis() {
  const {
    text,
    rate,
    pitch,
    volume,
    selectedVoiceURI,
    setVoices,
    setStatus,
    voices,
  } = useTtsStore((state) => state);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoices([], "", false);
      setStatus("unsupported");
      return undefined;
    }

    const speechSynthesisApi = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = getSupportedVoices(speechSynthesisApi.getVoices());
      const defaultVoice = pickDefaultVoice(availableVoices);
      const hasCantoneseVoice = availableVoices.some((voice) => voice.lang.toLowerCase().includes("yue"));

      setVoices(availableVoices, defaultVoice?.voiceURI ?? "", hasCantoneseVoice);
    };

    loadVoices();

    speechSynthesisApi.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesisApi.removeEventListener("voiceschanged", loadVoices);
    };
  }, [setStatus, setVoices]);

  const selectedVoice = useMemo(
    () => voices.find((voice) => voice.voiceURI === selectedVoiceURI) ?? null,
    [selectedVoiceURI, voices],
  );

  const canPlay = Boolean(text.trim()) && Boolean(selectedVoice);

  const handlePlay = () => {
    if (!canPlay || typeof window === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }

    const speechSynthesisApi = window.speechSynthesis;
    speechSynthesisApi.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.onstart = () => setStatus("speaking");
    utterance.onpause = () => setStatus("paused");
    utterance.onresume = () => setStatus("speaking");
    utterance.onend = () => setStatus("stopped");
    utterance.onerror = () => setStatus("stopped");

    utteranceRef.current = utterance;
    speechSynthesisApi.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const handleResume = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.speechSynthesis.resume();
    setStatus("speaking");
  };

  const handleStop = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus("stopped");
  };

  return {
    canPlay,
    handlePause,
    handlePlay,
    handleResume,
    handleStop,
    selectedVoice,
  };
}
