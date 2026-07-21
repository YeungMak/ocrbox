import { useCallback } from "react";
import { createWorker } from "tesseract.js";

import { useOcrStore } from "@/store/use-ocr-store";

export function useOcr() {
  const { imageDataUrl, lang, setStatus, setProgress, setResult } = useOcrStore(
    (state) => state,
  );

  const startOcr = useCallback(async () => {
    if (!imageDataUrl) return;

    setStatus("loading");
    setProgress(0);

    try {
      const worker = await createWorker(lang);
      setStatus("recognizing");

      const { data } = await worker.recognize(imageDataUrl);
      setResult(data.text);
      setStatus("done");

      await worker.terminate();
    } catch {
      setStatus("error");
    }
  }, [imageDataUrl, lang, setProgress, setResult, setStatus]);

  return { startOcr };
}
