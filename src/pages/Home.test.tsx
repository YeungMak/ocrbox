import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/pages/Home";

vi.mock("tesseract.js", () => ({
  createWorker: vi.fn(),
}));

const createSpeechSynthesisMock = () => ({
  cancel: vi.fn(),
  getVoices: vi.fn(() => []),
  pause: vi.fn(),
  resume: vi.fn(),
  speak: vi.fn(),
  speaking: false,
  paused: false,
  pending: false,
  onvoiceschanged: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe("Home", () => {
  beforeEach(() => {
    vi.stubGlobal("speechSynthesis", createSpeechSynthesisMock());
    vi.stubGlobal("FileReader", class {
      onload: ((_e: ProgressEvent<FileReader>) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => {
          this.onload?.({ target: { result: "data:image/png;base64,test" } } as ProgressEvent<FileReader>);
        }, 0);
      }
    });
  });

  it("沒有可用中文語音時會顯示不支援提示並停用播放", () => {
    render(<Home />);

    expect(screen.getByText("目前裝置未提供可用的廣東話或繁體中文語音。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "開始朗讀" })).toBeDisabled();
  });

  it("點擊示例按鈕會帶入預設文字", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "載入示例" }));

    expect(screen.getByLabelText("輸入文字")).toHaveValue(
      "早晨，歡迎使用廣東話文字轉語音示範。希望你今日心情愉快，事事順利。",
    );
  });

  it("會顯示 OCR 圖片轉文字區塊", () => {
    render(<Home />);

    expect(screen.getByText("圖片轉文字")).toBeInTheDocument();
    expect(screen.getByText("點擊或拖放圖片至此，支援 JPG / PNG")).toBeInTheDocument();
  });
});
