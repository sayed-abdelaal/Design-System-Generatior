import { FONT_OPTIONS } from "@/data/fonts";
import { makeNeutralAnchor, makeScaleFromAnchor, normalizeHex } from "@/lib/color";
import {
  BrandInputs,
  Density,
  GeneratedSystem,
  PaletteCollection,
  RadiusScale,
  ShadowScale,
  ThemeSemanticTokens,
  TypographyScale,
} from "@/types/design-system";

function buildTypographyScale(direction: BrandInputs["styleDirection"]): TypographyScale {
  const base = {
    display: { size: "clamp(2.85rem, 5vw, 4.8rem)", lineHeight: "0.95", weight: "650", letterSpacing: "-0.04em" },
    h1: { size: "clamp(2.1rem, 3vw, 3.4rem)", lineHeight: "1.02", weight: "650", letterSpacing: "-0.035em" },
    h2: { size: "clamp(1.7rem, 2.2vw, 2.5rem)", lineHeight: "1.08", weight: "620", letterSpacing: "-0.03em" },
    h3: { size: "1.45rem", lineHeight: "1.12", weight: "620", letterSpacing: "-0.02em" },
    h4: { size: "1.14rem", lineHeight: "1.2", weight: "600", letterSpacing: "-0.015em" },
    bodyLg: { size: "1.05rem", lineHeight: "1.7", weight: "500" },
    body: { size: "0.96rem", lineHeight: "1.65", weight: "450" },
    bodySm: { size: "0.875rem", lineHeight: "1.55", weight: "450" },
    caption: { size: "0.75rem", lineHeight: "1.4", weight: "600", letterSpacing: "0.04em" },
  } satisfies TypographyScale;

  if (direction === "editorial") {
    return {
      ...base,
      display: { ...base.display, size: "clamp(3rem, 5.5vw, 5.3rem)", lineHeight: "0.92", weight: "700" },
      bodyLg: { ...base.bodyLg, size: "1.08rem", lineHeight: "1.8" },
    };
  }

  if (direction === "bold") {
    return {
      ...base,
      display: { ...base.display, weight: "760" },
      h1: { ...base.h1, weight: "720" },
      h2: { ...base.h2, weight: "700" },
    };
  }

  return base;
}

function buildRadii(direction: BrandInputs["styleDirection"]): RadiusScale {
  if (direction === "minimal") {
    return { sm: "0.45rem", md: "0.8rem", lg: "1rem", xl: "1.4rem", pill: "999px" };
  }

  if (direction === "editorial") {
    return { sm: "0.3rem", md: "0.6rem", lg: "0.95rem", xl: "1.2rem", pill: "999px" };
  }

  return { sm: "0.5rem", md: "0.95rem", lg: "1.2rem", xl: "1.6rem", pill: "999px" };
}

function buildShadows(direction: BrandInputs["styleDirection"]): ShadowScale {
  if (direction === "bold") {
    return {
      sm: "0 10px 20px -16px rgba(15, 23, 42, 0.24)",
      md: "0 20px 40px -24px rgba(15, 23, 42, 0.28)",
      lg: "0 26px 60px -30px rgba(15, 23, 42, 0.36)",
    };
  }

  return {
    sm: "0 10px 20px -18px rgba(15, 23, 42, 0.18)",
    md: "0 16px 32px -20px rgba(15, 23, 42, 0.22)",
    lg: "0 22px 52px -26px rgba(15, 23, 42, 0.3)",
  };
}

function buildDensity(direction: BrandInputs["styleDirection"]): Density {
  if (direction === "minimal") {
    return "compact";
  }

  if (direction === "editorial") {
    return "airy";
  }

  return "comfortable";
}

function buildSemanticTokens(): { lightTokens: ThemeSemanticTokens; darkTokens: ThemeSemanticTokens } {
  return {
    lightTokens: {
      background: "neutral.50",
      foreground: "neutral.950",
      surface: "neutral.100",
      surfaceElevated: "neutral.50",
      textPrimary: "neutral.950",
      textSecondary: "neutral.700",
      textMuted: "neutral.500",
      borderDefault: "neutral.200",
      borderStrong: "neutral.400",
      actionPrimary: "primary.600",
      actionPrimaryForeground: "neutral.50",
      actionPrimaryHover: "primary.700",
      actionPrimaryActive: "primary.800",
      actionSecondary: "secondary.600",
      focusRing: "accent.500",
      success: "success.600",
      warning: "warning.600",
      danger: "danger.600",
    },
    darkTokens: {
      background: "neutral.950",
      foreground: "neutral.50",
      surface: "neutral.900",
      surfaceElevated: "neutral.800",
      textPrimary: "neutral.50",
      textSecondary: "neutral.300",
      textMuted: "neutral.400",
      borderDefault: "neutral.800",
      borderStrong: "neutral.600",
      actionPrimary: "primary.400",
      actionPrimaryForeground: "neutral.950",
      actionPrimaryHover: "primary.300",
      actionPrimaryActive: "primary.200",
      actionSecondary: "secondary.300",
      focusRing: "accent.400",
      success: "success.400",
      warning: "warning.400",
      danger: "danger.400",
    },
  };
}

function getFontCssVariable(fontId: string, fallbackId: string) {
  return FONT_OPTIONS.find((font) => font.id === fontId)?.cssVariable
    ?? FONT_OPTIONS.find((font) => font.id === fallbackId)?.cssVariable
    ?? "var(--font-manrope)";
}

export function createGeneratedSystem(inputs: BrandInputs): GeneratedSystem {
  const primary = normalizeHex(inputs.primaryColor, "#7c5cff");
  const secondary = normalizeHex(inputs.secondaryColor, "#c77734");
  const accent = normalizeHex(inputs.accentColor, "#16a34a");
  const neutralAnchor = makeNeutralAnchor(primary, inputs.neutralBasePreference);

  const palettes: PaletteCollection = {
    primary: makeScaleFromAnchor(primary),
    secondary: makeScaleFromAnchor(secondary),
    accent: makeScaleFromAnchor(accent),
    neutral: makeScaleFromAnchor(neutralAnchor, true),
    success: makeScaleFromAnchor("#16a34a"),
    warning: makeScaleFromAnchor("#d97706"),
    danger: makeScaleFromAnchor("#dc2626"),
  };

  const { lightTokens, darkTokens } = buildSemanticTokens();

  return {
    palettes,
    lightTokens,
    darkTokens,
    typography: {
      headingFont: getFontCssVariable(inputs.headingFont, "fraunces"),
      bodyFont: getFontCssVariable(inputs.bodyFont, "manrope"),
      scale: buildTypographyScale(inputs.styleDirection),
    },
    radius: buildRadii(inputs.styleDirection),
    shadows: buildShadows(inputs.styleDirection),
    density: buildDensity(inputs.styleDirection),
  };
}

export function resolveTokenReference(reference: string, palettes: PaletteCollection) {
  const [paletteName, scaleStep] = reference.split(".");

  if (!paletteName || !scaleStep) {
    return "#000000";
  }

  return palettes[paletteName as keyof PaletteCollection]?.[scaleStep as keyof PaletteCollection["primary"]] ?? "#000000";
}
