import { useRef } from "react";
import {
  ArrowRight,
  FileImage,
  ImageUp,
  Loader2,
  ScanText,
  Upload,
  X,
} from "lucide-react";

import ControlButton from "@/components/control-button";
import { useOcr } from "@/hooks/use-ocr";
import { useOcrStore, type OcrLang } from "@/store/use-ocr-store";
import { useTtsStore } from "@/store/use-tts-store";

const LANG_OPTIONS: { value: OcrLang; label: string }[] = [
  { value: "chi_tra", label: "繁體中文" },
  { value: "chi_sim", label: "簡體中文" },
  { value: "eng", label: "英文" },
  { value: "chi_tra+eng", label: "繁體中文 + 英文" },
];

export default function OcrPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    imageDataUrl,
    lang,
    status,
    result,
    setImageDataUrl,
    setLang,
    reset,
  } = useOcrStore((state) => state);
  const { startOcr } = useOcr();
  const setText = useTtsStore((state) => state.setText);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const isProcessing = status === "loading" || status === "recognizing";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <ScanText className="h-5 w-5 text-amber-100" />
        <h2 className="text-xl font-semibold text-amber-50">圖片轉文字</h2>
        {imageDataUrl && status === "idle" && (
          <span className="ml-auto rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1 text-xs text-amber-100">
            已載入圖片
          </span>
        )}
        {isProcessing && (
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1 text-xs text-amber-100">
            <Loader2 className="h-3 w-3 animate-spin" />
            {status === "loading" ? "載入語言包" : "辨識中"}
          </span>
        )}
        {status === "done" && (
          <span className="ml-auto rounded-full border border-emerald-200/20 bg-emerald-100/10 px-3 py-1 text-xs text-emerald-100">
            辨識完成
          </span>
        )}
        {status === "error" && (
          <span className="ml-auto rounded-full border border-red-200/20 bg-red-100/10 px-3 py-1 text-xs text-red-100">
            辨識失敗
          </span>
        )}
      </div>

      <div className="mt-5">
        <input
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />

        {!imageDataUrl ? (
          <button
            className="flex w-full flex-col items-center gap-3 rounded-[1.5rem] border-2 border-dashed border-white/15 bg-[#081613] px-6 py-10 text-zinc-400 transition hover:border-amber-200/30 hover:text-amber-100/70"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <ImageUp className="h-10 w-10" />
            <span className="text-sm">點擊或拖放圖片至此，支援 JPG / PNG</span>
          </button>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative shrink-0">
              <img
                alt="上傳預覽"
                className="h-40 w-40 rounded-2xl border border-white/10 object-cover"
                src={imageDataUrl}
              />
              <button
                className="absolute -right-2 -top-2 rounded-full border border-white/10 bg-[#081613] p-1 text-zinc-300 transition hover:text-amber-100"
                onClick={() => reset()}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="rounded-2xl border border-white/10 bg-[#081613] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200/40"
                  disabled={isProcessing}
                  onChange={(e) => setLang(e.target.value as OcrLang)}
                  value={lang}
                >
                  {LANG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <ControlButton
                  className="bg-amber-200 text-[#07201a]"
                  disabled={isProcessing}
                  icon={isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanText className="h-4 w-4" />}
                  onClick={startOcr}
                >
                  {isProcessing ? "辨識中..." : "開始辨識"}
                </ControlButton>

                <ControlButton
                  className="bg-white/5 text-zinc-100"
                  disabled={isProcessing}
                  icon={<Upload className="h-4 w-4" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  重新上傳
                </ControlButton>
              </div>

              {status === "done" && (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="min-h-[80px] w-full rounded-[1.25rem] border border-white/10 bg-[#081613] px-4 py-3 text-sm leading-6 text-zinc-100 outline-none"
                    readOnly
                    value={result}
                  />
                  <div className="flex flex-wrap gap-2">
                    <ControlButton
                      className="bg-emerald-100/10 text-emerald-50"
                      disabled={!result.trim()}
                      icon={<ArrowRight className="h-4 w-4" />}
                      onClick={() => setText(result)}
                    >
                      帶入文字轉語音
                    </ControlButton>
                    <ControlButton
                      className="bg-white/5 text-zinc-100"
                      icon={<FileImage className="h-4 w-4" />}
                      onClick={() => reset()}
                    >
                      清除圖片
                    </ControlButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
