import { describe, expect, it } from "vitest";

import { pickDefaultVoice } from "@/utils/voice-selection";

type MockVoice = {
  name: string;
  lang: string;
  default?: boolean;
  voiceURI: string;
};

describe("pickDefaultVoice", () => {
  it("會優先選擇粵語語音", () => {
    const voices: MockVoice[] = [
      { name: "English Voice", lang: "en-US", voiceURI: "en-us" },
      { name: "Cantonese Voice", lang: "yue-HK", voiceURI: "yue-hk" },
      { name: "Mandarin Voice", lang: "zh-CN", voiceURI: "zh-cn" },
    ];

    expect(pickDefaultVoice(voices)?.voiceURI).toBe("yue-hk");
  });

  it("沒有粵語語音時會退回香港中文語音", () => {
    const voices: MockVoice[] = [
      { name: "Taiwanese Mandarin", lang: "zh-TW", voiceURI: "zh-tw" },
      { name: "Hong Kong Chinese", lang: "zh-HK", voiceURI: "zh-hk" },
    ];

    expect(pickDefaultVoice(voices)?.voiceURI).toBe("zh-hk");
  });

  it("完全沒有中文語音時回傳空值", () => {
    const voices: MockVoice[] = [
      { name: "English Voice", lang: "en-US", voiceURI: "en-us" },
    ];

    expect(pickDefaultVoice(voices)).toBeNull();
  });
});
