export type BrowserVoice = {
  name: string;
  lang: string;
  default?: boolean;
  voiceURI: string;
};

const CANTONESE_PATTERNS = ["yue", "zh-hk", "zh_hk", "cantonese"];
const CHINESE_FALLBACK_PATTERNS = ["zh-tw", "zh-hant", "traditional chinese"];

function matchesAnyPattern(value: string, patterns: string[]) {
  const normalizedValue = value.toLowerCase();
  return patterns.some((pattern) => normalizedValue.includes(pattern));
}

function isCantoneseVoice(voice: BrowserVoice) {
  return matchesAnyPattern(`${voice.lang} ${voice.name}`, CANTONESE_PATTERNS);
}

function isChineseFallbackVoice(voice: BrowserVoice) {
  return matchesAnyPattern(`${voice.lang} ${voice.name}`, CHINESE_FALLBACK_PATTERNS);
}

function getVoicePriority(voice: BrowserVoice) {
  if (isCantoneseVoice(voice)) {
    return 0;
  }

  if (isChineseFallbackVoice(voice)) {
    return 1;
  }

  return 2;
}

export function getSupportedVoices<T extends BrowserVoice>(voices: T[]) {
  return voices
    .filter((voice) => getVoicePriority(voice) < 2)
    .sort((left, right) => {
      const priorityDifference = getVoicePriority(left) - getVoicePriority(right);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      if (left.default && !right.default) {
        return -1;
      }

      if (!left.default && right.default) {
        return 1;
      }

      return left.name.localeCompare(right.name);
    });
}

export function pickDefaultVoice<T extends BrowserVoice>(voices: T[]) {
  const cantoneseVoice = voices.find(isCantoneseVoice);

  if (cantoneseVoice) {
    return cantoneseVoice;
  }

  const chineseFallbackVoice = voices.find(isChineseFallbackVoice);
  return chineseFallbackVoice ?? null;
}
