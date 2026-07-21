import { create } from "zustand";

export type PlaybackStatus = "idle" | "speaking" | "paused" | "stopped" | "unsupported";

export const SAMPLE_TEXT =
  "早晨，歡迎使用廣東話文字轉語音示範。希望你今日心情愉快，事事順利。";

type TtsStore = {
  text: string;
  selectedVoiceURI: string;
  rate: number;
  pitch: number;
  volume: number;
  status: PlaybackStatus;
  voices: SpeechSynthesisVoice[];
  hasCantoneseVoice: boolean;
  setText: (text: string) => void;
  fillSampleText: () => void;
  clearText: () => void;
  setSelectedVoiceURI: (voiceURI: string) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  setStatus: (status: PlaybackStatus) => void;
  setVoices: (
    voices: SpeechSynthesisVoice[],
    selectedVoiceURI: string,
    hasCantoneseVoice: boolean,
  ) => void;
};

export const useTtsStore = create<TtsStore>((set) => ({
  text: "",
  selectedVoiceURI: "",
  rate: 1,
  pitch: 1,
  volume: 1,
  status: "idle",
  voices: [],
  hasCantoneseVoice: false,
  setText: (text) => set({ text }),
  fillSampleText: () => set({ text: SAMPLE_TEXT }),
  clearText: () => set({ text: "" }),
  setSelectedVoiceURI: (selectedVoiceURI) => set({ selectedVoiceURI }),
  setRate: (rate) => set({ rate }),
  setPitch: (pitch) => set({ pitch }),
  setVolume: (volume) => set({ volume }),
  setStatus: (status) => set({ status }),
  setVoices: (voices, selectedVoiceURI, hasCantoneseVoice) =>
    set((state) => ({
      voices,
      hasCantoneseVoice,
      selectedVoiceURI: selectedVoiceURI || state.selectedVoiceURI || voices[0]?.voiceURI || "",
      status: voices.length === 0 ? "unsupported" : state.status === "unsupported" ? "idle" : state.status,
    })),
}));
