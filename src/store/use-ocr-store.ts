import { create } from "zustand";

export type OcrLang = "chi_tra" | "chi_sim" | "eng" | "chi_tra+eng";

export type OcrStatus = "idle" | "loading" | "recognizing" | "done" | "error";

type OcrStore = {
  imageDataUrl: string;
  lang: OcrLang;
  status: OcrStatus;
  progress: number;
  result: string;
  setImageDataUrl: (url: string) => void;
  setLang: (lang: OcrLang) => void;
  setStatus: (status: OcrStatus) => void;
  setProgress: (progress: number) => void;
  setResult: (result: string) => void;
  reset: () => void;
};

const initial = {
  imageDataUrl: "",
  lang: "chi_tra" as OcrLang,
  status: "idle" as OcrStatus,
  progress: 0,
  result: "",
};

export const useOcrStore = create<OcrStore>((set) => ({
  ...initial,
  setImageDataUrl: (imageDataUrl) => set({ imageDataUrl }),
  setLang: (lang) => set({ lang }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result }),
  reset: () => set(initial),
}));
