export const SCALE_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

export const PALETTE_NAMES = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "warning",
  "danger",
] as const;

export const SEMANTIC_TOKEN_NAMES = [
  "background",
  "foreground",
  "surface",
  "surfaceElevated",
  "textPrimary",
  "textSecondary",
  "textMuted",
  "borderDefault",
  "borderStrong",
  "actionPrimary",
  "actionPrimaryForeground",
  "actionPrimaryHover",
  "actionPrimaryActive",
  "actionSecondary",
  "focusRing",
  "success",
  "warning",
  "danger",
] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];
export type PaletteName = (typeof PALETTE_NAMES)[number];
export type SemanticTokenName = (typeof SEMANTIC_TOKEN_NAMES)[number];

export type ColorScale = Record<ScaleStep, string>;
export type PaletteCollection = Record<PaletteName, ColorScale>;
export type TokenReference = `${PaletteName}.${ScaleStep}`;
export type ThemeSemanticTokens = Record<SemanticTokenName, TokenReference>;

export type NeutralBasePreference = "balanced" | "warm" | "cool" | "slate";
export type StyleDirection =
  | "fintech"
  | "minimal"
  | "bold"
  | "editorial"
  | "studio";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  cssVariable: string;
  category: "sans" | "serif";
};

export type TypographyScaleToken = {
  size: string;
  lineHeight: string;
  weight: string;
  letterSpacing?: string;
};

export type TypographyScale = Record<
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bodyLg"
  | "body"
  | "bodySm"
  | "caption",
  TypographyScaleToken
>;

export type TypographyTokens = {
  headingFont: string;
  bodyFont: string;
  scale: TypographyScale;
};

export type RadiusScale = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
};

export type ShadowScale = {
  sm: string;
  md: string;
  lg: string;
};

export type Density = "compact" | "comfortable" | "airy";

export type BrandInputs = {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  neutralBasePreference: NeutralBasePreference;
  headingFont: string;
  bodyFont: string;
  styleDirection: StyleDirection;
  logoDataUrl: string | null;
};

export type GeneratedSystem = {
  palettes: PaletteCollection;
  lightTokens: ThemeSemanticTokens;
  darkTokens: ThemeSemanticTokens;
  typography: TypographyTokens;
  radius: RadiusScale;
  shadows: ShadowScale;
  density: Density;
};
