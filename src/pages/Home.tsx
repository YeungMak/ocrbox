import {
  AlertCircle,
  Languages,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

import ControlButton from "@/components/control-button";
import OcrPanel from "@/components/OcrPanel";
import RangeControl from "@/components/range-control";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useTtsStore } from "@/store/use-tts-store";

const statusLabelMap = {
  idle: "待命中",
  speaking: "朗讀中",
  paused: "已暫停",
  stopped: "已停止",
  unsupported: "未支援",
} as const;

export default function Home() {
  const {
    text,
    voices,
    selectedVoiceURI,
    rate,
    pitch,
    volume,
    status,
    hasCantoneseVoice,
    setText,
    fillSampleText,
    clearText,
    setSelectedVoiceURI,
    setRate,
    setPitch,
    setVolume,
  } = useTtsStore((state) => state);
  const { canPlay, handlePause, handlePlay, handleResume, handleStop, selectedVoice } =
    useSpeechSynthesis();

  return (
    <main className="min-h-screen overflow-hidden bg-[#071311] text-zinc-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,230,138,0.16),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(52,211,153,0.2),_transparent_22%),linear-gradient(180deg,_rgba(7,19,17,0.2),_rgba(7,19,17,0.92))]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10 lg:py-12">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-emerald-200/10 bg-white/5 p-8 shadow-[0_24px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-100/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-amber-100">
                <Sparkles className="h-3.5 w-3.5" />
                Cantonese Voice Lab
              </span>
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                狀態：{statusLabelMap[status]}
              </span>
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="font-['Cormorant_Garamond'] text-5xl leading-none text-amber-50 md:text-6xl">
                廣東話文字轉語音
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                把文字即時轉成可播放的粵語語音，適合朗讀預演、配音草稿、教學示範與內容試聽。
                支援手動輸入或上傳圖片 OCR 辨識文字，本版本優先使用你裝置內建的廣東話或香港中文語音，開頁即可試。
              </p>
            </div>

            <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-white/10 bg-black/15 p-5 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">可用語音</p>
                <p className="mt-3 text-2xl font-semibold text-amber-50">{voices.length}</p>
                <p className="mt-1 text-sm text-zinc-400">已過濾出支援粵語或繁中朗讀的語音。</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">語音偏好</p>
                <p className="mt-3 text-2xl font-semibold text-amber-50">
                  {hasCantoneseVoice ? "粵語優先" : "繁中備援"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">有 `yue-HK` 會自動優先選用。</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">目前語音</p>
                <p className="mt-3 text-lg font-semibold text-amber-50">
                  {selectedVoice?.name ?? "等待載入"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{selectedVoice?.lang ?? "尚未找到支援語音"}</p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-emerald-200/10 bg-[#0b1d18]/90 p-8 shadow-[0_24px_120px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 text-amber-100">
              <Languages className="h-5 w-5" />
              <h2 className="text-lg font-semibold">使用提示</h2>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-zinc-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                可透過上方「圖片轉文字」上傳截圖或文件照片，辨識後一鍵帶入文字朗讀。
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                建議使用 Chrome 或 Edge，通常較容易讀取系統已安裝的廣東話語音。
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                第一次播放前請先與頁面互動，例如點一下輸入框或按鈕，避免瀏覽器阻擋發聲。
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                如果未找到粵語語音，可先在系統新增香港中文語音包，再重新整理頁面。
              </li>
            </ul>
          </aside>
        </section>

        <section className="mt-8">
          <OcrPanel />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Text Deck</p>
                <h2 className="mt-2 text-2xl font-semibold text-amber-50">輸入文字</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                {text.trim().length} 字
              </div>
            </div>

            <label className="mt-6 block" htmlFor="tts-text">
              <span className="sr-only">輸入文字</span>
              <textarea
                className="min-h-[320px] w-full rounded-[1.5rem] border border-white/10 bg-[#081613] px-5 py-5 text-base leading-7 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-amber-200/40 focus:ring-2 focus:ring-amber-100/10"
                id="tts-text"
                onChange={(event) => setText(event.target.value)}
                placeholder="輸入想轉成廣東話語音的內容，例如廣告旁白、教學稿、問候語或節目開場白。"
                value={text}
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <ControlButton
                className="bg-amber-100/10 text-amber-50"
                icon={<Sparkles className="h-4 w-4" />}
                onClick={fillSampleText}
              >
                載入示例
              </ControlButton>
              <ControlButton
                className="bg-white/5 text-zinc-100"
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={clearText}
              >
                清空文字
              </ControlButton>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-amber-100">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-xl font-semibold">語音設定</h2>
              </div>

              <div className="mt-6 space-y-6">
                <label className="block space-y-3" htmlFor="voice-select">
                  <span className="text-sm text-zinc-300">可用語音</span>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-[#081613] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200/40"
                    id="voice-select"
                    onChange={(event) => setSelectedVoiceURI(event.target.value)}
                    value={selectedVoiceURI}
                  >
                    {voices.length === 0 ? (
                      <option value="">未找到支援語音</option>
                    ) : (
                      voices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <RangeControl id="rate" label="語速" max={1.6} min={0.7} onChange={setRate} step={0.1} value={rate} />
                <RangeControl id="pitch" label="音高" max={1.6} min={0.6} onChange={setPitch} step={0.1} value={pitch} />
                <RangeControl id="volume" label="音量" max={1} min={0.2} onChange={setVolume} step={0.1} value={volume} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0d201b]/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 text-amber-100">
                <Volume2 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">播放控制</h2>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <ControlButton
                  className="bg-amber-200 text-[#07201a]"
                  disabled={!canPlay}
                  icon={<Play className="h-4 w-4" />}
                  onClick={handlePlay}
                >
                  開始朗讀
                </ControlButton>
                <ControlButton
                  className="bg-white/5 text-zinc-100"
                  disabled={status !== "speaking"}
                  icon={<Pause className="h-4 w-4" />}
                  onClick={handlePause}
                >
                  暫停
                </ControlButton>
                <ControlButton
                  className="bg-white/5 text-zinc-100"
                  disabled={status !== "paused"}
                  icon={<Play className="h-4 w-4" />}
                  onClick={handleResume}
                >
                  繼續
                </ControlButton>
                <ControlButton
                  className="bg-white/5 text-zinc-100"
                  disabled={!selectedVoice}
                  icon={<Square className="h-4 w-4" />}
                  onClick={handleStop}
                >
                  停止
                </ControlButton>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-amber-100/10 bg-black/15 p-5">
                {voices.length === 0 ? (
                  <div className="flex items-start gap-3 text-amber-100">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-6 text-amber-50/90">
                      目前裝置未提供可用的廣東話或繁體中文語音。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-zinc-300">
                    <p>已就緒語音：{selectedVoice?.name ?? "請選擇語音"}</p>
                    <p>朗讀前請確認文字內容與語速設定，支援播放、暫停、續播與停止。</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
