import { converter, formatHex, inGamut, parse } from "culori";

import { NeutralBasePreference, ScaleStep } from "@/types/design-system";

const toOklch = converter("oklch");

const STEP_LIGHTNESS_MAP: Record<ScaleStep, number> = {
  "50": 0.97,
  "100": 0.94,
  "200": 0.89,
  "300": 0.82,
  "400": 0.74,
  "500": 0.64,
  "600": 0.56,
  "700": 0.47,
  "800": 0.39,
  "900": 0.31,
  "950": 0.23,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function preserveGamut(lightness: number, chroma: number, hue: number) {
  let currentChroma = chroma;

  while (currentChroma > 0) {
    const candidate = { mode: "oklch" as const, l: lightness, c: currentChroma, h: hue };

    if (inGamut("rgb")(candidate)) {
      return formatHex(candidate);
    }

    currentChroma -= 0.01;
  }

  return formatHex({ mode: "oklch", l: lightness, c: 0, h: hue });
}

export function isValidHex(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function normalizeHex(value: string, fallback: string) {
  return isValidHex(value) ? formatHex(value) : fallback;
}

export function makeScaleFromAnchor(anchorHex: string, neutral = false) {
  const parsed = parse(anchorHex);
  const converted = parsed ? toOklch(parsed) : toOklch("#7c5cff");
  const baseHue = converted?.h ?? 260;
  const baseChroma = converted?.c ?? 0.16;

  return {
    "50": preserveGamut(STEP_LIGHTNESS_MAP["50"], neutral ? 0.01 : clamp(baseChroma * 0.16, 0.012, 0.05), baseHue),
    "100": preserveGamut(STEP_LIGHTNESS_MAP["100"], neutral ? 0.013 : clamp(baseChroma * 0.22, 0.014, 0.07), baseHue),
    "200": preserveGamut(STEP_LIGHTNESS_MAP["200"], neutral ? 0.016 : clamp(baseChroma * 0.32, 0.018, 0.11), baseHue),
    "300": preserveGamut(STEP_LIGHTNESS_MAP["300"], neutral ? 0.019 : clamp(baseChroma * 0.48, 0.026, 0.14), baseHue),
    "400": preserveGamut(STEP_LIGHTNESS_MAP["400"], neutral ? 0.024 : clamp(baseChroma * 0.72, 0.04, 0.18), baseHue),
    "500": preserveGamut(STEP_LIGHTNESS_MAP["500"], neutral ? 0.028 : clamp(baseChroma, 0.06, 0.24), baseHue),
    "600": preserveGamut(STEP_LIGHTNESS_MAP["600"], neutral ? 0.03 : clamp(baseChroma * 0.95, 0.07, 0.22), baseHue),
    "700": preserveGamut(STEP_LIGHTNESS_MAP["700"], neutral ? 0.027 : clamp(baseChroma * 0.82, 0.06, 0.19), baseHue),
    "800": preserveGamut(STEP_LIGHTNESS_MAP["800"], neutral ? 0.022 : clamp(baseChroma * 0.66, 0.05, 0.16), baseHue),
    "900": preserveGamut(STEP_LIGHTNESS_MAP["900"], neutral ? 0.018 : clamp(baseChroma * 0.46, 0.04, 0.13), baseHue),
    "950": preserveGamut(STEP_LIGHTNESS_MAP["950"], neutral ? 0.013 : clamp(baseChroma * 0.28, 0.03, 0.1), baseHue),
  };
}

export function makeScaleFromAnchorValue(anchorHex: string, neutral = false) {
  return {
    ...makeScaleFromAnchor(anchorHex, neutral),
    "500": normalizeHex(anchorHex, anchorHex),
  };
}

export function makeNeutralAnchor(baseHex: string, preference: NeutralBasePreference) {
  const parsed = parse(baseHex);
  const converted = parsed ? toOklch(parsed) : toOklch("#7d6b5a");
  const hue = converted?.h ?? 80;

  const offsets: Record<NeutralBasePreference, number> = {
    balanced: 0,
    warm: -18,
    cool: 22,
    slate: 48,
    stone: 8,
    sand: -8,
    zinc: 34,
    graphite: 58,
    moss: 96,
    cocoa: -28,
    custom: 0,
  };

  return preserveGamut(0.63, 0.028, hue + offsets[preference]);
}

export function getRelativeLuminance(hex: string) {
  const parsed = hex.replace("#", "");
  const size = parsed.length === 3 ? 1 : 2;
  const channels = [0, 1, 2].map((index) => {
    const start = index * size;
    const segment = parsed.slice(start, start + size);
    const value = size === 1 ? segment + segment : segment;
    const normalized = parseInt(value, 16) / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function getContrastRatio(foreground: string, background: string) {
  const foregroundLum = getRelativeLuminance(foreground);
  const backgroundLum = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLum, backgroundLum);
  const darker = Math.min(foregroundLum, backgroundLum);

  return (lighter + 0.05) / (darker + 0.05);
}
