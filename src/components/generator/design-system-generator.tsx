"use client";

import Image from "next/image";
import type { ChangeEvent, CSSProperties, Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Analytics01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  ChartHistogramIcon,
  DashboardSquare01Icon,
  DatabaseIcon,
  Home01Icon,
  Mail01Icon,
  Menu01Icon,
  Notification03Icon,
  Search01Icon,
  Settings01Icon,
  StarIcon as StarHugeIcon,
  TableIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import {
  Download,
  Layers3,
  MonitorCog,
  MoonStar,
  Palette,
  Sparkles,
  SunMedium,
  SwatchBook,
  Type,
  Upload,
} from "lucide-react";

import { FONT_OPTIONS } from "@/data/fonts";
import { getContrastRatio, isValidHex, normalizeHex } from "@/lib/color";
import {
  buildComponentsJson,
  buildReadme,
  buildSessionJson,
  buildTailwindThemeCss,
  buildThemeCss,
  buildTokensJson,
  buildZip,
  downloadBlob,
  downloadTextFile,
} from "@/lib/export";
import { createGeneratedSystem, resolveTokenReference } from "@/lib/generator";
import {
  BrandInputs,
  ColorInputKey,
  Density,
  GeneratedSystem,
  NeutralBasePreference,
  SCALE_STEPS,
  ScaleStep,
  SEMANTIC_TOKEN_NAMES,
  SemanticTokenName,
  StyleDirection,
  TokenReference,
} from "@/types/design-system";

const STYLE_DIRECTIONS: StyleDirection[] = [
  "fintech",
  "minimal",
  "bold",
  "editorial",
  "studio",
];

const NEUTRAL_OPTIONS: Array<{ value: NeutralBasePreference; label: string }> = [
  { value: "balanced", label: "Balanced" },
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
  { value: "slate", label: "Slate" },
  { value: "stone", label: "Stone" },
  { value: "sand", label: "Sand" },
  { value: "zinc", label: "Zinc" },
  { value: "graphite", label: "Graphite" },
  { value: "moss", label: "Moss" },
  { value: "cocoa", label: "Cocoa" },
  { value: "custom", label: "Custom hex" },
];

const ADVANCED_PALETTE_ROWS: Array<{ key: Exclude<ColorInputKey, "primary" | "secondary" | "accent">; label: string; helper: string }> = [
  { key: "neutral", label: "Neutral", helper: "Overrides the generated neutral anchor directly." },
  { key: "success", label: "Success", helper: "Controls success states and confirmations." },
  { key: "warning", label: "Warning", helper: "Controls warning surfaces and notices." },
  { key: "danger", label: "Danger", helper: "Controls destructive and error states." },
  { key: "info", label: "Info", helper: "Controls informational states and supporting data." },
  { key: "attention", label: "Attention", helper: "Controls stronger notice and urgency moments." },
  { key: "highlight", label: "Highlight", helper: "Controls spotlight, emphasis, and annotation color." },
];

const INITIAL_INPUTS: BrandInputs = {
  brandName: "Northstar Labs",
  primaryColor: "#635bff",
  secondaryColor: "#d06d2f",
  accentColor: "#0ea5a4",
  neutralBasePreference: "balanced",
  neutralBaseHex: "#7d6b5a",
  advancedPaletteInputs: false,
  paletteOverrides: {},
  customColors: [],
  displayFont: "fraunces",
  headingFont: "fraunces",
  bodyFont: "manrope",
  styleDirection: "fintech",
  logoDataUrl: null,
};

const PREVIEW_MODES = ["foundations", "ui-kit", "components", "icons", "dashboard", "marketing"] as const;
const TYPOGRAPHY_SCALE_ORDER = [
  "display1",
  "display2",
  "display3",
  "display4",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "bodyLg",
  "body",
  "bodySm",
  "caption",
  "overline",
  "label",
  "helper",
  "code",
  "codeSm",
] as const;
type PreviewMode = (typeof PREVIEW_MODES)[number];
type ActiveTheme = "light" | "dark";
type BrandPanelTab = "brand" | "colors" | "assets";
type EditorPanelTab = "foundations" | "system" | "components" | "handoff";
type ControlPanelView = "inputs" | "editor";
type QualityFinding = {
  label: string;
  severity: "info" | "warning" | "critical";
};

function sectionLabel(token: string) {
  return token.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
}

function resolveThemeValues(system: GeneratedSystem, activeTheme: ActiveTheme) {
  const themeTokens = activeTheme === "light" ? system.lightTokens : system.darkTokens;

  return Object.fromEntries(
    SEMANTIC_TOKEN_NAMES.map((token) => [
      token,
      resolveTokenReference(themeTokens[token], system.palettes),
    ]),
  ) as Record<SemanticTokenName, string>;
}

function createPreviewStyle(system: GeneratedSystem, activeTheme: ActiveTheme) {
  const resolved = resolveThemeValues(system, activeTheme);
  const buttonPrimaryBackground = resolveTokenReference(system.components.button.colors.primary.background, system.palettes);
  const buttonPrimaryForeground = resolveTokenReference(system.components.button.colors.primary.foreground, system.palettes);
  const buttonPrimaryBorder = resolveTokenReference(system.components.button.colors.primary.border, system.palettes);
  const buttonPrimaryHoverBackground = resolveTokenReference(system.components.button.colors.primary.hoverBackground, system.palettes);
  const buttonPrimaryHoverForeground = resolveTokenReference(system.components.button.colors.primary.hoverForeground, system.palettes);
  const buttonPrimaryHoverBorder = resolveTokenReference(system.components.button.colors.primary.hoverBorder, system.palettes);
  const buttonSecondaryBackground = resolveTokenReference(system.components.button.colors.secondary.background, system.palettes);
  const buttonSecondaryForeground = resolveTokenReference(system.components.button.colors.secondary.foreground, system.palettes);
  const buttonSecondaryBorderColor = resolveTokenReference(system.components.button.colors.secondary.border, system.palettes);
  const buttonSecondaryHoverBackground = resolveTokenReference(system.components.button.colors.secondary.hoverBackground, system.palettes);
  const buttonSecondaryHoverForeground = resolveTokenReference(system.components.button.colors.secondary.hoverForeground, system.palettes);
  const buttonSecondaryHoverBorder = resolveTokenReference(system.components.button.colors.secondary.hoverBorder, system.palettes);
  const buttonGhostBackground = resolveTokenReference(system.components.button.colors.ghost.background, system.palettes);
  const buttonGhostForeground = resolveTokenReference(system.components.button.colors.ghost.foreground, system.palettes);
  const buttonGhostBorder = resolveTokenReference(system.components.button.colors.ghost.border, system.palettes);
  const buttonGhostHoverBackground = resolveTokenReference(system.components.button.colors.ghost.hoverBackground, system.palettes);
  const buttonGhostHoverForeground = resolveTokenReference(system.components.button.colors.ghost.hoverForeground, system.palettes);
  const buttonGhostHoverBorder = resolveTokenReference(system.components.button.colors.ghost.hoverBorder, system.palettes);
  const badgeBackground = resolveTokenReference(system.components.badge.color.background, system.palettes);
  const badgeForeground = resolveTokenReference(system.components.badge.color.foreground, system.palettes);
  const badgeBorder = resolveTokenReference(system.components.badge.color.border, system.palettes);
  const alertSuccess = resolveTokenReference(system.components.alert.colors.success, system.palettes);
  const alertWarning = resolveTokenReference(system.components.alert.colors.warning, system.palettes);
  const alertDanger = resolveTokenReference(system.components.alert.colors.danger, system.palettes);
  const alertInfo = resolveTokenReference(system.components.alert.colors.info, system.palettes);
  const alertAttention = resolveTokenReference(system.components.alert.colors.attention, system.palettes);
  const defaultRadius = system.radius[system.utilities.layout.defaultRadius];
  const selectionMap = {
    brand: "color-mix(in oklch, var(--preview-action-primary) 22%, white)",
    neutral: "color-mix(in oklch, var(--preview-text-muted) 20%, white)",
  } as const;
  const buttonSecondaryBg = system.components.button.secondaryStyle === "soft"
    ? buttonSecondaryBackground
    : "transparent";
  const buttonSecondaryBorder = system.components.button.secondaryStyle === "soft"
    ? buttonSecondaryBorderColor
    : buttonSecondaryBorderColor;
  const badgeSoftBg = badgeBackground;
  const badgeSolidBg = badgeBackground;
  const alertStrongSuccessBg = "color-mix(in srgb, var(--preview-alert-success-color) 18%, transparent)";
  const alertSoftSuccessBg = "color-mix(in srgb, var(--preview-alert-success-color) 12%, transparent)";
  const alertStrongWarningBg = "color-mix(in srgb, var(--preview-alert-warning-color) 22%, transparent)";
  const alertSoftWarningBg = "color-mix(in srgb, var(--preview-alert-warning-color) 14%, transparent)";
  const alertStrongDangerBg = "color-mix(in srgb, var(--preview-alert-danger-color) 18%, transparent)";
  const alertSoftDangerBg = "color-mix(in srgb, var(--preview-alert-danger-color) 12%, transparent)";
  const hoverLiftMap = {
    none: "0px",
    sm: "1px",
    md: "2px",
  } as const;
  const ghostBg = system.components.button.ghostStyle === "minimal"
    ? "transparent"
    : buttonGhostBackground;
  const alertBorderVariant = system.components.alert.variantStyle === "outlined"
    ? "color-mix(in srgb, currentColor 40%, transparent)"
    : "transparent";
  const dialogOverlay = system.components.dialog.overlayTone === "strong"
    ? "color-mix(in srgb, var(--preview-foreground) 34%, transparent)"
    : "color-mix(in srgb, var(--preview-foreground) 18%, transparent)";
  const iconButtons = resolveTokenReference(system.icons.semanticUsage.buttons, system.palettes);
  const iconAlerts = resolveTokenReference(system.icons.semanticUsage.alerts, system.palettes);
  const iconNav = resolveTokenReference(system.icons.semanticUsage.nav, system.palettes);
  const iconTables = resolveTokenReference(system.icons.semanticUsage.tables, system.palettes);
  const iconInputs = resolveTokenReference(system.icons.semanticUsage.inputs, system.palettes);

  return {
    "--preview-background": resolved.background,
    "--preview-foreground": resolved.foreground,
    "--preview-surface": resolved.surface,
    "--preview-surface-elevated": resolved.surfaceElevated,
    "--preview-text-primary": resolved.textPrimary,
    "--preview-text-secondary": resolved.textSecondary,
    "--preview-text-muted": resolved.textMuted,
    "--preview-border-default": resolved.borderDefault,
    "--preview-border-strong": resolved.borderStrong,
    "--preview-action-primary": resolved.actionPrimary,
    "--preview-action-primary-foreground": resolved.actionPrimaryForeground,
    "--preview-action-primary-hover": resolved.actionPrimaryHover,
    "--preview-action-primary-active": resolved.actionPrimaryActive,
    "--preview-action-secondary": resolved.actionSecondary,
    "--preview-focus-ring": resolved.focusRing,
    "--preview-success": resolved.success,
    "--preview-warning": resolved.warning,
    "--preview-danger": resolved.danger,
    "--preview-alert-success-color": alertSuccess,
    "--preview-alert-warning-color": alertWarning,
    "--preview-alert-danger-color": alertDanger,
    "--preview-alert-info-color": alertInfo,
    "--preview-alert-attention-color": alertAttention,
    "--preview-font-display": system.typography.displayFont,
    "--preview-font-heading": system.typography.headingFont,
    "--preview-font-body": system.typography.bodyFont,
    "--preview-icon-size": `${system.icons.defaultSize}px`,
    "--preview-icon-stroke": system.icons.strokeWidth,
    "--preview-icon-buttons": system.icons.colorBehavior === "semantic" ? iconButtons : system.icons.colorBehavior === "muted" ? resolved.textMuted : "currentColor",
    "--preview-icon-alerts": system.icons.colorBehavior === "semantic" ? iconAlerts : system.icons.colorBehavior === "muted" ? resolved.textMuted : "currentColor",
    "--preview-icon-nav": system.icons.colorBehavior === "semantic" ? iconNav : system.icons.colorBehavior === "muted" ? resolved.textMuted : "currentColor",
    "--preview-icon-tables": system.icons.colorBehavior === "semantic" ? iconTables : system.icons.colorBehavior === "muted" ? resolved.textMuted : "currentColor",
    "--preview-icon-inputs": system.icons.colorBehavior === "semantic" ? iconInputs : system.icons.colorBehavior === "muted" ? resolved.textMuted : "currentColor",
    "--preview-radius-sm": system.radius.sm,
    "--preview-radius-md": system.radius.md,
    "--preview-radius-lg": system.radius.lg,
    "--preview-radius-xl": system.radius.xl,
    "--preview-radius-pill": system.radius.pill,
    "--preview-shadow-sm": system.shadows.sm,
    "--preview-shadow-md": system.shadows.md,
    "--preview-shadow-lg": system.shadows.lg,
    "--preview-blur-sm": system.foundations.blur.sm,
    "--preview-space-4": system.foundations.spacing["4"],
    "--preview-space-6": system.foundations.spacing["6"],
    "--preview-ease-standard": system.foundations.easing.standard,
    "--preview-ease-emphasized": system.foundations.easing.emphasized,
    "--preview-animate-fade-in": system.foundations.animations[system.utilities.motion.entranceAnimation],
    "--preview-default-radius": defaultRadius,
    "--preview-border-width": system.foundations.borderWidths[system.utilities.borders.borderWidth],
    "--preview-surface-shadow": system.shadows[system.utilities.effects.surfaceShadow],
    "--preview-elevated-shadow": system.shadows[system.utilities.effects.elevatedShadow],
    "--preview-transition-ease": system.foundations.easing[system.utilities.motion.transitionEase],
    "--preview-duration-fast": system.foundations.durations.fast,
    "--preview-duration-standard": system.foundations.durations.standard,
    "--preview-duration-slow": system.foundations.durations.slow,
    "--preview-stack-gap": system.foundations.spacing[system.utilities.spacing.stackGap],
    "--preview-card-gap": system.foundations.spacing[system.utilities.layout.cardGap],
    "--preview-focus-ring-width": system.utilities.interactivity.focusRingWidth,
    "--preview-control-cursor": system.utilities.interactivity.controlCursor,
    "--preview-selection-bg": selectionMap[system.utilities.interactivity.selectionStyle],
    "--preview-opacity-subtle": system.foundations.opacity.subtle,
    "--preview-opacity-muted": system.foundations.opacity.muted,
    "--preview-opacity-disabled": system.foundations.opacity.disabled,
    "--preview-opacity-strong": system.foundations.opacity.strong,
    "--preview-z-dropdown": system.foundations.zIndex.dropdown,
    "--preview-z-sticky": system.foundations.zIndex.sticky,
    "--preview-z-overlay": system.foundations.zIndex.overlay,
    "--preview-z-modal": system.foundations.zIndex.modal,
    "--preview-z-toast": system.foundations.zIndex.toast,
    "--preview-link-weight": system.foundations.fontWeights[system.foundations.content.links.weight],
    "--preview-link-underline": system.foundations.content.links.underline === "always" ? "underline" : "none",
    "--preview-link-hover-underline": system.foundations.content.links.underline === "hover" ? "underline" : system.foundations.content.links.underline === "always" ? "underline" : "none",
    "--preview-link-color": system.foundations.content.links.tone === "brand"
      ? resolved.actionPrimary
      : system.foundations.content.links.tone === "foreground"
        ? resolved.textPrimary
        : resolved.textSecondary,
    "--preview-list-gap": system.foundations.spacing[system.foundations.content.lists.gap],
    "--preview-list-indent": system.foundations.spacing[system.foundations.content.lists.indent],
    "--preview-code-radius": system.radius[system.foundations.content.code.radius],
    "--preview-code-px": system.foundations.spacing[system.foundations.content.code.paddingX],
    "--preview-code-py": system.foundations.spacing[system.foundations.content.code.paddingY],
    "--preview-touch-target-min": system.foundations.spacing[system.foundations.accessibility.touchTargetMin],
    "--preview-screen-reader-prefix": `"${system.foundations.accessibility.screenReaderLabelPrefix}"`,
    "--preview-button-radius": system.radius[system.components.button.radius],
    "--preview-button-shadow": system.shadows[system.components.button.primaryShadow],
    "--preview-button-px": system.foundations.spacing[system.components.button.paddingX],
    "--preview-button-py": system.foundations.spacing[system.components.button.paddingY],
    "--preview-button-primary-bg": buttonPrimaryBackground,
    "--preview-button-primary-fg": buttonPrimaryForeground,
    "--preview-button-primary-border": buttonPrimaryBorder,
    "--preview-button-primary-hover-bg": buttonPrimaryHoverBackground,
    "--preview-button-primary-hover-fg": buttonPrimaryHoverForeground,
    "--preview-button-primary-hover-border": buttonPrimaryHoverBorder,
    "--preview-button-secondary-bg": buttonSecondaryBg,
    "--preview-button-secondary-fg": buttonSecondaryForeground,
    "--preview-button-secondary-border": buttonSecondaryBorder,
    "--preview-button-secondary-hover-bg": buttonSecondaryHoverBackground,
    "--preview-button-secondary-hover-fg": buttonSecondaryHoverForeground,
    "--preview-button-secondary-hover-border": buttonSecondaryHoverBorder,
    "--preview-button-ghost-bg": ghostBg,
    "--preview-button-ghost-fg": buttonGhostForeground,
    "--preview-button-ghost-border": buttonGhostBorder,
    "--preview-button-ghost-hover-bg": buttonGhostHoverBackground,
    "--preview-button-ghost-hover-fg": buttonGhostHoverForeground,
    "--preview-button-ghost-hover-border": buttonGhostHoverBorder,
    "--preview-button-hover-lift": hoverLiftMap[system.components.button.hoverLift],
    "--preview-input-radius": system.radius[system.components.input.radius],
    "--preview-input-px": system.foundations.spacing[system.components.input.paddingX],
    "--preview-input-py": system.foundations.spacing[system.components.input.paddingY],
    "--preview-input-border-width": system.components.input.borderStyle === "strong" ? "2px" : "1px",
    "--preview-input-error-border": "var(--preview-danger)",
    "--preview-input-error-bg": system.components.input.validationStyle === "strong"
      ? "color-mix(in srgb, var(--preview-danger) 12%, transparent)"
      : "color-mix(in srgb, var(--preview-danger) 6%, transparent)",
    "--preview-input-success-border": "var(--preview-success)",
    "--preview-input-success-bg": system.components.input.validationStyle === "strong"
      ? "color-mix(in srgb, var(--preview-success) 12%, transparent)"
      : "color-mix(in srgb, var(--preview-success) 6%, transparent)",
    "--preview-input-readonly-bg": system.components.input.readOnlyStyle === "muted"
      ? "color-mix(in srgb, var(--preview-border-default) 18%, transparent)"
      : "transparent",
    "--preview-input-readonly-border": system.components.input.readOnlyStyle === "muted"
      ? "color-mix(in srgb, var(--preview-border-strong) 35%, transparent)"
      : "var(--preview-border-strong)",
    "--preview-input-search-border": system.components.input.searchStyle === "underline"
      ? "transparent"
      : "var(--preview-border-default)",
    "--preview-input-select-bg": system.components.input.selectStyle === "quiet"
      ? "color-mix(in srgb, var(--preview-surface-elevated) 65%, transparent)"
      : "var(--preview-surface-elevated)",
    "--preview-textarea-radius": system.radius[system.components.textarea.radius],
    "--preview-textarea-padding": system.foundations.spacing[system.components.textarea.padding],
    "--preview-textarea-min-height": system.foundations.spacing[system.components.textarea.minHeight],
    "--preview-badge-radius": system.radius[system.components.badge.radius],
    "--preview-badge-px": system.foundations.spacing[system.components.badge.paddingX],
    "--preview-badge-py": system.foundations.spacing[system.components.badge.paddingY],
    "--preview-badge-bg": system.components.badge.style === "solid" ? badgeSolidBg : badgeSoftBg,
    "--preview-badge-fg": badgeForeground,
    "--preview-badge-border": badgeBorder,
    "--preview-alert-radius": system.radius[system.components.alert.radius],
    "--preview-alert-padding": system.foundations.spacing[system.components.alert.padding],
    "--preview-alert-success-bg": system.components.alert.emphasis === "strong" ? alertStrongSuccessBg : alertSoftSuccessBg,
    "--preview-alert-success-border": system.components.alert.variantStyle === "outlined" ? alertBorderVariant : "color-mix(in srgb, var(--preview-alert-success-color) 26%, transparent)",
    "--preview-alert-warning-bg": system.components.alert.emphasis === "strong" ? alertStrongWarningBg : alertSoftWarningBg,
    "--preview-alert-warning-border": system.components.alert.variantStyle === "outlined" ? alertBorderVariant : "color-mix(in srgb, var(--preview-alert-warning-color) 28%, transparent)",
    "--preview-alert-danger-bg": system.components.alert.emphasis === "strong" ? alertStrongDangerBg : alertSoftDangerBg,
    "--preview-alert-danger-border": system.components.alert.variantStyle === "outlined" ? alertBorderVariant : "color-mix(in srgb, var(--preview-alert-danger-color) 24%, transparent)",
    "--preview-table-radius": system.radius[system.components.table.radius],
    "--preview-table-px": system.foundations.spacing[system.components.table.cellPaddingX],
    "--preview-table-py": system.foundations.spacing[system.components.table.cellPaddingY],
    "--preview-dialog-radius": system.radius[system.components.dialog.radius],
    "--preview-dialog-width": system.foundations.containers[system.components.dialog.width],
    "--preview-dialog-padding": system.foundations.spacing[system.components.dialog.padding],
    "--preview-dialog-shadow": system.shadows[system.components.dialog.shadow],
    "--preview-dialog-overlay": dialogOverlay,
    "--preview-dialog-overlay-blur": system.foundations.blur[system.components.dialog.overlayBlur],
  } as CSSProperties;
}

function getScreenPresetKey(previewMode: PreviewMode) {
  if (previewMode === "foundations") {
    return "settings" as const;
  }

  if (previewMode === "dashboard") {
    return "dashboard" as const;
  }

  if (previewMode === "marketing") {
    return "marketing" as const;
  }

  if (previewMode === "components") {
    return "settings" as const;
  }

  if (previewMode === "icons") {
    return "settings" as const;
  }

  return "formPage" as const;
}

function getPreviewMetrics(system: GeneratedSystem, previewMode: PreviewMode) {
  const preset = system.screens[getScreenPresetKey(previewMode)];

  return {
    preset,
    maxWidth: system.foundations.containers[preset.maxWidth],
    sectionGap: system.foundations.spacing[preset.sectionGap],
    chromePadding: system.foundations.spacing[preset.chromePadding],
  };
}

function auditSystem(system: GeneratedSystem) {
  const lightValues = resolveThemeValues(system, "light");
  const darkValues = resolveThemeValues(system, "dark");
  const findings: QualityFinding[] = [];
  let score = 100;

  if (getContrastRatio(lightValues.textPrimary, lightValues.background) < 4.5) {
    findings.push({ label: "Light theme primary text contrast is below 4.5:1.", severity: "critical" });
    score -= 22;
  }

  if (getContrastRatio(darkValues.textPrimary, darkValues.background) < 4.5) {
    findings.push({ label: "Dark theme primary text contrast is below 4.5:1.", severity: "critical" });
    score -= 22;
  }

  if (getContrastRatio(lightValues.actionPrimaryForeground, lightValues.actionPrimary) < 4.5) {
    findings.push({ label: "Primary action contrast in the light theme needs improvement.", severity: "warning" });
    score -= 12;
  }

  if (getContrastRatio(darkValues.actionPrimaryForeground, darkValues.actionPrimary) < 4.5) {
    findings.push({ label: "Primary action contrast in the dark theme needs improvement.", severity: "warning" });
    score -= 12;
  }

  if (!system.utilityCoverage.accessibility.enabled) {
    findings.push({ label: "Accessibility utility coverage is disabled, so exports may miss enforced fallbacks.", severity: "critical" });
    score -= 18;
  }

  if (!system.utilityCoverage.transitionsAnimation.enabled && system.utilities.motion.motionLevel !== "calm") {
    findings.push({ label: "Motion is expressive but transition coverage is disabled, which can create drift at export time.", severity: "warning" });
    score -= 10;
  }

  const disabledFamilies = Object.entries(system.utilityCoverage).filter(([, value]) => !value.enabled).length;
  if (disabledFamilies > 2) {
    findings.push({ label: "Several Tailwind utility families are disabled, so exported system coverage is intentionally partial.", severity: "warning" });
    score -= 8;
  }

  if (system.components.input.validationStyle === "strong" && !system.components.input.showHelperText) {
    findings.push({ label: "Inputs use strong validation styling without helper text, which may reduce clarity.", severity: "info" });
    score -= 5;
  }

  if (system.screens.dashboard.density === "compact" && system.components.table.density === "comfortable") {
    findings.push({ label: "Dashboard density and table density are out of sync.", severity: "info" });
    score -= 4;
  }

  if (system.utilities.borders.outlineStyle === "soft" && system.utilities.interactivity.focusRingWidth === "2px") {
    findings.push({ label: "Focus styling is subtle; consider a stronger ring for keyboard-heavy products.", severity: "info" });
    score -= 4;
  }

  const exportReadiness: "ready" | "review" | "risky" =
    score >= 88 ? "ready" : score >= 72 ? "review" : "risky";

  return {
    score: Math.max(28, Math.round(score)),
    exportReadiness,
    findings,
    contrastWarnings: findings
      .filter((finding) => finding.severity !== "info")
      .map((finding) => finding.label),
  };
}

function tokenReferenceOptions(system: GeneratedSystem) {
  return Object.keys(system.palettes).flatMap((paletteName) =>
    SCALE_STEPS.map((step) => `${paletteName}.${step}` as TokenReference),
  );
}

function getSystemMetrics(system: GeneratedSystem) {
  const rawScaleCount = Object.keys(system.palettes).length * SCALE_STEPS.length;
  const semanticCount = SEMANTIC_TOKEN_NAMES.length * 2;
  const customPaletteCount = system.customPalettes.length;
  const componentFamilyCount = Object.keys(system.components).length;

  return {
    tokenCount: rawScaleCount + semanticCount,
    paletteCount: Object.keys(system.palettes).length,
    customPaletteCount,
    componentFamilyCount,
    exportFileCount: 6,
  };
}

function getTokenSwatchColor(option: TokenReference, palettes: GeneratedSystem["palettes"]) {
  return resolveTokenReference(option, palettes);
}

function PreviewIcon({
  icon,
  context,
  size,
  strokeWidth,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  context: "buttons" | "alerts" | "nav" | "tables" | "inputs";
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size ?? "var(--preview-icon-size)"}
      strokeWidth={strokeWidth ?? Number("1.7")}
      color={`var(--preview-icon-${context})`}
    />
  );
}

function TokenReferencePicker({
  options,
  value,
  palettes,
  onChange,
}: {
  options: TokenReference[];
  value: TokenReference;
  palettes: GeneratedSystem["palettes"];
  onChange: (value: TokenReference) => void;
}) {
  const selectedColor = getTokenSwatchColor(value, palettes);

  return (
    <details className="token-picker">
      <summary className="token-picker-trigger">
        <span className="token-picker-chip" style={{ background: selectedColor }} />
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <span className="token-picker-caret" aria-hidden="true" />
      </summary>
      <div className="token-picker-menu">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="token-picker-option"
            data-active={option === value}
            onClick={(event) => {
              onChange(option);
              const details = event.currentTarget.closest("details");
              if (details instanceof HTMLDetailsElement) {
                details.open = false;
              }
            }}
          >
            <span className="token-picker-chip" style={{ background: getTokenSwatchColor(option, palettes) }} />
            <span className="min-w-0 flex-1 truncate text-left">{option}</span>
          </button>
        ))}
      </div>
    </details>
  );
}

function BrandInputPanel({
  inputs,
  setInputs,
  colorErrors,
}: {
  inputs: BrandInputs;
  setInputs: (updater: (current: BrandInputs) => BrandInputs) => void;
  colorErrors: Record<string, string | undefined>;
}) {
  function handleInputChange(key: keyof BrandInputs, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  const [activeTab, setActiveTab] = useState<BrandPanelTab>("brand");

  function handlePaletteOverrideChange(key: ColorInputKey, value: string) {
    setInputs((current) => ({
      ...current,
      paletteOverrides: {
        ...current.paletteOverrides,
        [key]: value,
      },
    }));
  }

  function addCustomColor() {
    setInputs((current) => ({
      ...current,
      customColors: [
        ...current.customColors,
        {
          id: crypto.randomUUID(),
          name: "",
          hex: "",
        },
      ],
    }));
  }

  function updateCustomColor(id: string, patch: Partial<BrandInputs["customColors"][number]>) {
    setInputs((current) => ({
      ...current,
      customColors: current.customColors.map((color) => (
        color.id === id
          ? { ...color, ...patch }
          : color
      )),
    }));
  }

  function removeCustomColor(id: string) {
    setInputs((current) => ({
      ...current,
      customColors: current.customColors.filter((color) => color.id !== id),
    }));
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setInputs((current) => ({ ...current, logoDataUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  }

  const colorRows: Array<{
    key: "primaryColor" | "secondaryColor" | "accentColor";
    label: string;
    helper: string;
  }> = [
    { key: "primaryColor", label: "Primary", helper: "Anchors core actions and brand moments." },
    { key: "secondaryColor", label: "Secondary", helper: "Supports charts, secondary buttons, and accents." },
    { key: "accentColor", label: "Accent", helper: "Drives focus rings and highlights." },
  ];

  return (
    <div className="panel subtle-grid sticky top-5 overflow-hidden rounded-[1.25rem]">
      <div className="border-b border-app-border/70 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Brand Inputs</p>
        <h1 className="mt-3 max-w-xs text-2xl font-semibold tracking-[-0.04em] text-app-foreground">
          Tailwind Design System Generator
        </h1>
        <p className="mt-2 text-sm leading-6 text-app-muted">
          Craft a shippable theme from a brand seed, preview it in context, and export Tailwind-ready files.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {([
            ["brand", "Brand"],
            ["colors", "Colors"],
            ["assets", "Assets"],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              className="workspace-tab"
              data-active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 px-5 py-5">
        {activeTab === "brand" ? (
          <>
            <div className="workspace-card space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">Brand setup</p>
                <p className="mt-2 text-sm text-app-muted">Set the identity, direction, and neutral strategy before refining the system.</p>
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-app-foreground">Brand name</span>
                <input
                  className="field"
                  value={inputs.brandName}
                  onChange={(event) => handleInputChange("brandName", event.target.value)}
                  placeholder="Enter brand name"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-app-foreground">Neutral base</span>
                  <select
                    className="field"
                    value={inputs.neutralBasePreference}
                    onChange={(event) => handleInputChange("neutralBasePreference", event.target.value)}
                  >
                    {NEUTRAL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-app-foreground">Style direction</span>
                  <select
                    className="field"
                    value={inputs.styleDirection}
                    onChange={(event) => handleInputChange("styleDirection", event.target.value)}
                  >
                    {STYLE_DIRECTIONS.map((direction) => (
                      <option key={direction} value={direction}>
                        {sectionLabel(direction)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {inputs.neutralBasePreference === "custom" ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-app-foreground">Neutral hex anchor</span>
                  <div className="grid grid-cols-[56px_1fr] gap-3">
                    <input
                      type="color"
                      aria-label="Neutral hex anchor picker"
                      className="h-12 w-14 cursor-pointer rounded-[0.9rem] border border-app-border bg-transparent p-1"
                      value={isValidHex(inputs.neutralBaseHex) ? normalizeHex(inputs.neutralBaseHex, "#7d6b5a") : "#7d6b5a"}
                      onChange={(event) => handleInputChange("neutralBaseHex", event.target.value)}
                    />
                    <input
                      className="field"
                      value={inputs.neutralBaseHex}
                      onChange={(event) => handleInputChange("neutralBaseHex", event.target.value)}
                      placeholder="#7d6b5a"
                      aria-invalid={Boolean(colorErrors.neutralBaseHex)}
                    />
                  </div>
                  {colorErrors.neutralBaseHex ? (
                    <p className="text-sm text-rose-600">{colorErrors.neutralBaseHex}</p>
                  ) : null}
                </label>
              ) : null}
            </div>
          </>
        ) : null}

        {activeTab === "colors" ? (
          <>
            <div className="workspace-card space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">Core palettes</p>
                <p className="mt-2 text-sm text-app-muted">Start with your brand anchors, then decide whether you want full palette control.</p>
              </div>
              <div className="space-y-4">
                {colorRows.map((row) => (
                  <div key={row.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-app-foreground">{row.label}</label>
                      <span className="text-xs text-app-muted">{row.helper}</span>
                    </div>
                    <div className="grid grid-cols-[56px_1fr] gap-3">
                      <input
                        type="color"
                        aria-label={`${row.label} color picker`}
                        className="h-12 w-14 cursor-pointer rounded-[0.9rem] border border-app-border bg-transparent p-1"
                        value={isValidHex(inputs[row.key]) ? normalizeHex(inputs[row.key], "#000000") : "#000000"}
                        onChange={(event) => handleInputChange(row.key, event.target.value)}
                      />
                      <input
                        className="field"
                        value={inputs[row.key]}
                        onChange={(event) => handleInputChange(row.key, event.target.value)}
                        placeholder="#635bff"
                        aria-invalid={Boolean(colorErrors[row.key])}
                      />
                    </div>
                    {colorErrors[row.key] ? (
                      <p className="text-sm text-rose-600">{colorErrors[row.key]}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1rem] border border-app-border bg-app-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-app-foreground">Advanced color inputs</p>
              <p className="mt-1 text-xs text-app-muted">
                Override generated supporting palettes and add custom named colors.
              </p>
            </div>
            <button
              type="button"
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                inputs.advancedPaletteInputs ? "bg-app-accent text-white" : "border border-app-border text-app-muted"
              }`}
              onClick={() => setInputs((current) => ({ ...current, advancedPaletteInputs: !current.advancedPaletteInputs }))}
            >
              {inputs.advancedPaletteInputs ? "Enabled" : "Enable"}
            </button>
          </div>

          {inputs.advancedPaletteInputs ? (
            <div className="mt-4 space-y-4">
              {ADVANCED_PALETTE_ROWS.map((row) => (
                <div key={row.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-app-foreground">{row.label}</label>
                    <span className="text-xs text-app-muted">{row.helper}</span>
                  </div>
                  <div className="grid grid-cols-[56px_1fr] gap-3">
                    <input
                      type="color"
                      aria-label={`${row.label} override picker`}
                      className="h-12 w-14 cursor-pointer rounded-2xl border border-app-border bg-transparent p-1"
                      value={isValidHex(inputs.paletteOverrides[row.key] ?? "") ? normalizeHex(inputs.paletteOverrides[row.key] ?? "", "#000000") : "#000000"}
                      onChange={(event) => handlePaletteOverrideChange(row.key, event.target.value)}
                    />
                    <input
                      className="field"
                      value={inputs.paletteOverrides[row.key] ?? ""}
                      onChange={(event) => handlePaletteOverrideChange(row.key, event.target.value)}
                      placeholder={`Override ${row.label.toLowerCase()} hex`}
                      aria-invalid={Boolean(colorErrors[`paletteOverrides.${row.key}`])}
                    />
                  </div>
                  {colorErrors[`paletteOverrides.${row.key}`] ? (
                    <p className="text-sm text-rose-600">{colorErrors[`paletteOverrides.${row.key}`]}</p>
                  ) : null}
                </div>
              ))}

              <div className="rounded-[0.95rem] border border-dashed border-app-border px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-app-foreground">Custom colors</p>
                    <p className="mt-1 text-xs text-app-muted">Add named palettes that can be used later in tokens and recipes.</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-app-bg px-3 py-2 text-xs font-semibold text-app-foreground"
                    onClick={addCustomColor}
                  >
                    Add color
                  </button>
                </div>

                {inputs.customColors.length ? (
                  <div className="mt-4 space-y-4">
                    {inputs.customColors.map((color, index) => (
                      <div key={color.id} className="rounded-[0.95rem] border border-app-border/70 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-app-foreground">Custom color {index + 1}</p>
                          <button
                            type="button"
                            className="text-xs font-medium text-rose-600"
                            onClick={() => removeCustomColor(color.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 grid gap-3">
                          <input
                            className="field"
                            value={color.name}
                            onChange={(event) => updateCustomColor(color.id, { name: event.target.value })}
                            placeholder="Color name"
                            aria-invalid={Boolean(colorErrors[`customColors.${color.id}.name`])}
                          />
                          <div className="grid grid-cols-[56px_1fr] gap-3">
                            <input
                              type="color"
                              aria-label={`Custom color ${index + 1} picker`}
                              className="h-12 w-14 cursor-pointer rounded-[0.9rem] border border-app-border bg-transparent p-1"
                              value={isValidHex(color.hex) ? normalizeHex(color.hex, "#000000") : "#000000"}
                              onChange={(event) => updateCustomColor(color.id, { hex: event.target.value })}
                            />
                            <input
                              className="field"
                              value={color.hex}
                              onChange={(event) => updateCustomColor(color.id, { hex: event.target.value })}
                              placeholder="#7c3aed"
                              aria-invalid={Boolean(colorErrors[`customColors.${color.id}.hex`])}
                            />
                          </div>
                          {colorErrors[`customColors.${color.id}.name`] ? (
                            <p className="text-sm text-rose-600">{colorErrors[`customColors.${color.id}.name`]}</p>
                          ) : null}
                          {colorErrors[`customColors.${color.id}.hex`] ? (
                            <p className="text-sm text-rose-600">{colorErrors[`customColors.${color.id}.hex`]}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-app-muted">No custom colors added yet.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
          </>
        ) : null}

        {activeTab === "assets" ? (
          <>
            <div className="workspace-card space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">Typography</p>
                <p className="mt-2 text-sm text-app-muted">Pick display, heading, and body fonts that drive the live preview and export.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-app-foreground">Display font</span>
                  <select
                    className="field"
                    value={inputs.displayFont}
                    onChange={(event) => handleInputChange("displayFont", event.target.value)}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-app-foreground">Heading font</span>
                  <select
                    className="field"
                    value={inputs.headingFont}
                    onChange={(event) => handleInputChange("headingFont", event.target.value)}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-app-foreground">Body font</span>
                  <select
                    className="field"
                    value={inputs.bodyFont}
                    onChange={(event) => handleInputChange("bodyFont", event.target.value)}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="workspace-card space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">Logo</p>
                <p className="mt-2 text-sm text-app-muted">Upload a logo used across the realistic preview screens.</p>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[0.95rem] border border-dashed border-app-border bg-app-surface px-4 py-4">
                <div>
                  <p className="font-medium text-app-foreground">PNG, SVG, or JPG</p>
                  <p className="mt-1 text-sm text-app-muted">Used inside all preview templates.</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-app-accent-soft text-app-accent">
                  <Upload className="h-4 w-4" />
                </span>
                <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function PreviewPanel({
  brandName,
  logoDataUrl,
  system,
  previewMode,
  setPreviewMode,
  activeTheme,
  setActiveTheme,
  contrastWarnings,
  qualityScore,
  exportReadiness,
}: {
  brandName: string;
  logoDataUrl: string | null;
  system: GeneratedSystem;
  previewMode: PreviewMode;
  setPreviewMode: Dispatch<SetStateAction<PreviewMode>>;
  activeTheme: ActiveTheme;
  setActiveTheme: Dispatch<SetStateAction<ActiveTheme>>;
  contrastWarnings: string[];
  qualityScore: number;
  exportReadiness: "ready" | "review" | "risky";
}) {
  const previewStyle = useMemo(() => createPreviewStyle(system, activeTheme), [system, activeTheme]);
  const previewMetrics = getPreviewMetrics(system, previewMode);

  return (
    <div className="space-y-4">
      <div className="panel rounded-[1.25rem] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Live Preview</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-app-foreground">Preview the full product system</h2>
            <p className="mt-2 text-sm text-app-muted">
              QA score {qualityScore}/100 - export posture {exportReadiness}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-app-border bg-app-surface p-1">
            <button
              type="button"
              className={`rounded-full px-3 py-2 text-sm ${activeTheme === "light" ? "bg-app-accent text-white" : "text-app-muted"}`}
              onClick={() => setActiveTheme("light")}
            >
              <SunMedium className="mr-2 inline h-4 w-4" />
              Light
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-2 text-sm ${activeTheme === "dark" ? "bg-app-foreground text-white" : "text-app-muted"}`}
              onClick={() => setActiveTheme("dark")}
            >
              <MoonStar className="mr-2 inline h-4 w-4" />
              Dark
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {PREVIEW_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className="rounded-full border border-app-border px-3 py-2 text-sm text-app-muted transition-colors hover:text-app-foreground"
              data-active={previewMode === mode}
              onClick={() => setPreviewMode(mode)}
            >
              {sectionLabel(mode)}
            </button>
          ))}
        </div>

        {contrastWarnings.length ? (
          <div className="mt-4 rounded-[1.1rem] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Contrast needs attention</p>
            <p className="mt-1">{contrastWarnings.join(" ")}</p>
          </div>
        ) : null}
      </div>

      <div className="preview-shell panel overflow-hidden rounded-[1.5rem]" style={previewStyle}>
        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: "var(--preview-border-default)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[var(--preview-surface-elevated)]">
              {logoDataUrl ? (
                <Image src={logoDataUrl} alt={`${brandName} logo`} width={44} height={44} className="h-full w-full object-cover" />
              ) : (
                <Sparkles className="h-5 w-5 text-[var(--preview-action-primary)]" />
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--preview-text-muted)" }}>
                {activeTheme} theme
              </p>
              <p className="preview-heading text-lg font-semibold">{brandName}</p>
            </div>
          </div>

          <div className="rounded-full px-3 py-1 text-xs preview-badge">{sectionLabel(previewMode)}</div>
        </div>

        <div className="max-h-[calc(100vh-15rem)] overflow-auto" style={{ padding: previewMetrics.chromePadding }}>
          <div style={{ maxWidth: previewMetrics.maxWidth, marginInline: "auto", width: "100%" }}>
            {previewMode === "foundations" ? (
              <FoundationsPreview system={system} />
            ) : previewMode === "ui-kit" ? (
              <UIKitPreview system={system} />
            ) : previewMode === "components" ? (
              <ComponentsPreview system={system} />
            ) : previewMode === "icons" ? (
              <IconsPreview system={system} />
            ) : previewMode === "dashboard" ? (
              <DashboardPreview brandName={brandName} system={system} />
            ) : (
              <MarketingPreview brandName={brandName} system={system} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenPanel({
  setInputs,
  system,
  setSystem,
  brandName,
}: {
  setInputs: Dispatch<SetStateAction<BrandInputs>>;
  system: GeneratedSystem;
  setSystem: Dispatch<SetStateAction<GeneratedSystem>>;
  brandName: string;
}) {
  const [activeTab, setActiveTab] = useState<EditorPanelTab>("foundations");
  const tokenOptions = useMemo(() => tokenReferenceOptions(system), [system]);

  function updatePaletteValue(palette: string, step: ScaleStep, value: string) {
    setSystem((current) => ({
      ...current,
      palettes: {
        ...current.palettes,
        [palette]: {
          ...current.palettes[palette],
          [step]: value,
        },
      },
    }));
  }

  function updateThemeToken(theme: "lightTokens" | "darkTokens", token: SemanticTokenName, value: TokenReference) {
    setSystem((current) => ({
      ...current,
      [theme]: {
        ...current[theme],
        [token]: value,
      },
    }));
  }

  function updateComponent<K extends keyof GeneratedSystem["components"]>(
    key: K,
    patch: Partial<GeneratedSystem["components"][K]>,
  ) {
    setSystem((current) => ({
      ...current,
      components: {
        ...current.components,
        [key]: {
          ...current.components[key],
          ...patch,
        },
      },
    }));
  }

  function updateUtilityCoverage(
    family: keyof GeneratedSystem["utilityCoverage"],
    patch: Partial<GeneratedSystem["utilityCoverage"][keyof GeneratedSystem["utilityCoverage"]]>,
  ) {
    setSystem((current) => ({
      ...current,
      utilityCoverage: {
        ...current.utilityCoverage,
        [family]: {
          ...current.utilityCoverage[family],
          ...patch,
        },
      },
    }));
  }

  function updateScreenPreset(
    preset: keyof GeneratedSystem["screens"],
    patch: Partial<GeneratedSystem["screens"][keyof GeneratedSystem["screens"]]>,
  ) {
    setSystem((current) => ({
      ...current,
      screens: {
        ...current.screens,
        [preset]: {
          ...current.screens[preset],
          ...patch,
        },
      },
    }));
  }

  function exportFile(type: "tokens" | "components" | "theme" | "tailwind" | "readme" | "session") {
    if (type === "tokens") {
      downloadTextFile("tokens.json", buildTokensJson(system, brandName), "application/json");
      return;
    }

    if (type === "components") {
      downloadTextFile("components.json", buildComponentsJson(system, brandName), "application/json");
      return;
    }

    if (type === "theme") {
      downloadTextFile("theme.css", buildThemeCss(system), "text/css");
      return;
    }

    if (type === "tailwind") {
      downloadTextFile("tailwind-theme.css", buildTailwindThemeCss(system), "text/css");
      return;
    }

    if (type === "session") {
      downloadTextFile(
        "design-system-session.json",
        buildSessionJson(system, brandName),
        "application/json",
      );
      return;
    }

    downloadTextFile("README.md", buildReadme(system, brandName), "text/markdown");
  }

  function importSession(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      try {
        const parsed = JSON.parse(reader.result) as { inputs?: BrandInputs; system?: GeneratedSystem };

        if (parsed.inputs) {
          setInputs(parsed.inputs);
        }

        if (parsed.system) {
          setSystem(parsed.system);
        }
      } catch {
        // Keep MVP simple; invalid files are ignored.
      }
    };
    reader.readAsText(file);
  }

  async function exportZip() {
    const blob = await buildZip(system, brandName);
    downloadBlob(`${brandName.toLowerCase().replace(/\s+/g, "-") || "design-system"}-tokens.zip`, blob);
  }

  const qaReport = useMemo(() => auditSystem(system), [system]);

  return (
    <div className="panel sticky top-5 rounded-[1.25rem]">
      <div className="border-b border-app-border/70 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Editable Tokens</p>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-app-foreground">Tune before export</h2>
        <p className="mt-2 text-sm leading-6 text-app-muted">
          Adjust raw scales, semantic token mappings, typography, radius, shadows, and export production-ready assets.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {([
            ["foundations", "Foundations"],
            ["system", "System"],
            ["components", "Components"],
            ["handoff", "QA & Export"],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              className="workspace-tab"
              data-active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[calc(100vh-4rem)] space-y-5 overflow-auto px-5 py-5">
        {activeTab === "foundations" ? (
          <div className="workspace-card space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">Foundations</p>
            <p className="text-sm text-app-muted">Edit the raw scales, Tailwind namespaces, semantic mappings, and design tokens that everything else builds on.</p>
          </div>
        ) : null}
        {activeTab === "system" ? (
          <div className="workspace-card space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">System</p>
            <p className="text-sm text-app-muted">Tune utility defaults, coverage, and screen presets that shape how the system behaves across products.</p>
          </div>
        ) : null}
        {activeTab === "components" ? (
          <div className="workspace-card space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">Components</p>
            <p className="text-sm text-app-muted">Control structural recipes and direct component colors without leaving the live workspace.</p>
          </div>
        ) : null}
        {activeTab === "handoff" ? (
          <div className="workspace-card space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-muted">QA and handoff</p>
            <p className="text-sm text-app-muted">Validate the system, save your session, and export production-ready assets from one place.</p>
          </div>
        ) : null}

        {activeTab === "foundations" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Palette className="h-4 w-4" /> Raw color scales</span>
          </summary>
          <div className="space-y-5 border-t border-app-border/70 px-4 py-4">
            {Object.entries(system.palettes).map(([paletteName, paletteScale]) => (
              <div key={paletteName} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-app-foreground">{sectionLabel(paletteName)}</h3>
                  <div className="flex gap-1">
                    {SCALE_STEPS.slice(0, 5).map((step) => (
                      <span
                        key={step}
                        className="h-5 w-5 rounded-full border border-white/70"
                        style={{ background: paletteScale[step] }}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SCALE_STEPS.map((step) => (
                    <label key={step} className="space-y-1 text-xs text-app-muted">
                      <span>{step}</span>
                      <input
                        className="field px-3 py-2 text-sm"
                        value={paletteScale[step]}
                        onChange={(event) => updatePaletteValue(paletteName, step, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
        ) : null}

        {activeTab === "foundations" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4" /> Tailwind foundations</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="workspace-card space-y-3">
              <div>
                <p className="text-sm font-semibold text-app-foreground">Spacing and radius</p>
                <p className="mt-1 text-xs text-app-muted">These core primitives feed utility settings, component recipes, and exported theme variables.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(system.foundations.spacing).map(([key, value]) => (
                  <label key={`spacing-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Spacing {key}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        spacing: { ...current.foundations.spacing, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(system.radius).map(([key, value]) => (
                  <label key={`radius-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Radius {key.toUpperCase()}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      radius: { ...current.radius, [key]: event.target.value },
                    }))} />
                  </label>
                ))}
              </div>
            </div>

            <div className="workspace-card space-y-3">
              <div>
                <p className="text-sm font-semibold text-app-foreground">Typography primitives</p>
                <p className="mt-1 text-xs text-app-muted">Weights, tracking, and leading are shared by typography scale tokens and component primitives.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(system.foundations.fontWeights).map(([key, value]) => (
                  <label key={`weight-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Weight {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        fontWeights: { ...current.foundations.fontWeights, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.tracking).map(([key, value]) => (
                  <label key={`tracking-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Tracking {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        tracking: { ...current.foundations.tracking, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.leading).map(([key, value]) => (
                  <label key={`leading-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Leading {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        leading: { ...current.foundations.leading, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
              </div>
            </div>

            <div className="workspace-card space-y-3">
              <div>
                <p className="text-sm font-semibold text-app-foreground">Layout and containers</p>
                <p className="mt-1 text-xs text-app-muted">Tailwind breakpoints, max-widths, and aspect ratios define how previews and exports scale across layouts.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(system.foundations.breakpoints).map(([key, value]) => (
                  <label key={`breakpoint-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Breakpoint {key}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        breakpoints: { ...current.foundations.breakpoints, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.containers).map(([key, value]) => (
                  <label key={`container-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Container {key}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        containers: { ...current.foundations.containers, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.aspectRatios).map(([key, value]) => (
                  <label key={`aspect-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Aspect {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        aspectRatios: { ...current.foundations.aspectRatios, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
              </div>
            </div>

            <div className="workspace-card space-y-3">
              <div>
                <p className="text-sm font-semibold text-app-foreground">Visual system primitives</p>
                <p className="mt-1 text-xs text-app-muted">Border widths, opacity, motion duration, and stacking now behave like first-class foundations instead of scattered presets.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(system.foundations.borderWidths).map(([key, value]) => (
                  <label key={`border-width-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Border width {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        borderWidths: { ...current.foundations.borderWidths, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.opacity).map(([key, value]) => (
                  <label key={`opacity-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Opacity {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        opacity: { ...current.foundations.opacity, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.durations).map(([key, value]) => (
                  <label key={`duration-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Duration {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        durations: { ...current.foundations.durations, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.zIndex).map(([key, value]) => (
                  <label key={`z-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Z-index {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        zIndex: { ...current.foundations.zIndex, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
              </div>
            </div>

            <div className="workspace-card space-y-3">
              <div>
                <p className="text-sm font-semibold text-app-foreground">Depth and motion</p>
                <p className="mt-1 text-xs text-app-muted">Shadows, blur, easing, and animations shape the app feel before component-level adjustments.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(system.shadows).map(([key, value]) => (
                  <label key={`shadow-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Shadow {key.toUpperCase()}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      shadows: { ...current.shadows, [key]: event.target.value },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.insetShadows).map(([key, value]) => (
                  <label key={`inset-shadow-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Inset shadow {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        insetShadows: { ...current.foundations.insetShadows, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.dropShadows).map(([key, value]) => (
                  <label key={`drop-shadow-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Drop shadow {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        dropShadows: { ...current.foundations.dropShadows, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.blur).map(([key, value]) => (
                  <label key={`blur-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Blur {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        blur: { ...current.foundations.blur, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.easing).map(([key, value]) => (
                  <label key={`ease-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Easing {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        easing: { ...current.foundations.easing, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
                {Object.entries(system.foundations.animations).map(([key, value]) => (
                  <label key={`animation-${key}`} className="space-y-1 text-xs text-app-muted">
                    <span>Animation {sectionLabel(key)}</span>
                    <input className="field px-3 py-2 text-sm" value={value} onChange={(event) => setSystem((current) => ({
                      ...current,
                      foundations: {
                        ...current.foundations,
                        animations: { ...current.foundations.animations, [key]: event.target.value },
                      },
                    }))} />
                  </label>
                ))}
              </div>
            </div>

            <div className="workspace-card space-y-3">
              <div>
                <p className="text-sm font-semibold text-app-foreground">Content and accessibility rules</p>
                <p className="mt-1 text-xs text-app-muted">Link behavior, lists, code styling, truncation, and baseline accessibility rules now live with the rest of the foundations.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Link underline</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.links.underline} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        links: { ...current.foundations.content.links, underline: event.target.value as typeof current.foundations.content.links.underline },
                      },
                    },
                  }))}>
                    <option value="always">Always</option>
                    <option value="hover">Hover</option>
                    <option value="never">Never</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Link weight</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.links.weight} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        links: { ...current.foundations.content.links, weight: event.target.value as typeof current.foundations.content.links.weight },
                      },
                    },
                  }))}>
                    {Object.keys(system.foundations.fontWeights).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Link tone</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.links.tone} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        links: { ...current.foundations.content.links, tone: event.target.value as typeof current.foundations.content.links.tone },
                      },
                    },
                  }))}>
                    <option value="brand">Brand</option>
                    <option value="foreground">Foreground</option>
                    <option value="muted">Muted</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>List marker</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.lists.marker} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        lists: { ...current.foundations.content.lists, marker: event.target.value as typeof current.foundations.content.lists.marker },
                      },
                    },
                  }))}>
                    <option value="disc">Disc</option>
                    <option value="decimal">Decimal</option>
                    <option value="dash">Dash</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>List gap</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.lists.gap} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        lists: { ...current.foundations.content.lists, gap: event.target.value as typeof current.foundations.content.lists.gap },
                      },
                    },
                  }))}>
                    {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>List indent</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.lists.indent} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        lists: { ...current.foundations.content.lists, indent: event.target.value as typeof current.foundations.content.lists.indent },
                      },
                    },
                  }))}>
                    {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Code scale</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.code.fontScale} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        code: { ...current.foundations.content.code, fontScale: event.target.value as typeof current.foundations.content.code.fontScale },
                      },
                    },
                  }))}>
                    {Object.keys(system.typography.scale).map((key) => <option key={key} value={key}>{sectionLabel(key)}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Code radius</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.code.radius} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        code: { ...current.foundations.content.code, radius: event.target.value as typeof current.foundations.content.code.radius },
                      },
                    },
                  }))}>
                    {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Single-line truncation</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.truncation.singleLine ? "yes" : "no"} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        truncation: { ...current.foundations.content.truncation, singleLine: event.target.value === "yes" },
                      },
                    },
                  }))}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Multi-line clamp</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.truncation.multiLineClamp} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        truncation: { ...current.foundations.content.truncation, multiLineClamp: event.target.value as typeof current.foundations.content.truncation.multiLineClamp },
                      },
                    },
                  }))}>
                    <option value="2">2 lines</option>
                    <option value="3">3 lines</option>
                    <option value="4">4 lines</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Truncation width</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.content.truncation.maxInlineSize} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      content: {
                        ...current.foundations.content,
                        truncation: { ...current.foundations.content.truncation, maxInlineSize: event.target.value as typeof current.foundations.content.truncation.maxInlineSize },
                      },
                    },
                  }))}>
                    {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Contrast target</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.accessibility.contrastTarget} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      accessibility: { ...current.foundations.accessibility, contrastTarget: event.target.value as typeof current.foundations.accessibility.contrastTarget },
                    },
                  }))}>
                    <option value="AA">AA</option>
                    <option value="AAA">AAA</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Focus treatment</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.accessibility.focusTreatment} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      accessibility: { ...current.foundations.accessibility, focusTreatment: event.target.value as typeof current.foundations.accessibility.focusTreatment },
                    },
                  }))}>
                    <option value="soft">Soft</option>
                    <option value="brand">Brand</option>
                    <option value="high-contrast">High contrast</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Keyboard pattern</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.accessibility.keyboardPattern} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      accessibility: { ...current.foundations.accessibility, keyboardPattern: event.target.value as typeof current.foundations.accessibility.keyboardPattern },
                    },
                  }))}>
                    <option value="standard">Standard</option>
                    <option value="enhanced">Enhanced</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Touch target minimum</span>
                  <select className="field px-3 py-2 text-sm" value={system.foundations.accessibility.touchTargetMin} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      accessibility: { ...current.foundations.accessibility, touchTargetMin: event.target.value as typeof current.foundations.accessibility.touchTargetMin },
                    },
                  }))}>
                    {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted sm:col-span-2">
                  <span>Screen reader label prefix</span>
                  <input className="field px-3 py-2 text-sm" value={system.foundations.accessibility.screenReaderLabelPrefix} onChange={(event) => setSystem((current) => ({
                    ...current,
                    foundations: {
                      ...current.foundations,
                      accessibility: { ...current.foundations.accessibility, screenReaderLabelPrefix: event.target.value },
                    },
                  }))} />
                </label>
              </div>
            </div>
          </div>
        </details>
        ) : null}

        {activeTab === "components" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Icon system</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Default icon size</span>
                <input
                  className="field px-3 py-2 text-sm"
                  type="number"
                  min={12}
                  max={48}
                  value={system.icons.defaultSize}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    icons: { ...current.icons, defaultSize: Number(event.target.value || 20) },
                  }))}
                />
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stroke width</span>
                <input
                  className="field px-3 py-2 text-sm"
                  type="number"
                  min={1}
                  max={3}
                  step={0.1}
                  value={system.icons.strokeWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    icons: { ...current.icons, strokeWidth: Number(event.target.value || 1.7) },
                  }))}
                />
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Color behavior</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.icons.colorBehavior}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    icons: { ...current.icons, colorBehavior: event.target.value as typeof current.icons.colorBehavior },
                  }))}
                >
                  <option value="semantic">Semantic tokens</option>
                  <option value="current">Current context color</option>
                  <option value="muted">Muted icons</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {([
                ["buttons", "Buttons"],
                ["alerts", "Alerts"],
                ["nav", "Navigation"],
                ["tables", "Tables"],
                ["inputs", "Inputs"],
              ] as const).map(([key, label]) => (
                <label key={key} className="space-y-1 text-xs text-app-muted">
                  <span>{label} icon token</span>
                  <select
                    className="field px-3 py-2 text-sm"
                    value={system.icons.semanticUsage[key]}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      icons: {
                        ...current.icons,
                        semanticUsage: {
                          ...current.icons.semanticUsage,
                          [key]: event.target.value as TokenReference,
                        },
                      },
                    }))}
                  >
                    {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </details>
        ) : null}

        {activeTab === "system" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><MonitorCog className="h-4 w-4" /> Utility settings</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Content width</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.layout.contentWidth}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        layout: { ...current.utilities.layout, contentWidth: event.target.value as typeof current.utilities.layout.contentWidth },
                      },
                    }))
                  }
                >
                  {Object.keys(system.foundations.containers).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Default radius</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.layout.defaultRadius}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        layout: { ...current.utilities.layout, defaultRadius: event.target.value as typeof current.utilities.layout.defaultRadius },
                      },
                    }))
                  }
                >
                  {Object.keys(system.radius).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Section gap</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.layout.sectionGap}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        layout: { ...current.utilities.layout, sectionGap: event.target.value as typeof current.utilities.layout.sectionGap },
                      },
                    }))
                  }
                >
                  {Object.keys(system.foundations.spacing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Card gap</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.layout.cardGap}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        layout: { ...current.utilities.layout, cardGap: event.target.value as typeof current.utilities.layout.cardGap },
                      },
                    }))
                  }
                >
                  {Object.keys(system.foundations.spacing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Density mode</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.spacing.densityMode}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        spacing: { ...current.utilities.spacing, densityMode: event.target.value as Density },
                      },
                    }))
                  }
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="airy">Airy</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Inset padding</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.spacing.insetPadding}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        spacing: { ...current.utilities.spacing, insetPadding: event.target.value as typeof current.utilities.spacing.insetPadding },
                      },
                    }))
                  }
                >
                  {Object.keys(system.foundations.spacing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stack gap</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.spacing.stackGap}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        spacing: { ...current.utilities.spacing, stackGap: event.target.value as typeof current.utilities.spacing.stackGap },
                      },
                    }))
                  }
                >
                  {Object.keys(system.foundations.spacing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Inline gap</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.utilities.spacing.inlineGap}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        spacing: { ...current.utilities.spacing, inlineGap: event.target.value as typeof current.utilities.spacing.inlineGap },
                      },
                    }))
                  }
                >
                  {Object.keys(system.foundations.spacing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Control height</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.sizing.controlHeight}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        sizing: { ...current.utilities.sizing, controlHeight: event.target.value as typeof current.utilities.sizing.controlHeight },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.spacing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sidebar width</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.sizing.sidebarWidth}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        sizing: { ...current.utilities.sizing, sidebarWidth: event.target.value as typeof current.utilities.sizing.sidebarWidth },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.containers).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Modal width</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.sizing.modalWidth}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        sizing: { ...current.utilities.sizing, modalWidth: event.target.value as typeof current.utilities.sizing.modalWidth },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.containers).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Heading weight</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.typography.headingWeight}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        typography: { ...current.utilities.typography, headingWeight: event.target.value as typeof current.utilities.typography.headingWeight },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.fontWeights).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Body weight</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.typography.bodyWeight}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        typography: { ...current.utilities.typography, bodyWeight: event.target.value as typeof current.utilities.typography.bodyWeight },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.fontWeights).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Body leading</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.typography.bodyLeading}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        typography: { ...current.utilities.typography, bodyLeading: event.target.value as typeof current.utilities.typography.bodyLeading },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.leading).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Heading tracking</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.typography.headingTracking}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        typography: { ...current.utilities.typography, headingTracking: event.target.value as typeof current.utilities.typography.headingTracking },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.tracking).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Border width</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.borders.borderWidth}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        borders: { ...current.utilities.borders, borderWidth: event.target.value as typeof current.utilities.borders.borderWidth },
                      },
                    }))
                  }>
                  <option value="hairline">Hairline</option>
                  <option value="default">Default</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Outline style</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.borders.outlineStyle}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        borders: { ...current.utilities.borders, outlineStyle: event.target.value as typeof current.utilities.borders.outlineStyle },
                      },
                    }))
                  }>
                  <option value="soft">Soft</option>
                  <option value="brand">Brand</option>
                  <option value="high-contrast">High contrast</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Surface shadow</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.effects.surfaceShadow}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        effects: { ...current.utilities.effects, surfaceShadow: event.target.value as typeof current.utilities.effects.surfaceShadow },
                      },
                    }))
                  }>
                  {Object.keys(system.shadows).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Elevated shadow</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.effects.elevatedShadow}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        effects: { ...current.utilities.effects, elevatedShadow: event.target.value as typeof current.utilities.effects.elevatedShadow },
                      },
                    }))
                  }>
                  {Object.keys(system.shadows).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Surface blur</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.effects.surfaceBlur}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        effects: { ...current.utilities.effects, surfaceBlur: event.target.value as typeof current.utilities.effects.surfaceBlur },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.blur).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Motion level</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.motion.motionLevel}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        motion: { ...current.utilities.motion, motionLevel: event.target.value as typeof current.utilities.motion.motionLevel },
                      },
                    }))
                  }>
                  <option value="calm">Calm</option>
                  <option value="balanced">Balanced</option>
                  <option value="expressive">Expressive</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Transition ease</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.motion.transitionEase}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        motion: { ...current.utilities.motion, transitionEase: event.target.value as typeof current.utilities.motion.transitionEase },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.easing).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Entrance animation</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.motion.entranceAnimation}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        motion: { ...current.utilities.motion, entranceAnimation: event.target.value as typeof current.utilities.motion.entranceAnimation },
                      },
                    }))
                  }>
                  {Object.keys(system.foundations.animations).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Focus ring width</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.interactivity.focusRingWidth}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        interactivity: { ...current.utilities.interactivity, focusRingWidth: event.target.value as typeof current.utilities.interactivity.focusRingWidth },
                      },
                    }))
                  }>
                  <option value="2px">2px</option>
                  <option value="3px">3px</option>
                  <option value="4px">4px</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Selection style</span>
                <select className="field px-3 py-2 text-sm" value={system.utilities.interactivity.selectionStyle}
                  onChange={(event) =>
                    setSystem((current) => ({
                      ...current,
                      utilities: {
                        ...current.utilities,
                        interactivity: { ...current.utilities.interactivity, selectionStyle: event.target.value as typeof current.utilities.interactivity.selectionStyle },
                      },
                    }))
                  }>
                  <option value="brand">Brand</option>
                  <option value="neutral">Neutral</option>
                </select>
              </label>
            </div>
          </div>
        </details>
        ) : null}

        {activeTab === "system" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><MonitorCog className="h-4 w-4" /> Utility coverage</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            {Object.entries(system.utilityCoverage).map(([family, config]) => (
              <div key={family} className="rounded-[1rem] border border-app-border/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-app-foreground">{sectionLabel(family)}</p>
                    <p className="mt-1 text-xs text-app-muted">{config.notes}</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-app-muted">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(event) => updateUtilityCoverage(family as keyof GeneratedSystem["utilityCoverage"], { enabled: event.target.checked })}
                    />
                    Enabled
                  </label>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Coverage mode</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={config.mode}
                      onChange={(event) =>
                        updateUtilityCoverage(family as keyof GeneratedSystem["utilityCoverage"], {
                          mode: event.target.value as typeof config.mode,
                        })}
                    >
                      <option value="token">Token</option>
                      <option value="preset">Preset</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Density-aware</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={config.densityAware ? "yes" : "no"}
                      onChange={(event) =>
                        updateUtilityCoverage(family as keyof GeneratedSystem["utilityCoverage"], {
                          densityAware: event.target.value === "yes",
                        })}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                </div>
                <label className="mt-3 block space-y-1 text-xs text-app-muted">
                  <span>Notes</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={config.notes}
                    onChange={(event) =>
                      updateUtilityCoverage(family as keyof GeneratedSystem["utilityCoverage"], {
                        notes: event.target.value,
                      })}
                  />
                </label>
              </div>
            ))}
          </div>
        </details>
        ) : null}

        {activeTab === "components" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Component recipes</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Button radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, radius: event.target.value as typeof current.components.button.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Button shadow</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.primaryShadow}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, primaryShadow: event.target.value as typeof current.components.button.primaryShadow } },
                  }))}>
                  {Object.keys(system.shadows).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Button padding X</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.paddingX}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, paddingX: event.target.value as typeof current.components.button.paddingX } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Button padding Y</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.paddingY}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, paddingY: event.target.value as typeof current.components.button.paddingY } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Secondary button style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.secondaryStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, secondaryStyle: event.target.value as typeof current.components.button.secondaryStyle } },
                  }))}>
                  <option value="outline">Outline</option>
                  <option value="soft">Soft</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Ghost button style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.ghostStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, ghostStyle: event.target.value as typeof current.components.button.ghostStyle } },
                  }))}>
                  <option value="subtle">Subtle</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Button hover lift</span>
                <select className="field px-3 py-2 text-sm" value={system.components.button.hoverLift}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, button: { ...current.components.button, hoverLift: event.target.value as typeof current.components.button.hoverLift } },
                  }))}>
                  <option value="none">None</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {(["primary", "secondary", "ghost"] as const).map((variant) => (
                <div key={variant} className="grid gap-2 rounded-[1rem] border border-app-border/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">{sectionLabel(variant)} colors</p>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Background</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={system.components.button.colors[variant].background}
                      onChange={(event) =>
                        updateComponent("button", {
                          colors: {
                            ...system.components.button.colors,
                            [variant]: {
                              ...system.components.button.colors[variant],
                              background: event.target.value as TokenReference,
                            },
                          },
                        })}
                    >
                      {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Foreground</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={system.components.button.colors[variant].foreground}
                      onChange={(event) =>
                        updateComponent("button", {
                          colors: {
                            ...system.components.button.colors,
                            [variant]: {
                              ...system.components.button.colors[variant],
                              foreground: event.target.value as TokenReference,
                            },
                          },
                        })}
                    >
                      {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Border</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={system.components.button.colors[variant].border}
                      onChange={(event) =>
                        updateComponent("button", {
                          colors: {
                            ...system.components.button.colors,
                            [variant]: {
                              ...system.components.button.colors[variant],
                              border: event.target.value as TokenReference,
                            },
                          },
                        })}
                    >
                      {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Hover background</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={system.components.button.colors[variant].hoverBackground}
                      onChange={(event) =>
                        updateComponent("button", {
                          colors: {
                            ...system.components.button.colors,
                            [variant]: {
                              ...system.components.button.colors[variant],
                              hoverBackground: event.target.value as TokenReference,
                            },
                          },
                        })}
                    >
                      {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Hover foreground</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={system.components.button.colors[variant].hoverForeground}
                      onChange={(event) =>
                        updateComponent("button", {
                          colors: {
                            ...system.components.button.colors,
                            [variant]: {
                              ...system.components.button.colors[variant],
                              hoverForeground: event.target.value as TokenReference,
                            },
                          },
                        })}
                    >
                      {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Hover border</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={system.components.button.colors[variant].hoverBorder}
                      onChange={(event) =>
                        updateComponent("button", {
                          colors: {
                            ...system.components.button.colors,
                            [variant]: {
                              ...system.components.button.colors[variant],
                              hoverBorder: event.target.value as TokenReference,
                            },
                          },
                        })}
                    >
                      {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                </div>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Input radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, radius: event.target.value as typeof current.components.input.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Input border style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.borderStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, borderStyle: event.target.value as typeof current.components.input.borderStyle } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Validation style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.validationStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, validationStyle: event.target.value as typeof current.components.input.validationStyle } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Input padding X</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.paddingX}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, paddingX: event.target.value as typeof current.components.input.paddingX } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Input padding Y</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.paddingY}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, paddingY: event.target.value as typeof current.components.input.paddingY } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Show helper text</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.showHelperText ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, showHelperText: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Show prefix</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.showPrefix ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, showPrefix: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Show suffix</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.showSuffix ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, showSuffix: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Search style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.searchStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, searchStyle: event.target.value as typeof current.components.input.searchStyle } },
                  }))}>
                  <option value="boxed">Boxed</option>
                  <option value="underline">Underline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Select style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.selectStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, selectStyle: event.target.value as typeof current.components.input.selectStyle } },
                  }))}>
                  <option value="default">Default</option>
                  <option value="quiet">Quiet</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Message layout</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.messageStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, messageStyle: event.target.value as typeof current.components.input.messageStyle } },
                  }))}>
                  <option value="stacked">Stacked</option>
                  <option value="inline">Inline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Read-only style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.input.readOnlyStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, input: { ...current.components.input, readOnlyStyle: event.target.value as typeof current.components.input.readOnlyStyle } },
                  }))}>
                  <option value="muted">Muted</option>
                  <option value="outlined">Outlined</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Search field radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.searchField.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, searchField: { ...current.components.searchField, radius: event.target.value as typeof current.components.searchField.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Search field style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.searchField.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, searchField: { ...current.components.searchField, style: event.target.value as typeof current.components.searchField.style } },
                  }))}>
                  <option value="boxed">Boxed</option>
                  <option value="underline">Underline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Search shortcut</span>
                <select className="field px-3 py-2 text-sm" value={system.components.searchField.showShortcut ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, searchField: { ...current.components.searchField, showShortcut: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Password reveal</span>
                <select className="field px-3 py-2 text-sm" value={system.components.typedField.passwordReveal ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, typedField: { ...current.components.typedField, passwordReveal: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Number controls</span>
                <select className="field px-3 py-2 text-sm" value={system.components.typedField.numberControls}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, typedField: { ...current.components.typedField, numberControls: event.target.value as typeof current.components.typedField.numberControls } },
                  }))}>
                  <option value="inline">Inline</option>
                  <option value="split">Split</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Contact icon</span>
                <select className="field px-3 py-2 text-sm" value={system.components.typedField.contactIcon ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, typedField: { ...current.components.typedField, contactIcon: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>URL preview</span>
                <select className="field px-3 py-2 text-sm" value={system.components.typedField.urlPreview ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, typedField: { ...current.components.typedField, urlPreview: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Date picker density</span>
                <select className="field px-3 py-2 text-sm" value={system.components.datePicker.density}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, datePicker: { ...current.components.datePicker, density: event.target.value as typeof current.components.datePicker.density } },
                  }))}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Show week numbers</span>
                <select className="field px-3 py-2 text-sm" value={system.components.datePicker.showWeekNumbers ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, datePicker: { ...current.components.datePicker, showWeekNumbers: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Date range presets</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dateRangePicker.presetStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dateRangePicker: { ...current.components.dateRangePicker, presetStyle: event.target.value as typeof current.components.dateRangePicker.presetStyle } },
                  }))}>
                  <option value="chips">Chips</option>
                  <option value="inline">Inline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Comparison range</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dateRangePicker.showComparison ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dateRangePicker: { ...current.components.dateRangePicker, showComparison: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Time format</span>
                <select className="field px-3 py-2 text-sm" value={system.components.timePicker.format}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, timePicker: { ...current.components.timePicker, format: event.target.value as typeof current.components.timePicker.format } },
                  }))}>
                  <option value="12h">12h</option>
                  <option value="24h">24h</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Time step</span>
                <select className="field px-3 py-2 text-sm" value={system.components.timePicker.step}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, timePicker: { ...current.components.timePicker, step: event.target.value as typeof current.components.timePicker.step } },
                  }))}>
                  <option value="15m">15 min</option>
                  <option value="30m">30 min</option>
                  <option value="60m">60 min</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Textarea radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.textarea.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, textarea: { ...current.components.textarea, radius: event.target.value as typeof current.components.textarea.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Textarea min height</span>
                <select className="field px-3 py-2 text-sm" value={system.components.textarea.minHeight}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, textarea: { ...current.components.textarea, minHeight: event.target.value as typeof current.components.textarea.minHeight } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Textarea padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.textarea.padding}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, textarea: { ...current.components.textarea, padding: event.target.value as typeof current.components.textarea.padding } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.badge.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, badge: { ...current.components.badge, radius: event.target.value as typeof current.components.badge.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.badge.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, badge: { ...current.components.badge, style: event.target.value as typeof current.components.badge.style } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="solid">Solid</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge padding X</span>
                <select className="field px-3 py-2 text-sm" value={system.components.badge.paddingX}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, badge: { ...current.components.badge, paddingX: event.target.value as typeof current.components.badge.paddingX } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge padding Y</span>
                <select className="field px-3 py-2 text-sm" value={system.components.badge.paddingY}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, badge: { ...current.components.badge, paddingY: event.target.value as typeof current.components.badge.paddingY } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge background</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.components.badge.color.background}
                  onChange={(event) =>
                    updateComponent("badge", {
                      color: { ...system.components.badge.color, background: event.target.value as TokenReference },
                    })}
                >
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge foreground</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.components.badge.color.foreground}
                  onChange={(event) =>
                    updateComponent("badge", {
                      color: { ...system.components.badge.color, foreground: event.target.value as TokenReference },
                    })}
                >
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Badge border</span>
                <select
                  className="field px-3 py-2 text-sm"
                  value={system.components.badge.color.border}
                  onChange={(event) =>
                    updateComponent("badge", {
                      color: { ...system.components.badge.color, border: event.target.value as TokenReference },
                    })}
                >
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Alert radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.alert.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, alert: { ...current.components.alert, radius: event.target.value as typeof current.components.alert.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Alert emphasis</span>
                <select className="field px-3 py-2 text-sm" value={system.components.alert.emphasis}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, alert: { ...current.components.alert, emphasis: event.target.value as typeof current.components.alert.emphasis } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Alert variant style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.alert.variantStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, alert: { ...current.components.alert, variantStyle: event.target.value as typeof current.components.alert.variantStyle } },
                  }))}>
                  <option value="tinted">Tinted</option>
                  <option value="outlined">Outlined</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Alert padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.alert.padding}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, alert: { ...current.components.alert, padding: event.target.value as typeof current.components.alert.padding } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {(["success", "warning", "danger", "info", "attention"] as const).map((tone) => (
                <label key={tone} className="space-y-1 text-xs text-app-muted">
                  <span>{sectionLabel(tone)} alert color</span>
                  <select
                    className="field px-3 py-2 text-sm"
                    value={system.components.alert.colors[tone]}
                    onChange={(event) =>
                      updateComponent("alert", {
                        colors: {
                          ...system.components.alert.colors,
                          [tone]: event.target.value as TokenReference,
                        },
                      })}
                  >
                    {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tag radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tag.radius}
                  onChange={(event) => updateComponent("tag", { radius: event.target.value as typeof system.components.tag.radius })}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tag style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tag.style}
                  onChange={(event) => updateComponent("tag", { style: event.target.value as typeof system.components.tag.style })}>
                  <option value="soft">Soft</option>
                  <option value="outline">Outline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tag background</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tag.color.background}
                  onChange={(event) => updateComponent("tag", { color: { ...system.components.tag.color, background: event.target.value as TokenReference } })}>
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tag foreground</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tag.color.foreground}
                  onChange={(event) => updateComponent("tag", { color: { ...system.components.tag.color, foreground: event.target.value as TokenReference } })}>
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tag border</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tag.color.border}
                  onChange={(event) => updateComponent("tag", { color: { ...system.components.tag.color, border: event.target.value as TokenReference } })}>
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Status dot size</span>
                <select className="field px-3 py-2 text-sm" value={system.components.statusDot.size}
                  onChange={(event) => updateComponent("statusDot", { size: event.target.value as typeof system.components.statusDot.size })}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Status dot style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.statusDot.style}
                  onChange={(event) => updateComponent("statusDot", { style: event.target.value as typeof system.components.statusDot.style })}>
                  <option value="soft">Soft</option>
                  <option value="solid">Solid</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Banner radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.banner.radius}
                  onChange={(event) => updateComponent("banner", { radius: event.target.value as typeof system.components.banner.radius })}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Banner style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.banner.style}
                  onChange={(event) => updateComponent("banner", { style: event.target.value as typeof system.components.banner.style })}>
                  <option value="soft">Soft</option>
                  <option value="outlined">Outlined</option>
                  <option value="solid">Solid</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Banner padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.banner.padding}
                  onChange={(event) => updateComponent("banner", { padding: event.target.value as typeof system.components.banner.padding })}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Banner color</span>
                <select className="field px-3 py-2 text-sm" value={system.components.banner.color}
                  onChange={(event) => updateComponent("banner", { color: event.target.value as TokenReference })}>
                  {tokenOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Toast radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.toast.radius}
                  onChange={(event) => updateComponent("toast", { radius: event.target.value as typeof system.components.toast.radius })}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Toast shadow</span>
                <select className="field px-3 py-2 text-sm" value={system.components.toast.shadow}
                  onChange={(event) => updateComponent("toast", { shadow: event.target.value as typeof system.components.toast.shadow })}>
                  {Object.keys(system.shadows).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Toast tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.toast.tone}
                  onChange={(event) => updateComponent("toast", { tone: event.target.value as typeof system.components.toast.tone })}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Toast placement</span>
                <select className="field px-3 py-2 text-sm" value={system.components.toast.placement}
                  onChange={(event) => updateComponent("toast", { placement: event.target.value as typeof system.components.toast.placement })}>
                  <option value="stacked">Stacked</option>
                  <option value="floating">Floating</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Progress height</span>
                <select className="field px-3 py-2 text-sm" value={system.components.progress.height}
                  onChange={(event) => updateComponent("progress", { height: event.target.value as typeof system.components.progress.height })}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Progress tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.progress.tone}
                  onChange={(event) => updateComponent("progress", { tone: event.target.value as typeof system.components.progress.tone })}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Progress label</span>
                <select className="field px-3 py-2 text-sm" value={system.components.progress.showLabel ? "yes" : "no"}
                  onChange={(event) => updateComponent("progress", { showLabel: event.target.value === "yes" })}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Loader size</span>
                <select className="field px-3 py-2 text-sm" value={system.components.loader.size}
                  onChange={(event) => updateComponent("loader", { size: event.target.value as typeof system.components.loader.size })}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Loader stroke</span>
                <select className="field px-3 py-2 text-sm" value={system.components.loader.stroke}
                  onChange={(event) => updateComponent("loader", { stroke: event.target.value as typeof system.components.loader.stroke })}>
                  <option value="thin">Thin</option>
                  <option value="regular">Regular</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Loader style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.loader.style}
                  onChange={(event) => updateComponent("loader", { style: event.target.value as typeof system.components.loader.style })}>
                  <option value="spinner">Spinner</option>
                  <option value="orbit">Orbit</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Skeleton line height</span>
                <select className="field px-3 py-2 text-sm" value={system.components.skeleton.lineHeight}
                  onChange={(event) => updateComponent("skeleton", { lineHeight: event.target.value as typeof system.components.skeleton.lineHeight })}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Skeleton shimmer</span>
                <select className="field px-3 py-2 text-sm" value={system.components.skeleton.shimmer}
                  onChange={(event) => updateComponent("skeleton", { shimmer: event.target.value as typeof system.components.skeleton.shimmer })}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>State layout</span>
                <select className="field px-3 py-2 text-sm" value={system.components.state.layout}
                  onChange={(event) => updateComponent("state", { layout: event.target.value as typeof system.components.state.layout })}>
                  <option value="compact">Compact</option>
                  <option value="feature">Feature</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>State icon emphasis</span>
                <select className="field px-3 py-2 text-sm" value={system.components.state.iconEmphasis}
                  onChange={(event) => updateComponent("state", { iconEmphasis: event.target.value as typeof system.components.state.iconEmphasis })}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Table radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.table.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, table: { ...current.components.table, radius: event.target.value as typeof current.components.table.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Table header style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.table.headerStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, table: { ...current.components.table, headerStyle: event.target.value as typeof current.components.table.headerStyle } },
                  }))}>
                  <option value="muted">Muted</option>
                  <option value="elevated">Elevated</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Table density</span>
                <select className="field px-3 py-2 text-sm" value={system.components.table.density}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, table: { ...current.components.table, density: event.target.value as typeof current.components.table.density } },
                  }))}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Cell padding X</span>
                <select className="field px-3 py-2 text-sm" value={system.components.table.cellPaddingX}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, table: { ...current.components.table, cellPaddingX: event.target.value as typeof current.components.table.cellPaddingX } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Cell padding Y</span>
                <select className="field px-3 py-2 text-sm" value={system.components.table.cellPaddingY}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, table: { ...current.components.table, cellPaddingY: event.target.value as typeof current.components.table.cellPaddingY } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Zebra stripes</span>
                <select className="field px-3 py-2 text-sm" value={system.components.table.zebraStripes ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, table: { ...current.components.table, zebraStripes: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, radius: event.target.value as typeof current.components.dialog.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.width}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, width: event.target.value as typeof current.components.dialog.width } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.padding}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, padding: event.target.value as typeof current.components.dialog.padding } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog shadow</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.shadow}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, shadow: event.target.value as typeof current.components.dialog.shadow } },
                  }))}>
                  {Object.keys(system.shadows).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Overlay blur</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.overlayBlur}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, overlayBlur: event.target.value as typeof current.components.dialog.overlayBlur } },
                  }))}>
                  {Object.keys(system.foundations.blur).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Overlay tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.overlayTone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, overlayTone: event.target.value as typeof current.components.dialog.overlayTone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog presentation</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.presentation}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, presentation: event.target.value as typeof current.components.dialog.presentation } },
                  }))}>
                  <option value="modal">Modal</option>
                  <option value="drawer">Drawer</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog placement</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.placement}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, placement: event.target.value as typeof current.components.dialog.placement } },
                  }))}>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dialog mode</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dialog.mode}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dialog: { ...current.components.dialog, mode: event.target.value as typeof current.components.dialog.mode } },
                  }))}>
                  <option value="standard">Standard</option>
                  <option value="alert">Alert dialog</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Breadcrumbs gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.breadcrumbs.gap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, breadcrumbs: { ...current.components.breadcrumbs, gap: event.target.value as typeof current.components.breadcrumbs.gap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Breadcrumbs separator</span>
                <select className="field px-3 py-2 text-sm" value={system.components.breadcrumbs.separatorStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, breadcrumbs: { ...current.components.breadcrumbs, separatorStyle: event.target.value as typeof current.components.breadcrumbs.separatorStyle } },
                  }))}>
                  <option value="chevron">Chevron</option>
                  <option value="slash">Slash</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stepper gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.stepper.gap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, stepper: { ...current.components.stepper, gap: event.target.value as typeof current.components.stepper.gap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stepper style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.stepper.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, stepper: { ...current.components.stepper, style: event.target.value as typeof current.components.stepper.style } },
                  }))}>
                  <option value="line">Line</option>
                  <option value="pill">Pill</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Popover tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.popover.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, popover: { ...current.components.popover, tone: event.target.value as typeof current.components.popover.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Popover shadow</span>
                <select className="field px-3 py-2 text-sm" value={system.components.popover.shadow}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, popover: { ...current.components.popover, shadow: event.target.value as typeof current.components.popover.shadow } },
                  }))}>
                  {Object.keys(system.shadows).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tooltip tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tooltip.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, tooltip: { ...current.components.tooltip, tone: event.target.value as typeof current.components.tooltip.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tooltip padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tooltip.padding}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, tooltip: { ...current.components.tooltip, padding: event.target.value as typeof current.components.tooltip.padding } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>

              <label className="space-y-1 text-xs text-app-muted">
                <span>Checkbox size</span>
                <select className="field px-3 py-2 text-sm" value={system.components.checkbox.size}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, checkbox: { ...current.components.checkbox, size: event.target.value as typeof current.components.checkbox.size } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Checkbox tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.checkbox.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, checkbox: { ...current.components.checkbox, tone: event.target.value as typeof current.components.checkbox.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Switch track width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.switch.trackWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, switch: { ...current.components.switch, trackWidth: event.target.value as typeof current.components.switch.trackWidth } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Switch tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.switch.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, switch: { ...current.components.switch, tone: event.target.value as typeof current.components.switch.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Dropdown radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dropdown.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dropdown: { ...current.components.dropdown, radius: event.target.value as typeof current.components.dropdown.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Combobox radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.combobox.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, combobox: { ...current.components.combobox, radius: event.target.value as typeof current.components.combobox.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Autocomplete radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.autocomplete.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, autocomplete: { ...current.components.autocomplete, radius: event.target.value as typeof current.components.autocomplete.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Autocomplete density</span>
                <select className="field px-3 py-2 text-sm" value={system.components.autocomplete.suggestionDensity}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, autocomplete: { ...current.components.autocomplete, suggestionDensity: event.target.value as typeof current.components.autocomplete.suggestionDensity } },
                  }))}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Autocomplete preview</span>
                <select className="field px-3 py-2 text-sm" value={system.components.autocomplete.showPreview ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, autocomplete: { ...current.components.autocomplete, showPreview: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Date picker radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.datePicker.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, datePicker: { ...current.components.datePicker, radius: event.target.value as typeof current.components.datePicker.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Date range radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dateRangePicker.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dateRangePicker: { ...current.components.dateRangePicker, radius: event.target.value as typeof current.components.dateRangePicker.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Time picker radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.timePicker.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, timePicker: { ...current.components.timePicker, radius: event.target.value as typeof current.components.timePicker.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Upload radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.fileUpload.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, fileUpload: { ...current.components.fileUpload, radius: event.target.value as typeof current.components.fileUpload.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Listbox radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.listbox.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, listbox: { ...current.components.listbox, radius: event.target.value as typeof current.components.listbox.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Multi-select radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.multiSelect.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, multiSelect: { ...current.components.multiSelect, radius: event.target.value as typeof current.components.multiSelect.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Multi-select tag style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.multiSelect.tagStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, multiSelect: { ...current.components.multiSelect, tagStyle: event.target.value as typeof current.components.multiSelect.tagStyle } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="outline">Outline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Multi-select max visible</span>
                <select className="field px-3 py-2 text-sm" value={String(system.components.multiSelect.maxVisible)}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, multiSelect: { ...current.components.multiSelect, maxVisible: Number(event.target.value) as typeof current.components.multiSelect.maxVisible } },
                  }))}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Upload style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.fileUpload.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, fileUpload: { ...current.components.fileUpload, style: event.target.value as typeof current.components.fileUpload.style } },
                  }))}>
                  <option value="dropzone">Dropzone</option>
                  <option value="inline">Inline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Upload preview</span>
                <select className="field px-3 py-2 text-sm" value={system.components.fileUpload.showPreview ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, fileUpload: { ...current.components.fileUpload, showPreview: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Upload drag state</span>
                <select className="field px-3 py-2 text-sm" value={system.components.fileUpload.dragState}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, fileUpload: { ...current.components.fileUpload, dragState: event.target.value as typeof current.components.fileUpload.dragState } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Slider value label</span>
                <select className="field px-3 py-2 text-sm" value={system.components.slider.showValue ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, slider: { ...current.components.slider, showValue: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Slider ticks</span>
                <select className="field px-3 py-2 text-sm" value={system.components.slider.showTicks ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, slider: { ...current.components.slider, showTicks: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Range slider inputs</span>
                <select className="field px-3 py-2 text-sm" value={system.components.rangeSlider.showInputs ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, rangeSlider: { ...current.components.rangeSlider, showInputs: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Slider thumb size</span>
                <select className="field px-3 py-2 text-sm" value={system.components.slider.thumbSize}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, slider: { ...current.components.slider, thumbSize: event.target.value as typeof current.components.slider.thumbSize } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Range slider values</span>
                <select className="field px-3 py-2 text-sm" value={system.components.rangeSlider.showValues ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, rangeSlider: { ...current.components.rangeSlider, showValues: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Data grid density</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dataGrid.density}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dataGrid: { ...current.components.dataGrid, density: event.target.value as typeof current.components.dataGrid.density } },
                  }))}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Data grid selection</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dataGrid.selectionStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dataGrid: { ...current.components.dataGrid, selectionStyle: event.target.value as typeof current.components.dataGrid.selectionStyle } },
                  }))}>
                  <option value="checkbox">Checkbox</option>
                  <option value="row">Row</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sticky grid header</span>
                <select className="field px-3 py-2 text-sm" value={system.components.dataGrid.stickyHeader ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, dataGrid: { ...current.components.dataGrid, stickyHeader: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Command palette density</span>
                <select className="field px-3 py-2 text-sm" value={system.components.commandPalette.density}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, commandPalette: { ...current.components.commandPalette, density: event.target.value as typeof current.components.commandPalette.density } },
                  }))}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Command shortcuts</span>
                <select className="field px-3 py-2 text-sm" value={system.components.commandPalette.showShortcuts ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, commandPalette: { ...current.components.commandPalette, showShortcuts: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Command preview pane</span>
                <select className="field px-3 py-2 text-sm" value={system.components.commandPalette.previewPane ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, commandPalette: { ...current.components.commandPalette, previewPane: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Pagination radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.pagination.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, pagination: { ...current.components.pagination, radius: event.target.value as typeof current.components.pagination.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tabs radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tabs.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, tabs: { ...current.components.tabs, radius: event.target.value as typeof current.components.tabs.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tabs active style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tabs.activeStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, tabs: { ...current.components.tabs, activeStyle: event.target.value as typeof current.components.tabs.activeStyle } },
                  }))}>
                  <option value="pill">Pill</option>
                  <option value="underline">Underline</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Tabs tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.tabs.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, tabs: { ...current.components.tabs, tone: event.target.value as typeof current.components.tabs.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Navbar height</span>
                <select className="field px-3 py-2 text-sm" value={system.components.navbar.height}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, navbar: { ...current.components.navbar, height: event.target.value as typeof current.components.navbar.height } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sidebar width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.sidebar.width}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, sidebar: { ...current.components.sidebar, width: event.target.value as typeof current.components.sidebar.width } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Avatar size</span>
                <select className="field px-3 py-2 text-sm" value={system.components.avatar.size}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, avatar: { ...current.components.avatar, size: event.target.value as typeof current.components.avatar.size } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Avatar group size</span>
                <select className="field px-3 py-2 text-sm" value={system.components.avatarGroup.size}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, avatarGroup: { ...current.components.avatarGroup, size: event.target.value as typeof current.components.avatarGroup.size } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Avatar group overlap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.avatarGroup.overlap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, avatarGroup: { ...current.components.avatarGroup, overlap: event.target.value as typeof current.components.avatarGroup.overlap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Avatar group ring</span>
                <select className="field px-3 py-2 text-sm" value={system.components.avatarGroup.ring}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, avatarGroup: { ...current.components.avatarGroup, ring: event.target.value as typeof current.components.avatarGroup.ring } },
                  }))}>
                  <option value="none">None</option>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Divider thickness</span>
                <select className="field px-3 py-2 text-sm" value={system.components.divider.thickness}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, divider: { ...current.components.divider, thickness: event.target.value as typeof current.components.divider.thickness } },
                  }))}>
                  <option value="1px">1px</option>
                  <option value="2px">2px</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Heading scale</span>
                <select className="field px-3 py-2 text-sm" value={system.components.heading.scale}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, heading: { ...current.components.heading, scale: event.target.value as typeof current.components.heading.scale } },
                  }))}>
                  {Object.keys(system.typography.scale).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Text scale</span>
                <select className="field px-3 py-2 text-sm" value={system.components.text.scale}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, text: { ...current.components.text, scale: event.target.value as typeof current.components.text.scale } },
                  }))}>
                  {Object.keys(system.typography.scale).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Link scale</span>
                <select className="field px-3 py-2 text-sm" value={system.components.link.scale}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, link: { ...current.components.link, scale: event.target.value as typeof current.components.link.scale } },
                  }))}>
                  {Object.keys(system.typography.scale).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Link underline</span>
                <select className="field px-3 py-2 text-sm" value={system.components.link.underline}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, link: { ...current.components.link, underline: event.target.value as typeof current.components.link.underline } },
                  }))}>
                  <option value="always">Always</option>
                  <option value="hover">Hover</option>
                  <option value="none">None</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Link tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.link.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, link: { ...current.components.link, tone: event.target.value as typeof current.components.link.tone } },
                  }))}>
                  <option value="brand">Brand</option>
                  <option value="foreground">Foreground</option>
                  <option value="muted">Muted</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Visually hidden prefix</span>
                <input
                  className="field px-3 py-2 text-sm"
                  value={system.components.visuallyHidden.labelPrefix}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, visuallyHidden: { ...current.components.visuallyHidden, labelPrefix: event.target.value } },
                  }))}
                />
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Reveal on focus</span>
                <select className="field px-3 py-2 text-sm" value={system.components.visuallyHidden.revealOnFocus ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, visuallyHidden: { ...current.components.visuallyHidden, revealOnFocus: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Portal layer</span>
                <select className="field px-3 py-2 text-sm" value={system.components.portal.layer}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, portal: { ...current.components.portal, layer: event.target.value as typeof current.components.portal.layer } },
                  }))}>
                  {Object.keys(system.foundations.zIndex).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Portal tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.portal.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, portal: { ...current.components.portal, tone: event.target.value as typeof current.components.portal.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Scroll area scrollbar</span>
                <select className="field px-3 py-2 text-sm" value={system.components.scrollArea.scrollbar}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, scrollArea: { ...current.components.scrollArea, scrollbar: event.target.value as typeof current.components.scrollArea.scrollbar } },
                  }))}>
                  <option value="subtle">Subtle</option>
                  <option value="visible">Visible</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Scroll area height</span>
                <select className="field px-3 py-2 text-sm" value={system.components.scrollArea.maxHeight}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, scrollArea: { ...current.components.scrollArea, maxHeight: event.target.value as typeof current.components.scrollArea.maxHeight } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Fieldset radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.fieldset.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, fieldset: { ...current.components.fieldset, radius: event.target.value as typeof current.components.fieldset.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Description list gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.descriptionList.gap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, descriptionList: { ...current.components.descriptionList, gap: event.target.value as typeof current.components.descriptionList.gap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>List gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.list.gap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, list: { ...current.components.list, gap: event.target.value as typeof current.components.list.gap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>List item padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.list.itemPadding}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, list: { ...current.components.list, itemPadding: event.target.value as typeof current.components.list.itemPadding } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>List style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.list.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, list: { ...current.components.list, style: event.target.value as typeof current.components.list.style } },
                  }))}>
                  <option value="plain">Plain</option>
                  <option value="divided">Divided</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stat card radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.statCard.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, statCard: { ...current.components.statCard, radius: event.target.value as typeof current.components.statCard.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stat card emphasis</span>
                <select className="field px-3 py-2 text-sm" value={system.components.statCard.emphasis}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, statCard: { ...current.components.statCard, emphasis: event.target.value as typeof current.components.statCard.emphasis } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Timeline gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.timeline.gap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, timeline: { ...current.components.timeline, gap: event.target.value as typeof current.components.timeline.gap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Timeline style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.timeline.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, timeline: { ...current.components.timeline, style: event.target.value as typeof current.components.timeline.style } },
                  }))}>
                  <option value="line">Line</option>
                  <option value="filled">Filled</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Activity feed density</span>
                <select className="field px-3 py-2 text-sm" value={system.components.activityFeed.density}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, activityFeed: { ...current.components.activityFeed, density: event.target.value as typeof current.components.activityFeed.density } },
                  }))}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sidebar layout content width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.sidebarLayout.contentWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, sidebarLayout: { ...current.components.sidebarLayout, contentWidth: event.target.value as typeof current.components.sidebarLayout.contentWidth } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sidebar layout width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.sidebarLayout.sidebarWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, sidebarLayout: { ...current.components.sidebarLayout, sidebarWidth: event.target.value as typeof current.components.sidebarLayout.sidebarWidth } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sidebar layout header</span>
                <select className="field px-3 py-2 text-sm" value={system.components.sidebarLayout.headerHeight}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, sidebarLayout: { ...current.components.sidebarLayout, headerHeight: event.target.value as typeof current.components.sidebarLayout.headerHeight } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Sidebar layout page gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.sidebarLayout.pageGap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, sidebarLayout: { ...current.components.sidebarLayout, pageGap: event.target.value as typeof current.components.sidebarLayout.pageGap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stacked layout content width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.stackedLayout.contentWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, stackedLayout: { ...current.components.stackedLayout, contentWidth: event.target.value as typeof current.components.stackedLayout.contentWidth } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stacked layout header</span>
                <select className="field px-3 py-2 text-sm" value={system.components.stackedLayout.headerHeight}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, stackedLayout: { ...current.components.stackedLayout, headerHeight: event.target.value as typeof current.components.stackedLayout.headerHeight } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Stacked layout page gap</span>
                <select className="field px-3 py-2 text-sm" value={system.components.stackedLayout.pageGap}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, stackedLayout: { ...current.components.stackedLayout, pageGap: event.target.value as typeof current.components.stackedLayout.pageGap } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Auth card width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.authLayout.cardWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, authLayout: { ...current.components.authLayout, cardWidth: event.target.value as typeof current.components.authLayout.cardWidth } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Auth card radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.authLayout.cardRadius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, authLayout: { ...current.components.authLayout, cardRadius: event.target.value as typeof current.components.authLayout.cardRadius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Auth card padding</span>
                <select className="field px-3 py-2 text-sm" value={system.components.authLayout.cardPadding}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, authLayout: { ...current.components.authLayout, cardPadding: event.target.value as typeof current.components.authLayout.cardPadding } },
                  }))}>
                  {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Save state style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.saveState.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, saveState: { ...current.components.saveState, style: event.target.value as typeof current.components.saveState.style } },
                  }))}>
                  <option value="inline">Inline</option>
                  <option value="banner">Banner</option>
                  <option value="toast">Toast</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Save state emphasis</span>
                <select className="field px-3 py-2 text-sm" value={system.components.saveState.emphasis}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, saveState: { ...current.components.saveState, emphasis: event.target.value as typeof current.components.saveState.emphasis } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Template type</span>
                <select className="field px-3 py-2 text-sm" value={system.components.pageTemplate.style}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, pageTemplate: { ...current.components.pageTemplate, style: event.target.value as typeof current.components.pageTemplate.style } },
                  }))}>
                  <option value="empty">Empty</option>
                  <option value="error">Error</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Template alignment</span>
                <select className="field px-3 py-2 text-sm" value={system.components.pageTemplate.alignment}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, pageTemplate: { ...current.components.pageTemplate, alignment: event.target.value as typeof current.components.pageTemplate.alignment } },
                  }))}>
                  <option value="centered">Centered</option>
                  <option value="split">Split</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Onboarding layout</span>
                <select className="field px-3 py-2 text-sm" value={system.components.onboarding.layout}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, onboarding: { ...current.components.onboarding, layout: event.target.value as typeof current.components.onboarding.layout } },
                  }))}>
                  <option value="checklist">Checklist</option>
                  <option value="spotlight">Spotlight</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Onboarding emphasis</span>
                <select className="field px-3 py-2 text-sm" value={system.components.onboarding.emphasis}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, onboarding: { ...current.components.onboarding, emphasis: event.target.value as typeof current.components.onboarding.emphasis } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Flow step style</span>
                <select className="field px-3 py-2 text-sm" value={system.components.multiStepFlow.stepStyle}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, multiStepFlow: { ...current.components.multiStepFlow, stepStyle: event.target.value as typeof current.components.multiStepFlow.stepStyle } },
                  }))}>
                  <option value="pill">Pill</option>
                  <option value="line">Line</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Flow summary</span>
                <select className="field px-3 py-2 text-sm" value={system.components.multiStepFlow.showSummary ? "yes" : "no"}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, multiStepFlow: { ...current.components.multiStepFlow, showSummary: event.target.value === "yes" } },
                  }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Permission tone</span>
                <select className="field px-3 py-2 text-sm" value={system.components.permissionState.tone}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, permissionState: { ...current.components.permissionState, tone: event.target.value as typeof current.components.permissionState.tone } },
                  }))}>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-app-muted">
                <span>Permission layout</span>
                <select className="field px-3 py-2 text-sm" value={system.components.permissionState.layout}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, permissionState: { ...current.components.permissionState, layout: event.target.value as typeof current.components.permissionState.layout } },
                  }))}>
                  <option value="inline">Inline</option>
                  <option value="panel">Panel</option>
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-[var(--app-radius-md)] border border-dashed p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-app-foreground">Extended inventory</p>
                  <p className="mt-1 text-xs text-app-muted">Remaining primitives, advanced controls, and product patterns now have first-class recipe controls too.</p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs text-app-muted">Breadth-first coverage</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Box surface</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.box.surface}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, box: { ...current.components.box, surface: event.target.value as typeof current.components.box.surface } },
                    }))}>
                    <option value="flat">Flat</option>
                    <option value="raised">Raised</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Container align</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.container.align}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, container: { ...current.components.container, align: event.target.value as typeof current.components.container.align } },
                    }))}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Grid columns</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.gridPrimitive.columns}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, gridPrimitive: { ...current.components.gridPrimitive, columns: event.target.value as typeof current.components.gridPrimitive.columns } },
                    }))}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Icon button tone</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.iconButton.tone}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, iconButton: { ...current.components.iconButton, tone: event.target.value as typeof current.components.iconButton.tone } },
                    }))}>
                    <option value="filled">Filled</option>
                    <option value="soft">Soft</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Context menu density</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.contextMenu.density}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, contextMenu: { ...current.components.contextMenu, density: event.target.value as typeof current.components.contextMenu.density } },
                    }))}>
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Tree view density</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.treeView.density}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, treeView: { ...current.components.treeView, density: event.target.value as typeof current.components.treeView.density } },
                    }))}>
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>OTP slots</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.otpInput.slots}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, otpInput: { ...current.components.otpInput, slots: event.target.value as typeof current.components.otpInput.slots } },
                    }))}>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Date-time format</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.dateTimePicker.timeFormat}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, dateTimePicker: { ...current.components.dateTimePicker, timeFormat: event.target.value as typeof current.components.dateTimePicker.timeFormat } },
                    }))}>
                    <option value="12h">12h</option>
                    <option value="24h">24h</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Select style</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.selectField.style}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, selectField: { ...current.components.selectField, style: event.target.value as typeof current.components.selectField.style } },
                    }))}>
                    <option value="default">Default</option>
                    <option value="quiet">Quiet</option>
                    <option value="underline">Underline</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Character count tone</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.characterCount.tone}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, characterCount: { ...current.components.characterCount, tone: event.target.value as typeof current.components.characterCount.tone } },
                    }))}>
                    <option value="muted">Muted</option>
                    <option value="warning">Warning</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Code block line numbers</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.codeBlock.lineNumbers ? "yes" : "no"}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, codeBlock: { ...current.components.codeBlock, lineNumbers: event.target.value === "yes" } },
                    }))}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Chart style</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.chartCard.chartType}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, chartCard: { ...current.components.chartCard, chartType: event.target.value as typeof current.components.chartCard.chartType } },
                    }))}>
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                    <option value="donut">Donut</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Sheet placement</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.sheet.placement}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, sheet: { ...current.components.sheet, placement: event.target.value as typeof current.components.sheet.placement } },
                    }))}>
                    <option value="bottom">Bottom</option>
                    <option value="right">Right</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Notification center style</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.notificationCenter.style}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, notificationCenter: { ...current.components.notificationCenter, style: event.target.value as typeof current.components.notificationCenter.style } },
                    }))}>
                    <option value="stacked">Stacked</option>
                    <option value="grouped">Grouped</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Bulk actions style</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.bulkActions.selectionStyle}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, bulkActions: { ...current.components.bulkActions, selectionStyle: event.target.value as typeof current.components.bulkActions.selectionStyle } },
                    }))}>
                    <option value="inline">Inline</option>
                    <option value="bar">Bar</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Inline edit trigger</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.inlineEdit.trigger}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, inlineEdit: { ...current.components.inlineEdit, trigger: event.target.value as typeof current.components.inlineEdit.trigger } },
                    }))}>
                    <option value="icon">Icon</option>
                    <option value="row">Row</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-app-muted">
                  <span>Upload flow layout</span>
                  <select className="field px-3 py-2 text-sm" value={system.components.fileUploadFlow.layout}
                    onChange={(event) => setSystem((current) => ({
                      ...current,
                      components: { ...current.components, fileUploadFlow: { ...current.components.fileUploadFlow, layout: event.target.value as typeof current.components.fileUploadFlow.layout } },
                    }))}>
                    <option value="steps">Steps</option>
                    <option value="stack">Stack</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </details>
        ) : null}

        {activeTab === "system" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4" /> Screen presets</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            {Object.entries(system.screens).map(([preset, config]) => (
              <div key={preset} className="rounded-[1rem] border border-app-border/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-app-foreground">{sectionLabel(preset)}</p>
                    <p className="mt-1 text-xs text-app-muted">Controls page width, chrome spacing, and density posture for this preview/export surface.</p>
                  </div>
                  <span className="rounded-full bg-app-bg px-3 py-1 text-xs font-medium text-app-muted">
                    {sectionLabel(config.density)}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Max width</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={config.maxWidth}
                      onChange={(event) =>
                        updateScreenPreset(preset as keyof GeneratedSystem["screens"], {
                          maxWidth: event.target.value as typeof config.maxWidth,
                        })}
                    >
                      {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Density</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={config.density}
                      onChange={(event) =>
                        updateScreenPreset(preset as keyof GeneratedSystem["screens"], {
                          density: event.target.value as Density,
                        })}
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="airy">Airy</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Section gap</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={config.sectionGap}
                      onChange={(event) =>
                        updateScreenPreset(preset as keyof GeneratedSystem["screens"], {
                          sectionGap: event.target.value as typeof config.sectionGap,
                        })}
                    >
                      {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-app-muted">
                    <span>Chrome padding</span>
                    <select
                      className="field px-3 py-2 text-sm"
                      value={config.chromePadding}
                      onChange={(event) =>
                        updateScreenPreset(preset as keyof GeneratedSystem["screens"], {
                          chromePadding: event.target.value as typeof config.chromePadding,
                        })}
                    >
                      {Object.keys(system.foundations.spacing).map((key) => <option key={key} value={key}>{key}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </details>
        ) : null}

        {activeTab === "foundations" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><SwatchBook className="h-4 w-4" /> Semantic mappings</span>
          </summary>
          <div className="grid gap-4 border-t border-app-border/70 px-4 py-4">
            {(["lightTokens", "darkTokens"] as const).map((themeName) => (
              <div key={themeName} className="space-y-3">
                <h3 className="text-sm font-semibold text-app-foreground">{themeName === "lightTokens" ? "Light theme" : "Dark theme"}</h3>
                <div className="grid gap-2">
                  {SEMANTIC_TOKEN_NAMES.map((token) => (
                    <label key={`${themeName}-${token}`} className="grid grid-cols-[1fr_1fr] items-center gap-2 text-sm">
                      <span className="text-app-muted">{sectionLabel(token)}</span>
                      <TokenReferencePicker
                        options={tokenOptions}
                        value={system[themeName][token]}
                        palettes={system.palettes}
                        onChange={(nextValue) => updateThemeToken(themeName, token, nextValue)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
        ) : null}

        {activeTab === "foundations" ? (
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Type className="h-4 w-4" /> Typography scale</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="rounded-[0.95rem] border border-app-border/70 bg-app-bg/70 px-3 py-3">
              <p className="text-sm font-semibold text-app-foreground">Families come from Brand Inputs</p>
              <p className="mt-1 text-xs text-app-muted">
                Heading and body font families are set in the Assets tab. Edit the scale here to control size, line-height, tracking, and weight for every text role.
              </p>
            </div>

            <div className="grid gap-3">
              {TYPOGRAPHY_SCALE_ORDER.map((key) => {
                const token = system.typography.scale[key];
                return (
                  <div key={key} className="workspace-card space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-app-foreground">{sectionLabel(key)}</p>
                        <p className="mt-1 text-xs text-app-muted">
                          {key.startsWith("display")
                            ? "Uses the display font family from Brand Inputs."
                            : key.startsWith("h")
                              ? "Uses the heading font family from Brand Inputs."
                            : key.startsWith("code")
                              ? "Uses the body font family as a practical code-style baseline for this MVP."
                              : "Uses the body font family from Brand Inputs."}
                        </p>
                      </div>
                      <span className="rounded-full bg-app-bg px-3 py-1 text-xs font-medium text-app-muted">
                        {key.startsWith("display") ? "Display family" : key.startsWith("h") ? "Heading family" : "Body family"}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="space-y-1 text-xs text-app-muted">
                        <span>Font size</span>
                        <input
                          className="field px-3 py-2 text-sm"
                          value={token.size}
                          onChange={(event) => setSystem((current) => ({
                            ...current,
                            typography: {
                              ...current.typography,
                              scale: {
                                ...current.typography.scale,
                                [key]: { ...current.typography.scale[key], size: event.target.value },
                              },
                            },
                          }))}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-app-muted">
                        <span>Line height</span>
                        <input
                          className="field px-3 py-2 text-sm"
                          value={token.lineHeight}
                          onChange={(event) => setSystem((current) => ({
                            ...current,
                            typography: {
                              ...current.typography,
                              scale: {
                                ...current.typography.scale,
                                [key]: { ...current.typography.scale[key], lineHeight: event.target.value },
                              },
                            },
                          }))}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-app-muted">
                        <span>Font weight</span>
                        <input
                          className="field px-3 py-2 text-sm"
                          value={token.weight}
                          onChange={(event) => setSystem((current) => ({
                            ...current,
                            typography: {
                              ...current.typography,
                              scale: {
                                ...current.typography.scale,
                                [key]: { ...current.typography.scale[key], weight: event.target.value },
                              },
                            },
                          }))}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-app-muted">
                        <span>Letter spacing</span>
                        <input
                          className="field px-3 py-2 text-sm"
                          value={token.letterSpacing ?? ""}
                          placeholder="0em"
                          onChange={(event) => setSystem((current) => ({
                            ...current,
                            typography: {
                              ...current.typography,
                              scale: {
                                ...current.typography.scale,
                                [key]: {
                                  ...current.typography.scale[key],
                                  letterSpacing: event.target.value || undefined,
                                },
                              },
                            },
                          }))}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </details>
        ) : null}

        {activeTab === "handoff" ? (
        <div className="rounded-[1.3rem] border border-app-border bg-app-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-app-foreground">System QA</p>
              <p className="mt-1 text-xs text-app-muted">Contrast, coverage, state consistency, and export-safety checks.</p>
            </div>
            <div className="rounded-full bg-app-bg px-3 py-2 text-sm font-semibold text-app-foreground">
              {qaReport.score}/100
            </div>
          </div>
          <div className="mt-3 rounded-[1rem] border border-app-border/70 bg-app-bg px-3 py-3 text-sm text-app-muted">
            Export posture: <span className="font-semibold text-app-foreground">{sectionLabel(qaReport.exportReadiness)}</span>
          </div>
          <div className="mt-3 space-y-2">
            {qaReport.findings.length ? qaReport.findings.map((finding) => (
              <div
                key={finding.label}
                className="rounded-[1rem] px-3 py-3 text-sm"
                style={{
                  background: finding.severity === "critical"
                    ? "color-mix(in oklch, #fb7185 12%, white)"
                    : finding.severity === "warning"
                      ? "color-mix(in oklch, #f59e0b 14%, white)"
                      : "color-mix(in oklch, var(--app-accent) 8%, white)",
                }}
              >
                <span className="font-semibold">{sectionLabel(finding.severity)}:</span> {finding.label}
              </div>
            )) : (
              <div className="rounded-[1rem] bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
                The current system passes the built-in MVP QA checks.
              </div>
            )}
          </div>
        </div>
        ) : null}

        {activeTab === "handoff" ? (
        <div className="rounded-[1.3rem] border border-app-border bg-app-surface p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-app-foreground">
            <Download className="h-4 w-4" />
            Export files
          </div>
          <div className="mt-4 grid gap-2">
            <button type="button" className="field text-left" onClick={() => exportFile("tokens")}>Download `tokens.json`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("components")}>Download `components.json`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("theme")}>Download `theme.css`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("tailwind")}>Download `tailwind-theme.css`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("readme")}>Download `README.md`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("session")}>Save session JSON</button>
            <label className="field cursor-pointer text-left">
              Load session JSON
              <input type="file" className="sr-only" accept="application/json" onChange={importSession} />
            </label>
            <button
              type="button"
              className="mt-2 rounded-[1rem] bg-app-accent px-4 py-3 text-sm font-semibold text-white"
              onClick={exportZip}
            >
              Download ZIP package
            </button>
          </div>
        </div>
        ) : null}
      </div>
    </div>
  );
}

function UIKitPreview({ system }: { system: GeneratedSystem }) {
  const supportLayout = system.components.input.messageStyle === "inline" ? "flex items-center justify-between gap-3" : "space-y-1";
  const tabsGap = system.foundations.spacing[system.components.tabs.gap];
  const tabsActiveTone = system.components.tabs.tone === "strong"
    ? "var(--preview-action-primary)"
    : "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)";
  const tabsActiveColor = system.components.tabs.tone === "strong"
    ? "var(--preview-action-primary-foreground)"
    : "var(--preview-action-primary)";

  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-grid-gap grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="preview-surface space-y-4 p-5">
          <span className="preview-badge inline-flex px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Buttons and Inputs</span>
          <div>
            <h3 className="preview-heading text-3xl font-semibold">A grounded UI kit with brand-backed defaults.</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
              Primary and secondary components are mapped from semantic tokens instead of hard-coded colors.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="preview-button-primary flex items-center gap-2 px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium"><PreviewIcon icon={ArrowRight01Icon} context="buttons" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Primary button</button>
            <button className="preview-button-secondary flex items-center gap-2 px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium"><PreviewIcon icon={StarHugeIcon} context="buttons" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Secondary action</button>
            <button className="preview-button-ghost flex items-center gap-2 px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium"><PreviewIcon icon={Menu01Icon} context="buttons" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Ghost action</button>
          </div>
          <div className="grid gap-3">
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ borderColor: "var(--preview-input-search-border)", borderBottomColor: system.components.input.searchStyle === "underline" ? "var(--preview-border-strong)" : "var(--preview-input-search-border)", borderRadius: system.components.input.searchStyle === "underline" ? "0" : "var(--preview-input-radius)", borderWidth: system.components.input.searchStyle === "underline" ? "0 0 var(--preview-input-border-width) 0" : "var(--preview-input-border-width)" }}>
              <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
              <span className="min-w-0 flex-1">Search brand tokens</span>
              {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌘K</span> : null}
            </div>
            <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="success" value="Brand color validated" readOnly />
            <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="error" value="Accent color needs contrast help" readOnly />
            {system.components.input.showHelperText ? (
              <div className={supportLayout}>
                <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>
                  Helper text stays attached to control recipes.
                </p>
                <span className="text-xs" style={{ color: "var(--preview-success)" }}>Ready</span>
              </div>
            ) : null}
            <div className="preview-input flex items-center justify-between px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ background: "var(--preview-input-select-bg)" }}>
              <div className="flex min-w-0 items-center gap-3">
                {system.components.input.showPrefix ? <PreviewIcon icon={Settings01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span>Density mode</span>
              </div>
              <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.input.selectStyle === "quiet" ? "Quiet select" : "Default select"} ⌄</span>
            </div>
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ background: "var(--preview-input-readonly-bg)", borderColor: "var(--preview-input-readonly-border)" }}>
              {system.components.input.showPrefix ? <PreviewIcon icon={DatabaseIcon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
              <span className="min-w-0 flex-1">Generated token namespace</span>
              {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Read only</span> : null}
            </div>
            <textarea className="preview-input min-h-[var(--preview-textarea-min-height)] rounded-[var(--preview-textarea-radius)] px-[var(--preview-textarea-padding)] py-[var(--preview-textarea-padding)]" value="Supporting notes that explain how tokens should feel in the product surface." readOnly />
            <select className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" defaultValue="comfortable">
              <option value="comfortable">Comfortable density</option>
            </select>
          </div>
        </div>

        <div className="preview-stack flex flex-col">
          <div className="preview-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: "var(--preview-text-secondary)" }}>Badges and alerts</span>
              <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">New release</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="preview-alert-success px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Accessible success state with semantic green mapping.</div>
              <div className="preview-alert-warning px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Warning tokens stay warm and legible in both themes.</div>
              <div className="preview-alert-danger px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Danger surfaces carry urgency without overpowering the UI.</div>
              <div className="preview-alert-info px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Info alerts can now be tuned independently for calmer system messaging.</div>
              <div className="preview-alert-attention px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Attention alerts support high-visibility notices before they escalate to danger.</div>
            </div>
          </div>

          <div className="preview-surface p-5">
            <div className="flex border p-1" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.components.tabs.activeStyle === "pill" ? system.radius[system.components.tabs.radius] : system.radius.md, gap: tabsGap }}>
              {["Overview", "Components", "States"].map((tab, index) => (
                <button
                  key={tab}
                  className="preview-tab flex-1 rounded-full border border-transparent px-3 py-2 text-sm"
                  data-active={index === 0}
                  style={index === 0 ? {
                    background: system.components.tabs.activeStyle === "pill" ? tabsActiveTone : "transparent",
                    color: tabsActiveColor,
                    borderRadius: system.radius[system.components.tabs.radius],
                    borderBottom: system.components.tabs.activeStyle === "underline" ? `2px solid ${tabsActiveColor}` : undefined,
                  } : { borderRadius: system.radius[system.components.tabs.radius] }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="preview-grid-gap mt-4 grid grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="preview-elevated p-4">
                  <div className="h-2 w-16 rounded-full" style={{ background: "var(--preview-action-primary)" }} />
                  <p className="mt-4 text-sm font-medium">Token sample {item}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--preview-text-secondary)" }}>Radius, shadow, and surface color all draw from the editable system.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComponentsPreview({ system }: { system: GeneratedSystem }) {
  const metrics = getSystemMetrics(system);
  const componentFamilies = [
    "button",
    "input",
    "searchField",
    "typedField",
    "datePicker",
    "dateRangePicker",
    "timePicker",
    "fileUpload",
    "slider",
    "rangeSlider",
    "textarea",
    "badge",
    "alert",
    "table",
    "dataGrid",
    "dialog",
    "checkbox",
    "switch",
    "radioGroup",
    "list",
    "dropdown",
    "combobox",
    "autocomplete",
    "listbox",
    "multiSelect",
    "pagination",
    "breadcrumbs",
    "stepper",
    "tabs",
    "commandPalette",
    "tag",
    "toast",
    "banner",
    "statusDot",
    "progress",
    "loader",
    "skeleton",
    "state",
    "popover",
    "tooltip",
    "navbar",
    "sidebar",
    "avatar",
    "avatarGroup",
    "statCard",
    "timeline",
    "activityFeed",
    "divider",
    "fieldset",
    "descriptionList",
    "heading",
    "text",
    "link",
    "box",
    "container",
    "stack",
    "inline",
    "gridPrimitive",
    "iconButton",
    "linkButton",
    "splitButton",
    "buttonGroup",
    "contextMenu",
    "skipLink",
    "anchorNav",
    "bottomNav",
    "treeView",
    "visuallyHidden",
    "portal",
    "scrollArea",
    "otpInput",
    "stepperInput",
    "dateTimePicker",
    "selectField",
    "inputGroup",
    "characterCount",
    "sidebarLayout",
    "stackedLayout",
    "authLayout",
    "saveState",
    "pageTemplate",
    "onboarding",
    "multiStepFlow",
    "permissionState",
    "hoverCard",
    "codeBlock",
    "quoteBlock",
    "calendarView",
    "filterBar",
    "chartCard",
    "sheet",
    "sidePanel",
    "bulkActions",
    "inlineEdit",
    "tableSelection",
    "notificationCenter",
    "fileUploadFlow",
    "segmentedControl",
    "colorPicker",
    "richTextEditor",
    "field",
    "label",
    "dragDropUpload",
    "tertiaryButton",
    "destructiveButton",
    "fab",
    "copyAction",
    "shareAction",
    "menu",
    "navigationMenu",
    "accordionNav",
    "circularProgress",
    "offlineState",
    "keyValuePair",
    "emptyPlaceholder",
    "chartLegend",
    "chartAxis",
    "lightbox",
    "bottomSheet",
    "commandDialog",
    "splitView",
    "masterDetail",
    "searchResultsLayout",
    "notFoundPage",
    "createFlow",
    "editFlow",
    "deleteConfirmation",
    "filterSortPattern",
    "emptyToPopulated",
    "activityHistory",
    "successConfirmation",
  ] as const;
  const messageInline = system.components.input.messageStyle === "inline";
  const settingsPreset = system.screens.settings;
  const dataTablePreset = system.screens.dataTable;
  const formPagePreset = system.screens.formPage;
  const authPreset = system.screens.auth;
  const settingsGap = system.foundations.spacing[settingsPreset.sectionGap];
  const dataTableGap = system.foundations.spacing[dataTablePreset.sectionGap];
  const formGap = system.foundations.spacing[formPagePreset.sectionGap];
  const authGap = system.foundations.spacing[authPreset.sectionGap];
  const sidebarPageGap = system.foundations.spacing[system.components.sidebarLayout.pageGap];
  const stackedPageGap = system.foundations.spacing[system.components.stackedLayout.pageGap];
  const sidebarHeaderHeight = system.foundations.spacing[system.components.sidebarLayout.headerHeight];
  const stackedHeaderHeight = system.foundations.spacing[system.components.stackedLayout.headerHeight];
  const sidebarWidth = system.foundations.containers[system.components.sidebarLayout.sidebarWidth];
  const settingsWidth = system.foundations.containers[settingsPreset.maxWidth];
  const formWidth = system.foundations.containers[formPagePreset.maxWidth];
  const dataTableWidth = system.foundations.containers[dataTablePreset.maxWidth];
  const authWidth = system.foundations.containers[system.components.authLayout.cardWidth];
  const tagBackground = resolveTokenReference(system.components.tag.color.background, system.palettes);
  const tagForeground = resolveTokenReference(system.components.tag.color.foreground, system.palettes);
  const tagBorder = resolveTokenReference(system.components.tag.color.border, system.palettes);
  const bannerColor = resolveTokenReference(system.components.banner.color, system.palettes);
  const bannerBackground = system.components.banner.style === "solid"
    ? bannerColor
    : `color-mix(in srgb, ${bannerColor} ${system.components.banner.style === "outlined" ? "10%" : "14%"}, transparent)`;
  const bannerBorder = system.components.banner.style === "outlined"
    ? `color-mix(in srgb, ${bannerColor} 34%, transparent)`
    : "transparent";
  const toastBackground = system.components.toast.tone === "strong"
    ? "var(--preview-surface-elevated)"
    : "color-mix(in srgb, var(--preview-surface-elevated) 82%, var(--preview-background))";
  const toastShadow = system.shadows[system.components.toast.shadow];
  const statusDotSize = system.foundations.spacing[system.components.statusDot.size];
  const progressHeight = system.foundations.spacing[system.components.progress.height];
  const progressTrack = system.components.progress.tone === "strong"
    ? "color-mix(in srgb, var(--preview-action-primary) 16%, transparent)"
    : "color-mix(in srgb, var(--preview-border-default) 52%, transparent)";
  const progressFill = system.components.progress.tone === "strong"
    ? "var(--preview-action-primary)"
    : "color-mix(in srgb, var(--preview-action-primary) 78%, white)";
  const loaderSize = system.foundations.spacing[system.components.loader.size];
  const loaderBorderWidth = system.components.loader.stroke === "thin" ? "1.5px" : system.components.loader.stroke === "bold" ? "3px" : "2px";
  const skeletonLineHeight = system.foundations.spacing[system.components.skeleton.lineHeight];
  const skeletonFill = system.components.skeleton.shimmer === "strong"
    ? "linear-gradient(90deg, color-mix(in srgb, var(--preview-border-default) 32%, transparent), color-mix(in srgb, var(--preview-surface-elevated) 88%, white), color-mix(in srgb, var(--preview-border-default) 32%, transparent))"
    : "linear-gradient(90deg, color-mix(in srgb, var(--preview-border-default) 18%, transparent), color-mix(in srgb, var(--preview-surface-elevated) 74%, white), color-mix(in srgb, var(--preview-border-default) 18%, transparent))";

  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-surface p-5">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Component lab</p>
        <h3 className="preview-heading mt-3 text-3xl font-semibold">Inspect variants, states, and system recipes in one place.</h3>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--preview-text-secondary)" }}>
          Every example below is using the same component recipe layer you edit in the right panel.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{metrics.paletteCount} palettes</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{metrics.componentFamilyCount} component families</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{metrics.exportFileCount} export files</span>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {componentFamilies.map((family) => (
            <div key={family} className="rounded-[var(--preview-radius-sm)] border px-3 py-3 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>
              <p className="font-medium">{sectionLabel(family)}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--preview-text-muted)" }}>Modeled and previewed</p>
            </div>
          ))}
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-2">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Buttons</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Primary</button>
            <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Secondary</button>
            <button className="preview-button-ghost px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Ghost</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium opacity-65">Disabled</button>
            <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Quiet action</button>
            <button className="preview-button-ghost px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Icon slot</button>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Inputs</h4>
          <div className="mt-4 space-y-3">
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ borderColor: system.components.searchField.style === "underline" ? "transparent" : "var(--preview-border-default)", borderBottomColor: system.components.searchField.style === "underline" ? "var(--preview-border-strong)" : undefined, borderRadius: system.components.searchField.style === "underline" ? "0" : system.radius[system.components.searchField.radius], borderWidth: system.components.searchField.style === "underline" ? "0 0 var(--preview-input-border-width) 0" : "var(--preview-input-border-width)", paddingInline: system.foundations.spacing[system.components.searchField.paddingX], paddingBlock: system.foundations.spacing[system.components.searchField.paddingY] }}>
              <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
              <span className="min-w-0 flex-1">Distinct search field</span>
              {system.components.searchField.showShortcut ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌘K</span> : null}
            </div>
            <div>
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                {system.components.input.showPrefix ? <PreviewIcon icon={UserIcon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span className="min-w-0 flex-1">Default input</span>
                {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>ID</span> : null}
              </div>
              {system.components.input.showHelperText ? (
                <div className={`mt-2 ${messageInline ? "flex items-center justify-between gap-3" : "space-y-1"}`}>
                  <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Helper text follows the component recipe toggle.</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Optional</span>
                </div>
              ) : null}
            </div>
            <div>
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="success">
                {system.components.input.showPrefix ? <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span className="min-w-0 flex-1">Search field</span>
                {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-success)" }}>Live</span> : null}
              </div>
              <div className={`mt-2 ${messageInline ? "flex items-center justify-between gap-3" : "space-y-1"}`}>
                <p className="text-xs" style={{ color: "var(--preview-success)" }}>Everything checks out.</p>
                <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Success</span>
              </div>
            </div>
            <div>
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="error">
                {system.components.input.showPrefix ? <PreviewIcon icon={Alert02Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span className="min-w-0 flex-1">Error state</span>
                {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-danger)" }}>Fix</span> : null}
              </div>
              <div className={`mt-2 ${messageInline ? "flex items-center justify-between gap-3" : "space-y-1"}`}>
                <p className="text-xs" style={{ color: "var(--preview-danger)" }}>Needs a more accessible accent value.</p>
                <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Required</span>
              </div>
            </div>
            <div className="preview-input flex items-center justify-between px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ background: "var(--preview-input-select-bg)" }}>
              <div className="flex min-w-0 items-center gap-3">
                {system.components.input.showPrefix ? <PreviewIcon icon={TableIcon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span>Select field</span>
              </div>
              <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.input.selectStyle === "quiet" ? "Quiet" : "Default"} ⌄</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                {system.components.typedField.contactIcon ? <PreviewIcon icon={Mail01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span className="min-w-0 flex-1">hello@northstar.app</span>
                <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Email</span>
              </div>
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                {system.components.typedField.contactIcon ? <PreviewIcon icon={UserIcon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span className="min-w-0 flex-1">+1 (555) 340-2200</span>
                <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Phone</span>
              </div>
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                <span className="min-w-0 flex-1">••••••••••••</span>
                {system.components.typedField.passwordReveal ? <span className="text-xs font-medium" style={{ color: "var(--preview-action-primary)" }}>Show</span> : <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Hidden</span>}
              </div>
              <div className="preview-input flex items-center justify-between px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                <span>12</span>
                <div className="flex gap-2 text-xs" style={{ color: "var(--preview-text-muted)" }}>
                  {system.components.typedField.numberControls === "split" ? <><span className="rounded border px-2 py-1" style={{ borderColor: "var(--preview-border-default)" }}>-</span><span className="rounded border px-2 py-1" style={{ borderColor: "var(--preview-border-default)" }}>+</span></> : <span>− / +</span>}
                </div>
              </div>
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)] md:col-span-2">
                <span className="min-w-0 flex-1">https://northstar.design/system</span>
                {system.components.typedField.urlPreview ? <span className="text-xs font-medium" style={{ color: "var(--preview-action-primary)" }}>Open preview</span> : <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>URL</span>}
              </div>
            </div>
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ background: "var(--preview-input-readonly-bg)", borderColor: "var(--preview-input-readonly-border)" }}>
              {system.components.input.showPrefix ? <PreviewIcon icon={DatabaseIcon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
              <span className="min-w-0 flex-1">Read-only token reference</span>
              <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.input.readOnlyStyle)}</span>
            </div>
            <textarea className="preview-input w-full min-h-[var(--preview-textarea-min-height)] rounded-[var(--preview-textarea-radius)] px-[var(--preview-textarea-padding)] py-[var(--preview-textarea-padding)]" value="Textarea recipe uses its own min-height and padding settings." readOnly />
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="preview-elevated" style={{ padding: system.foundations.spacing[system.components.datePicker.padding], borderRadius: system.radius[system.components.datePicker.radius] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Date picker</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.datePicker.density)}</span>
                </div>
                <div className="mt-3 grid grid-cols-8 gap-1 text-center text-xs" style={{ color: "var(--preview-text-muted)" }}>
                  {system.components.datePicker.showWeekNumbers ? <span>Wk</span> : null}
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="mt-2 grid grid-cols-8 gap-1 text-xs">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center"
                      style={{
                        minHeight: system.components.datePicker.density === "compact" ? "1.7rem" : "2rem",
                        borderRadius: "var(--preview-radius-sm)",
                        background: index === 9 ? "color-mix(in srgb, var(--preview-action-primary) 14%, transparent)" : "transparent",
                        color: index === 9 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)",
                      }}
                    >
                      {index < 2 && system.components.datePicker.showWeekNumbers ? `${17 + index}` : `${index + 3}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ padding: system.foundations.spacing[system.components.timePicker.padding], borderRadius: system.radius[system.components.timePicker.radius] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Time picker</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.timePicker.format} / {system.components.timePicker.step}</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {["09:00", "09:30", "10:00"].map((slot, index) => (
                    <div
                      key={slot}
                      className="flex items-center justify-between rounded-[var(--preview-radius-sm)] px-3 py-2 text-sm"
                      style={{
                        background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "var(--preview-surface)",
                        color: index === 1 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)",
                        border: "1px solid var(--preview-border-default)",
                      }}
                    >
                      <span>{system.components.timePicker.format === "24h" ? slot : index === 2 ? "10:00 AM" : index === 1 ? "9:30 AM" : "9:00 AM"}</span>
                      <span style={{ color: "var(--preview-text-muted)" }}>Slot</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated lg:col-span-2" style={{ padding: system.foundations.spacing[system.components.dateRangePicker.padding], borderRadius: system.radius[system.components.dateRangePicker.radius] }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Date range picker</p>
                  <div className="flex flex-wrap gap-2">
                    {(system.components.dateRangePicker.presetStyle === "chips" ? ["Last 7 days", "Last 30 days", "Quarter"] : ["Start: Apr 01", "End: Apr 19"]).map((item, index) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-[var(--preview-radius-pill)] border px-3 py-1 text-xs font-medium"
                        style={{
                          borderColor: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 30%, transparent)" : "var(--preview-border-default)",
                          background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 9%, transparent)" : "transparent",
                          color: index === 0 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {system.components.dateRangePicker.showComparison ? <p className="mt-3 text-xs" style={{ color: "var(--preview-text-muted)" }}>Comparison against previous period is enabled in this recipe.</p> : null}
              </div>
              <div className="preview-elevated lg:col-span-2" style={{ padding: system.foundations.spacing[system.components.fileUpload.padding], borderRadius: system.radius[system.components.fileUpload.radius], border: `1px dashed ${system.components.fileUpload.dragState === "strong" ? "var(--preview-action-primary)" : "var(--preview-border-strong)"}`, background: system.components.fileUpload.dragState === "strong" ? "color-mix(in srgb, var(--preview-action-primary) 8%, transparent)" : "var(--preview-surface)" }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-semibold">{system.components.fileUpload.style === "dropzone" ? "Drop files to upload" : "Attach assets"}</p>
                      <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>SVG, PNG, or PDF files up to 24 MB.</p>
                    </div>
                  </div>
                  <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Browse files</button>
                </div>
                {system.components.fileUpload.showPreview ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["logo-mark.svg", "brand-guidelines.pdf"].map((file) => (
                      <span key={file} className="inline-flex items-center rounded-[var(--preview-radius-pill)] border px-3 py-1 text-xs font-medium" style={{ borderColor: "var(--preview-border-default)", background: "var(--preview-surface-elevated)" }}>
                        {file}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="preview-elevated" style={{ padding: "1rem", borderRadius: "var(--preview-radius-lg)" }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Slider</p>
                  {system.components.slider.showValue ? <span className="text-xs font-medium" style={{ color: "var(--preview-action-primary)" }}>72%</span> : null}
                </div>
                <div className="mt-4">
                  <div className="relative" style={{ height: system.foundations.spacing[system.components.slider.thumbSize] }}>
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full" style={{ height: system.foundations.spacing[system.components.slider.trackHeight], background: "color-mix(in srgb, var(--preview-border-default) 65%, transparent)" }} />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full" style={{ width: "72%", height: system.foundations.spacing[system.components.slider.trackHeight], background: "var(--preview-action-primary)" }} />
                    <span className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm" style={{ left: "calc(72% - 0.5rem)", width: system.foundations.spacing[system.components.slider.thumbSize], height: system.foundations.spacing[system.components.slider.thumbSize], background: "var(--preview-action-primary)" }} />
                  </div>
                  {system.components.slider.showTicks ? <div className="mt-2 flex justify-between text-[11px]" style={{ color: "var(--preview-text-muted)" }}><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div> : null}
                </div>
              </div>
              <div className="preview-elevated" style={{ padding: "1rem", borderRadius: "var(--preview-radius-lg)" }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Range slider</p>
                  {system.components.rangeSlider.showValues ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>20 - 68</span> : null}
                </div>
                <div className="mt-4">
                  <div className="relative" style={{ height: system.foundations.spacing[system.components.rangeSlider.thumbSize] }}>
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full" style={{ height: system.foundations.spacing[system.components.rangeSlider.trackHeight], background: "color-mix(in srgb, var(--preview-border-default) 65%, transparent)" }} />
                    <div className="absolute top-1/2 -translate-y-1/2 rounded-full" style={{ left: "20%", width: "48%", height: system.foundations.spacing[system.components.rangeSlider.trackHeight], background: "var(--preview-action-primary)" }} />
                    {["20%", "68%"].map((left) => (
                      <span key={left} className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm" style={{ left: `calc(${left} - 0.5rem)`, width: system.foundations.spacing[system.components.rangeSlider.thumbSize], height: system.foundations.spacing[system.components.rangeSlider.thumbSize], background: "var(--preview-action-primary)" }} />
                    ))}
                  </div>
                  {system.components.rangeSlider.showInputs ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)] text-xs">20</div>
                      <div className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)] text-xs">68</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[0.95fr_1.05fr]">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Badges and Alerts</h4>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Default badge</span>
            <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">System label</span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="preview-alert-success flex items-center gap-3 px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm"><PreviewIcon icon={Notification03Icon} context="alerts" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Success alert recipe</div>
            <div className="preview-alert-warning flex items-center gap-3 px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm"><PreviewIcon icon={Alert02Icon} context="alerts" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Warning alert recipe</div>
            <div className="preview-alert-danger flex items-center gap-3 px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm"><PreviewIcon icon={Alert02Icon} context="alerts" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Danger alert recipe</div>
            <div className="preview-alert-info flex items-center gap-3 px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm"><PreviewIcon icon={DatabaseIcon} context="alerts" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Info alert recipe</div>
            <div className="preview-alert-attention flex items-center gap-3 px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm"><PreviewIcon icon={Alert02Icon} context="alerts" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />Attention alert recipe</div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Navigation and overlays</h4>
          <div className="mt-4 flex flex-wrap items-center" style={{ gap: system.foundations.spacing[system.components.breadcrumbs.gap] }}>
            {["Workspace", "Systems", "Northstar Labs"].map((item, index) => (
              <div key={item} className="flex items-center" style={{ gap: system.foundations.spacing[system.components.breadcrumbs.gap] }}>
                <span
                  className="text-sm"
                  style={{
                    color: index === 2 || system.components.breadcrumbs.emphasis === "strong"
                      ? "var(--preview-text-primary)"
                      : "var(--preview-text-secondary)",
                    fontWeight: index === 2 ? 600 : 500,
                  }}
                >
                  {item}
                </span>
                {index < 2 ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.breadcrumbs.separatorStyle === "slash" ? "/" : "›"}</span> : null}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center" style={{ gap: system.foundations.spacing[system.components.stepper.gap] }}>
            {["Brand", "Tokens", "Preview", "Export"].map((step, index) => (
              <div key={step} className="flex items-center" style={{ gap: system.foundations.spacing[system.components.stepper.gap] }}>
                <span
                  className="inline-flex items-center justify-center text-xs font-semibold"
                  style={{
                    width: system.foundations.spacing[system.components.stepper.markerSize],
                    height: system.foundations.spacing[system.components.stepper.markerSize],
                    borderRadius: system.components.stepper.style === "pill" ? "999px" : system.radius.md,
                    background: index <= 1 ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-border-default) 36%, transparent)",
                    color: index <= 1 ? "var(--preview-action-primary-foreground)" : "var(--preview-text-secondary)",
                  }}
                >
                  {index + 1}
                </span>
                <span className="text-sm" style={{ color: index <= 1 ? "var(--preview-text-primary)" : "var(--preview-text-secondary)" }}>{step}</span>
                {index < 3 ? <span className="h-px w-6" style={{ background: "color-mix(in srgb, var(--preview-border-default) 70%, transparent)" }} /> : null}
              </div>
            ))}
          </div>

          <h5 className="preview-heading mt-5 text-lg font-semibold">Tabs, Table, and Dialog</h5>
          <div className="mt-4 flex border p-1" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.tabs.radius], gap: system.foundations.spacing[system.components.tabs.gap] }}>
            {["Tokens", "Navigation", "Overlays"].map((tab, index) => (
              <button
                key={tab}
                className="flex-1 px-3 py-2 text-sm"
                style={index === 0 ? {
                  background: system.components.tabs.activeStyle === "pill"
                    ? system.components.tabs.tone === "strong"
                      ? "var(--preview-action-primary)"
                      : "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)"
                    : "transparent",
                  color: system.components.tabs.tone === "strong" ? "var(--preview-action-primary-foreground)" : "var(--preview-action-primary)",
                  borderRadius: system.radius[system.components.tabs.radius],
                  borderBottom: system.components.tabs.activeStyle === "underline"
                    ? `2px solid ${system.components.tabs.tone === "strong" ? "var(--preview-action-primary)" : "var(--preview-action-primary)"}`
                    : undefined,
                } : { borderRadius: system.radius[system.components.tabs.radius], color: "var(--preview-text-secondary)" }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 overflow-hidden border rounded-[var(--preview-table-radius)]" style={{ borderColor: "var(--preview-border-default)" }}>
            <div
              className="grid grid-cols-[1.3fr_0.8fr_0.9fr] px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-xs uppercase tracking-[0.16em]"
              style={{
                color: "var(--preview-text-muted)",
                background: system.components.table.headerStyle === "elevated" ? "var(--preview-surface-elevated)" : "color-mix(in srgb, var(--preview-border-default) 24%, transparent)",
              }}
            >
              <span>Component</span>
              <span>Density</span>
              <span>Status</span>
            </div>
            {[
              ["Button", system.components.table.density, "Ready"],
              ["Input", system.components.table.density, "Ready"],
              ["Dialog", system.components.table.density, "Ready"],
            ].map((row) => (
              <div
                key={row[0]}
                data-zebra={system.components.table.zebraStripes ? "true" : "false"}
                className="preview-table-row grid grid-cols-[1.3fr_0.8fr_0.9fr] px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-sm"
              >
                {row.map((cell) => (
                  <span key={cell}>{cell}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="preview-overlay mt-5 rounded-[var(--preview-dialog-radius)] p-3" style={{ display: "flex", justifyContent: system.components.dialog.presentation === "drawer" || system.components.dialog.placement === "right" ? "flex-end" : "center" }}>
            <div className="preview-elevated" style={{ maxWidth: "var(--preview-dialog-width)", width: system.components.dialog.presentation === "drawer" ? "100%" : undefined, borderRadius: "var(--preview-dialog-radius)", boxShadow: "var(--preview-dialog-shadow)" }}>
              <div className="px-[var(--preview-dialog-padding)] py-[var(--preview-dialog-padding)]">
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>
                  {system.components.dialog.mode === "alert"
                    ? "Alert dialog"
                    : system.components.dialog.presentation === "drawer"
                      ? "Drawer recipe"
                      : "Dialog recipe"}
                </p>
                <h5 className="preview-heading mt-2 text-lg font-semibold">
                  {system.components.dialog.mode === "alert"
                    ? "Confirm destructive action"
                    : system.components.dialog.presentation === "drawer"
                      ? "Inspect side panel"
                      : "Review export package"}
                </h5>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  Overlay tone, blur, radius, width, shadow, presentation, and alert-dialog treatment are all recipe-driven.
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">{system.components.dialog.mode === "alert" ? "Keep package" : "Cancel"}</button>
                  <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">{system.components.dialog.mode === "alert" ? "Delete export" : "Export now"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[1.05fr_0.95fr]">
        <div className="preview-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="preview-heading text-xl font-semibold">Data grid</h4>
            <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.dataGrid.density)} / {sectionLabel(system.components.dataGrid.selectionStyle)}</span>
          </div>
          <div className="mt-4 overflow-hidden border" style={{ borderRadius: system.radius[system.components.dataGrid.radius], borderColor: "var(--preview-border-default)" }}>
            <div
              className="grid grid-cols-[0.42fr_1.25fr_0.9fr_0.85fr_0.75fr] text-xs uppercase tracking-[0.16em]"
              style={{
                padding: system.foundations.spacing[system.components.dataGrid.cellPadding],
                color: "var(--preview-text-muted)",
                background: system.components.dataGrid.headerStyle === "elevated" ? "var(--preview-surface-elevated)" : "color-mix(in srgb, var(--preview-border-default) 24%, transparent)",
                position: system.components.dataGrid.stickyHeader ? "sticky" : "static",
                top: 0,
              }}
            >
              <span>{system.components.dataGrid.selectionStyle === "checkbox" ? "Sel" : "Row"}</span>
              <span>System</span>
              <span>Status</span>
              <span>Owner</span>
              <span>Sync</span>
            </div>
            {[
              ["□", "Northstar Labs", "Healthy", "AM", "5m"],
              ["■", "Aurelian Studio", "Review", "CL", "18m"],
              ["□", "Vector Health", "Ready", "JN", "42m"],
            ].map((row, index) => (
              <div
                key={row[1]}
                className="grid grid-cols-[0.42fr_1.25fr_0.9fr_0.85fr_0.75fr] text-sm"
                style={{
                  padding: system.foundations.spacing[system.components.dataGrid.cellPadding],
                  background: index % 2 === 1 ? "color-mix(in srgb, var(--preview-surface-elevated) 88%, transparent)" : "transparent",
                  borderTop: "1px solid var(--preview-border-default)",
                }}
              >
                {row.map((cell) => <span key={cell}>{cell}</span>)}
              </div>
            ))}
          </div>
        </div>

        <div className="preview-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="preview-heading text-xl font-semibold">Command palette</h4>
            <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.commandPalette.density)}</span>
          </div>
          <div
            className="mt-4 preview-elevated"
            style={{
              borderRadius: system.radius[system.components.commandPalette.radius],
              padding: system.foundations.spacing[system.components.commandPalette.padding],
              boxShadow: system.shadows[system.components.commandPalette.shadow],
            }}
          >
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
              <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
              <span className="min-w-0 flex-1">Search commands, screens, or tokens</span>
              {system.components.commandPalette.showShortcuts ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌘K</span> : null}
            </div>
            <div className={`mt-4 grid ${system.components.commandPalette.previewPane ? "lg:grid-cols-[0.9fr_1.1fr]" : ""}`} style={{ gap: system.components.commandPalette.density === "compact" ? "0.6rem" : "0.9rem" }}>
              <div className="grid" style={{ gap: system.components.commandPalette.density === "compact" ? "0.45rem" : "0.65rem" }}>
                {[
                  ["Open Foundations preview", "Preview"],
                  ["Export component recipes", "Action"],
                  ["Go to Dashboard layout", "Navigation"],
                ].map(([label, group], index) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[var(--preview-radius-md)] border text-sm"
                    style={{
                      padding: system.components.commandPalette.density === "compact" ? "0.65rem 0.8rem" : "0.8rem 0.95rem",
                      borderColor: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 24%, transparent)" : "var(--preview-border-default)",
                      background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 8%, transparent)" : "transparent",
                    }}
                  >
                    <div>
                      <p>{label}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--preview-text-muted)" }}>{group}</p>
                    </div>
                    {system.components.commandPalette.showShortcuts ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>↵</span> : null}
                  </div>
                ))}
              </div>
              {system.components.commandPalette.previewPane ? (
                <div className="rounded-[var(--preview-radius-md)] border p-4" style={{ borderColor: "var(--preview-border-default)", background: "var(--preview-surface)" }}>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>Preview</p>
                  <p className="mt-3 text-sm font-semibold">Open Foundations preview</p>
                  <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>Jump into palette ladders, semantic mappings, utility coverage, and QA posture.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[1fr_1fr]">
        <div className="preview-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Final inventory additions</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Forms, actions, navigation, and feedback extras</h4>
            </div>
            <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Closing the remaining gaps</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Segmented, color, rich text, field, label</p>
              <div className="mt-3 flex overflow-hidden border" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.segmentedControl.radius] }}>
                {["Brand", "Type", "Export"].map((item, index) => <span key={item} className="flex-1 px-3 py-2 text-center text-sm" style={{ background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent" }}>{item}</span>)}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-10 w-10 rounded-full border" style={{ borderColor: "var(--preview-border-default)", background: "var(--preview-action-primary)" }} />
                {system.components.colorPicker.showHex ? <span className="text-sm">#4F46E5</span> : null}
              </div>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.richTextEditor.radius] }}>
                <div className="flex gap-2 text-xs" style={{ color: "var(--preview-text-muted)" }}>
                  {(system.components.richTextEditor.toolbar === "full" ? ["B", "I", "Link", "List"] : ["B", "I"]).map((item) => <span key={item} className="rounded-full border px-2 py-1" style={{ borderColor: "var(--preview-border-default)" }}>{item}</span>)}
                </div>
                <p className="mt-3 text-sm">Rich text editor body with formatting controls.</p>
              </div>
              <div className="mt-3 grid" style={{ gap: system.foundations.spacing[system.components.field.gap] }}>
                <label className="text-sm font-medium">Field label {system.components.label.requiredMark === "text" ? "(required)" : "*"}</label>
                <div className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]">Field primitive</div>
              </div>
            </div>

            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Action family additions</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Tertiary</button>
                <button className="px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm font-medium" style={{ borderRadius: system.radius[system.components.destructiveButton.radius], background: system.components.destructiveButton.emphasis === "strong" ? "var(--preview-danger)" : "color-mix(in srgb, var(--preview-danger) 10%, transparent)", color: system.components.destructiveButton.emphasis === "strong" ? "white" : "var(--preview-danger)" }}>Delete</button>
                <button className="text-sm font-medium" style={{ width: system.foundations.spacing[system.components.fab.size], height: system.foundations.spacing[system.components.fab.size], borderRadius: "999px", background: system.components.fab.tone === "brand" ? "var(--preview-action-primary)" : "var(--preview-surface-elevated)", color: system.components.fab.tone === "brand" ? "var(--preview-action-primary-foreground)" : "var(--preview-text-primary)" }}>+</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <button className="rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>Copy link</button>
                <button className="rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>Share</button>
              </div>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>Menu and navigation menu</p>
                <div className="mt-2 grid gap-2 text-sm">
                  {["Open", "Duplicate", "Move"].map((item) => <div key={item} className="rounded-[var(--preview-radius-sm)] px-3 py-2" style={{ background: "color-mix(in srgb, var(--preview-border-default) 10%, transparent)" }}>{item}</div>)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {["Design", "Preview", "Export"].map((item, index) => <span key={item} className="rounded-full px-3 py-1" style={{ background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)" : "color-mix(in srgb, var(--preview-border-default) 12%, transparent)" }}>{item}</span>)}
                </div>
              </div>
            </div>

            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Navigation and status extras</p>
              <div className="mt-3 grid gap-2 text-sm">
                {["Getting started", "Foundations", "Components"].map((item, index) => (
                  <div key={item} className="rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      <span>{index === 1 ? "▾" : "▸"}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative" style={{ width: system.foundations.spacing[system.components.circularProgress.size], height: system.foundations.spacing[system.components.circularProgress.size] }}>
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "color-mix(in srgb, var(--preview-border-default) 38%, transparent)", borderTopColor: "var(--preview-action-primary)" }} />
                </div>
                <div className="rounded-[var(--preview-radius-md)] border px-3 py-2 text-sm" style={{ borderColor: "var(--preview-border-default)", background: system.components.offlineState.tone === "strong" ? "color-mix(in srgb, var(--preview-warning) 12%, transparent)" : "transparent" }}>Offline state active</div>
              </div>
            </div>

            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Display and overlay extras</p>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                  <span>Key</span>
                  <span style={{ color: "var(--preview-text-muted)" }}>Value</span>
                </div>
                <div className="rounded-[var(--preview-radius-md)] border px-3 py-6 text-center text-sm" style={{ borderColor: "var(--preview-border-default)" }}>Empty placeholder</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["Primary", "Secondary", "Alerts"].map((item) => <span key={item} className="rounded-full border px-3 py-1" style={{ borderColor: "var(--preview-border-default)" }}>{item}</span>)}
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px]" style={{ color: "var(--preview-text-muted)" }}>
                  {["0", "25", "50", "75"].map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="rounded-[var(--preview-radius-md)] border p-3 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>Lightbox / bottom sheet / command dialog surface</div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Pattern completions</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Layouts and reusable product flows</h4>
            </div>
            <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>System patterns</span>
          </div>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Split view and master-detail</p>
                <div className="mt-3 grid" style={{ gridTemplateColumns: `${system.foundations.containers[system.components.splitView.leftWidth]} 1fr`, gap: "0.75rem" }}>
                  <div className="rounded-[var(--preview-radius-sm)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>Master list</div>
                  <div className="rounded-[var(--preview-radius-sm)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>Detail panel</div>
                </div>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Search results layout</p>
                <div className="mt-3 grid gap-2">
                  <div className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]">Search results</div>
                  <div className="rounded-[var(--preview-radius-sm)] border px-3 py-2 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>{system.components.searchResultsLayout.filters} filters</div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Create flow</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{system.components.createFlow.layout} entry flow</p>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Edit flow</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{system.components.editFlow.autosave ? "Autosave enabled" : "Manual save"}</p>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Delete confirmation</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{system.components.deleteConfirmation.style} / {system.components.deleteConfirmation.severity}</p>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Filter and sort</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{system.components.filterSortPattern.layout} with {system.components.filterSortPattern.chips ? "chips" : "plain controls"}</p>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Empty to populated</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{system.components.emptyToPopulated.transition} transition</p>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Success confirmation</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{system.components.successConfirmation.layout} / {system.components.successConfirmation.tone}</p>
              </div>
              <div className="preview-elevated p-4 md:col-span-2">
                <p className="text-sm font-semibold">Activity history</p>
                <div className="mt-3 grid gap-2 text-sm">
                  {["Token updated", "Preview approved", "Export downloaded"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                      <span>{item}</span>
                      <span style={{ color: "var(--preview-text-muted)" }}>{system.components.activityHistory.grouping === "day" ? "Today" : `${index + 1}h`}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Not found page</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>404 template ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[1.08fr_0.92fr]">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Feedback and status</h4>
          <div className="mt-4 grid gap-4">
            <div
              className="flex flex-wrap items-center justify-between gap-3 border"
              style={{
                padding: system.foundations.spacing[system.components.banner.padding],
                borderRadius: system.radius[system.components.banner.radius],
                background: bannerBackground,
                borderColor: bannerBorder,
                color: system.components.banner.style === "solid" ? "var(--preview-action-primary-foreground)" : bannerColor,
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em]">Banner</p>
                <p className="mt-1 text-sm font-medium">Theme review is needed before publishing the next package.</p>
              </div>
              <button className="text-sm font-semibold">Review</button>
            </div>

            <div className={`grid gap-3 ${system.components.toast.placement === "floating" ? "justify-items-end" : ""}`}>
              {[["Saved draft", "All mappings synced to session state."], ["Export ready", "ZIP package can be downloaded now."]].map(([title, body]) => (
                <div
                  key={title}
                  className="border"
                  style={{
                    padding: system.foundations.spacing[system.components.toast.padding],
                    borderRadius: system.radius[system.components.toast.radius],
                    boxShadow: toastShadow,
                    background: toastBackground,
                    borderColor: "var(--preview-border-default)",
                    maxWidth: system.components.toast.placement === "floating" ? "22rem" : "100%",
                    width: "100%",
                  }}
                >
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="preview-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Progress</p>
                  {system.components.progress.showLabel ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>68%</span> : null}
                </div>
                <div className="mt-3 overflow-hidden" style={{ height: progressHeight, borderRadius: system.radius[system.components.progress.radius], background: progressTrack }}>
                  <div style={{ width: "68%", height: "100%", borderRadius: system.radius[system.components.progress.radius], background: progressFill }} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={system.components.loader.style === "spinner" ? "animate-spin" : "animate-pulse"}
                    style={{
                      width: loaderSize,
                      height: loaderSize,
                      borderRadius: "999px",
                      border: `${loaderBorderWidth} solid color-mix(in srgb, var(--preview-action-primary) 22%, transparent)`,
                      borderTopColor: "var(--preview-action-primary)",
                      boxShadow: system.components.loader.style === "orbit" ? "0 0 0 4px color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "none",
                    }}
                  />
                  <span className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>Loading exported artifacts</span>
                </div>
              </div>

              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Status markers</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Healthy", "var(--preview-success)"],
                    ["Needs review", "var(--preview-warning)"],
                    ["Blocked", "var(--preview-danger)"],
                  ].map(([label, color]) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex rounded-full"
                          style={{
                            width: statusDotSize,
                            height: statusDotSize,
                            background: system.components.statusDot.style === "solid" ? color : `color-mix(in srgb, ${color} 18%, transparent)`,
                            boxShadow: system.components.statusDot.style === "solid" ? "none" : `0 0 0 1px color-mix(in srgb, ${color} 32%, transparent)`,
                          }}
                        />
                        <span className="text-sm">{label}</span>
                      </div>
                      <span
                        className="inline-flex border text-xs font-semibold"
                        style={{
                          padding: `${system.foundations.spacing[system.components.tag.paddingY]} ${system.foundations.spacing[system.components.tag.paddingX]}`,
                          borderRadius: system.radius[system.components.tag.radius],
                          background: system.components.tag.style === "outline" ? "transparent" : tagBackground,
                          color: tagForeground,
                          borderColor: tagBorder,
                        }}
                      >
                        Tag
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Loading and state patterns</h4>
          <div className="mt-4 grid gap-4">
            <div
              className="preview-elevated"
              style={{
                padding: system.foundations.spacing[system.components.state.padding],
                borderRadius: system.radius[system.components.state.radius],
              }}
            >
              <div className={`grid gap-4 ${system.components.state.layout === "feature" ? "lg:grid-cols-[auto_1fr]" : ""}`}>
                <div
                  className="inline-flex items-center justify-center rounded-full"
                  style={{
                    width: system.components.state.layout === "feature" ? "3.5rem" : "2.75rem",
                    height: system.components.state.layout === "feature" ? "3.5rem" : "2.75rem",
                    background: system.components.state.iconEmphasis === "strong" ? "color-mix(in srgb, var(--preview-warning) 18%, transparent)" : "color-mix(in srgb, var(--preview-warning) 10%, transparent)",
                    color: "var(--preview-warning)",
                  }}
                >
                  <PreviewIcon icon={Alert02Icon} context="alerts" size={system.icons.defaultSize + 2} strokeWidth={system.icons.strokeWidth} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Empty / error / success states</p>
                  <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                    This recipe controls the shell used for product states, whether they appear as compact inline blocks or larger featured sections.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm font-medium">Dismiss</button>
                    <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm font-medium">Resolve</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Skeleton loader</p>
              <div className="mt-4 grid gap-3">
                <div className="animate-pulse rounded-full" style={{ width: "3rem", height: "3rem", background: "color-mix(in srgb, var(--preview-border-default) 24%, transparent)" }} />
                {[100, 78, 54].map((width, index) => (
                  <div
                    key={width}
                    className={index === 0 ? "animate-pulse" : ""}
                    style={{
                      width: `${width}%`,
                      height: skeletonLineHeight,
                      borderRadius: system.radius[system.components.skeleton.radius],
                      background: skeletonFill,
                      backgroundSize: "200% 100%",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-2">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Selection controls</h4>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center border"
                style={{
                  width: system.foundations.spacing[system.components.checkbox.size],
                  height: system.foundations.spacing[system.components.checkbox.size],
                  borderRadius: system.radius[system.components.checkbox.radius],
                  borderColor: "var(--preview-action-primary)",
                  background: system.components.checkbox.tone === "strong" ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)",
                }}
              >
                <span className="text-xs" style={{ color: system.components.checkbox.tone === "strong" ? "var(--preview-action-primary-foreground)" : "var(--preview-action-primary)" }}>✓</span>
              </span>
              <span className="text-sm">Checkbox</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center rounded-full"
                style={{
                  width: system.foundations.spacing[system.components.switch.trackWidth],
                  height: system.foundations.spacing[system.components.switch.trackHeight],
                  background: system.components.switch.tone === "strong" ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-action-primary) 18%, transparent)",
                  padding: "2px",
                }}
              >
                <span
                  className="rounded-full bg-white"
                  style={{
                    width: system.foundations.spacing[system.components.switch.thumbSize],
                    height: system.foundations.spacing[system.components.switch.thumbSize],
                    marginInlineStart: "auto",
                  }}
                />
              </span>
              <span className="text-sm">Switch</span>
            </div>
            <div className="grid gap-2" style={{ gap: system.foundations.spacing[system.components.radioGroup.gap] }}>
              {["Option one", "Option two", "Option three"].map((option, index) => (
                <div key={option} className="flex items-center gap-3">
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border"
                    style={{
                      borderColor: "var(--preview-action-primary)",
                      background: index === 0 && system.components.radioGroup.tone === "strong" ? "var(--preview-action-primary)" : "transparent",
                    }}
                  >
                    {index === 0 ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                  </span>
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Menus and selection</h4>
          <div className="mt-4 space-y-4">
            <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.dropdown.radius], boxShadow: system.shadows[system.components.dropdown.shadow] }}>
              <div className="px-4 py-3 text-sm font-medium">Dropdown menu</div>
              <div className="border-t" style={{ borderColor: "var(--preview-border-default)" }}>
                {["View profile", "Team settings", "Sign out"].map((item) => (
                  <div key={item} className="px-4 py-3 text-sm">{item}</div>
                ))}
              </div>
            </div>
            <div className="preview-input flex items-center justify-between" style={{ borderRadius: system.radius[system.components.combobox.radius], padding: system.foundations.spacing[system.components.combobox.padding] }}>
              <span className="text-sm">Combobox</span>
              <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌄</span>
            </div>
            <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.listbox.radius], maxWidth: system.foundations.containers[system.components.listbox.maxHeight] }}>
              {["Listbox option A", "Listbox option B", "Listbox option C"].map((item, index) => (
                <div key={item} className="text-sm" style={{ padding: system.foundations.spacing[system.components.listbox.optionPadding], background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent" }}>{item}</div>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.autocomplete.radius], padding: system.foundations.spacing[system.components.autocomplete.padding] }}>
                <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                  <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
                  <span className="min-w-0 flex-1">Autocomplete</span>
                </div>
                {system.components.autocomplete.showPreview ? (
                  <div className="mt-3 grid" style={{ gap: system.components.autocomplete.suggestionDensity === "compact" ? "0.4rem" : "0.6rem" }}>
                    {["Northstar Labs", "Northstar Health", "Northstar Commerce"].map((item, index) => (
                      <div key={item} className="text-sm" style={{ padding: system.components.autocomplete.suggestionDensity === "compact" ? "0.45rem 0.6rem" : "0.65rem 0.8rem", borderRadius: "var(--preview-radius-sm)", background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent" }}>{item}</div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.multiSelect.radius], padding: system.foundations.spacing[system.components.multiSelect.padding] }}>
                <p className="text-sm font-medium">Multi-select</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Design", "Product", "Engineering", "Ops"].slice(0, system.components.multiSelect.maxVisible).map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 text-xs font-semibold"
                      style={{
                        padding: `${system.foundations.spacing[system.components.tag.paddingY]} ${system.foundations.spacing[system.components.tag.paddingX]}`,
                        borderRadius: system.radius[system.components.multiSelect.radius],
                        background: system.components.multiSelect.tagStyle === "outline" ? "transparent" : tagBackground,
                        color: tagForeground,
                        border: `1px solid ${tagBorder}`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                  <span className="inline-flex items-center text-xs" style={{ color: "var(--preview-text-muted)" }}>+2 more</span>
                </div>
              </div>
            </div>
            <div className="flex items-center" style={{ gap: system.foundations.spacing[system.components.pagination.gap] }}>
              {["Prev", "1", "2", "3", "Next"].map((item, index) => (
                <span
                  key={item}
                  className="inline-flex items-center justify-center border text-sm"
                  style={{
                    minWidth: "2.25rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: system.radius[system.components.pagination.radius],
                    borderColor: "var(--preview-border-default)",
                    background: index === 2 ? "var(--preview-action-primary)" : "transparent",
                    color: index === 2 ? "var(--preview-action-primary-foreground)" : "var(--preview-text-primary)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div
                className="preview-elevated"
                style={{
                  padding: system.foundations.spacing[system.components.popover.padding],
                  borderRadius: system.radius[system.components.popover.radius],
                  boxShadow: system.shadows[system.components.popover.shadow],
                  background: system.components.popover.tone === "strong" ? "var(--preview-surface-elevated)" : "var(--preview-surface)",
                }}
              >
                <p className="text-sm font-semibold">Popover</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>Quick metadata and secondary actions live in a lighter overlay than full dialogs.</p>
              </div>
              <div className="flex items-center justify-start">
                <div
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: system.foundations.spacing[system.components.tooltip.padding],
                    borderRadius: system.radius[system.components.tooltip.radius],
                    background: system.components.tooltip.tone === "strong" ? "var(--preview-foreground)" : "color-mix(in srgb, var(--preview-foreground) 86%, transparent)",
                    color: "var(--preview-background)",
                  }}
                >
                  <span className="text-xs font-semibold">Tooltip</span>
                  <span className="text-xs">Used for helper explanations and compact metadata.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-2">
        <div className="preview-surface p-5">
          <div className="flex items-center justify-between" style={{ minHeight: system.foundations.spacing[system.components.navbar.height], paddingInline: system.foundations.spacing[system.components.navbar.paddingX], backdropFilter: `blur(${system.foundations.blur[system.components.navbar.blur]})` }}>
            <div className="flex items-center gap-3">
              <PreviewIcon icon={DashboardSquare01Icon} context="nav" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: system.foundations.spacing[system.components.avatar.size],
                  height: system.foundations.spacing[system.components.avatar.size],
                  borderRadius: system.radius[system.components.avatar.radius],
                  background: "var(--preview-action-primary)",
                  boxShadow: system.components.avatar.ring === "none" ? "none" : system.components.avatar.ring === "soft" ? "0 0 0 2px color-mix(in srgb, var(--preview-action-primary) 18%, transparent)" : "0 0 0 3px color-mix(in srgb, var(--preview-action-primary) 32%, transparent)",
                  color: "var(--preview-action-primary-foreground)",
                }}
              >
                NS
              </span>
              <span className="preview-heading text-lg font-semibold">Navbar</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>Docs</span>
              <span>Components</span>
              <span>Export</span>
            </div>
          </div>

          <div className="mt-5 grid" style={{ gridTemplateColumns: `${system.foundations.containers[system.components.sidebar.width]} 1fr`, gap: system.foundations.spacing[system.components.sidebar.itemGap] }}>
            <aside className="preview-elevated p-4">
              {["Overview", "Theme", "Components", "Sessions"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 text-sm" style={{ padding: "0.75rem 1rem", borderRadius: system.radius[system.components.sidebar.itemRadius], background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent" }}>
                  <PreviewIcon icon={index === 0 ? Home01Icon : index === 1 ? Settings01Icon : index === 2 ? TableIcon : UserIcon} context="nav" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
                  {item}
                </div>
              ))}
            </aside>
            <div className="preview-surface p-4">
              <p className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>Sidebar recipe controls width, gap, and item radius.</p>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Content primitives</h4>
          <div className="mt-4 space-y-4">
            <div>
              <p
                className="preview-heading font-semibold"
                style={{
                  fontSize: system.typography.scale[system.components.heading.scale].size,
                  letterSpacing: system.foundations.tracking[system.components.heading.tracking],
                  fontWeight: system.foundations.fontWeights[system.components.heading.weight],
                }}
              >
                Heading primitive
              </p>
              <p
                className="mt-2"
                style={{
                  fontSize: system.typography.scale[system.components.text.scale].size,
                  lineHeight: system.foundations.leading[system.components.text.leading],
                  color: system.components.text.tone === "primary" ? "var(--preview-text-primary)" : system.components.text.tone === "secondary" ? "var(--preview-text-secondary)" : "var(--preview-text-muted)",
                }}
              >
                Text primitive follows its own scale, leading, and tone recipe.
              </p>
            </div>
            <div className="border" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.fieldset.radius], padding: system.foundations.spacing[system.components.fieldset.padding] }}>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Fieldset</p>
              <div className="mt-3 grid gap-3">
                <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Field one" readOnly />
                <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Field two" readOnly />
              </div>
            </div>
            <div className="grid" style={{ gap: system.foundations.spacing[system.components.descriptionList.gap], gridTemplateColumns: `${system.foundations.containers[system.components.descriptionList.termWidth]} 1fr` }}>
              {[
                ["Brand", "Northstar Labs"],
                ["Theme", "Fintech / Balanced"],
                ["Export", "Tailwind v4 ready"],
              ].map(([term, value]) => (
                <div key={term} className="contents">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <PreviewIcon icon={term === "Brand" ? StarHugeIcon : term === "Theme" ? Calendar01Icon : Mail01Icon} context="tables" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
                    {term}
                  </span>
                  <span className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="border-t" style={{ borderColor: "var(--preview-border-default)", borderTopWidth: system.components.divider.thickness, marginInline: system.foundations.spacing[system.components.divider.inset] }} />
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid">
        <div className="preview-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Page and app-shell patterns</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Page headers, sections, and screen recipes</h4>
            </div>
            <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Stage 2 maturity</span>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4">
              <div className="preview-elevated p-4" style={{ maxWidth: settingsWidth }}>
                <div className="flex flex-wrap items-start justify-between gap-4" style={{ marginBottom: settingsGap }}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Page header</p>
                    <h5 className="preview-heading mt-2 text-2xl font-semibold">Theme settings</h5>
                    <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                      Settings screens inherit page width, chrome padding, and section spacing from the screen preset layer.
                    </p>
                  </div>
                  <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm font-medium">Publish changes</button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.84fr_1.16fr]" style={{ gap: settingsGap }}>
                  <aside className="preview-surface p-4" style={{ minWidth: sidebarWidth }}>
                    {["General", "Color roles", "Typography", "Exports"].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm"
                        style={{
                          padding: "0.75rem 0.875rem",
                          borderRadius: system.radius[system.components.sidebar.itemRadius],
                          background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent",
                          color: index === 1 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)",
                        }}
                      >
                        <PreviewIcon icon={index === 0 ? Home01Icon : index === 1 ? Settings01Icon : index === 2 ? DashboardSquare01Icon : DatabaseIcon} context="nav" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
                        {item}
                      </div>
                    ))}
                  </aside>
                  <div className="grid gap-4" style={{ gap: settingsGap }}>
                    <div className="preview-surface p-4">
                      <p className="text-sm font-semibold">Page section</p>
                      <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                        Description, inputs, and actions stay inside one repeatable section pattern instead of one-off page markup.
                      </p>
                    </div>
                    <div className="preview-surface p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Primary action label" readOnly />
                        <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Secondary action label" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="preview-elevated p-4" style={{ maxWidth: dataTableWidth }}>
                  <div className="flex flex-wrap items-center justify-between gap-3" style={{ marginBottom: dataTableGap }}>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Data table page</p>
                      <h5 className="preview-heading mt-2 text-lg font-semibold">Inventory overview</h5>
                    </div>
                    <div className="flex gap-2">
                      <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Filter</button>
                      <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Export</button>
                    </div>
                  </div>
                  <div className="grid gap-3" style={{ gap: dataTableGap }}>
                    <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                      <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                        <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
                        <span className="min-w-0 flex-1">Search rows</span>
                      </div>
                      <div className="preview-input flex items-center justify-between px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                        <span>Status</span>
                        <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>All</span>
                      </div>
                      <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Apply</button>
                    </div>
                    <div className="overflow-hidden rounded-[var(--preview-table-radius)] border" style={{ borderColor: "var(--preview-border-default)" }}>
                      <div
                        className="grid grid-cols-[1.2fr_0.8fr_0.7fr] px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-xs uppercase tracking-[0.16em]"
                        style={{
                          color: "var(--preview-text-muted)",
                          background: system.components.table.headerStyle === "elevated" ? "var(--preview-surface-elevated)" : "color-mix(in srgb, var(--preview-border-default) 24%, transparent)",
                        }}
                      >
                        <span>Pattern</span>
                        <span>Status</span>
                        <span>Owner</span>
                      </div>
                      {[
                        ["Tokens", "Ready", "AM"],
                        ["Layouts", "Review", "CL"],
                        ["Exports", "Ready", "JN"],
                      ].map((row) => (
                        <div key={row[0]} data-zebra={system.components.table.zebraStripes ? "true" : "false"} className="preview-table-row grid grid-cols-[1.2fr_0.8fr_0.7fr] px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-sm">
                          {row.map((cell) => <span key={cell}>{cell}</span>)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="preview-elevated p-4" style={{ maxWidth: formWidth }}>
                  <div className="flex flex-wrap items-center justify-between gap-3" style={{ marginBottom: formGap }}>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Form page layout</p>
                      <h5 className="preview-heading mt-2 text-lg font-semibold">Launch checklist</h5>
                    </div>
                    <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{sectionLabel(formPagePreset.density)}</span>
                  </div>
                  <div className="grid gap-4" style={{ gap: formGap }}>
                    <div className="preview-surface p-4">
                      <p className="text-sm font-semibold">Form section</p>
                      <div className="mt-3 grid gap-3">
                        <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Project name" readOnly />
                        <textarea className="preview-input min-h-[var(--preview-textarea-min-height)] px-[var(--preview-textarea-padding)] py-[var(--preview-textarea-padding)]" value="Supporting notes and release context." readOnly />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm font-medium">Save draft</button>
                      <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm font-medium">Submit review</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="preview-surface p-4">
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>App shell recipes</p>
                <div className="mt-3 grid gap-4">
                  <div className="preview-elevated p-4" style={{ maxWidth: system.foundations.containers[system.components.sidebarLayout.contentWidth] }}>
                    <div className="preview-surface mb-3 flex items-center justify-between px-4" style={{ minHeight: sidebarHeaderHeight }}>
                      <span className="text-sm font-medium">Sidebar shell header</span>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.sidebarLayout.contentWidth} content</span>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: `${sidebarWidth} 1fr`, gap: sidebarPageGap }}>
                      <div className="preview-surface p-4">Sidebar nav</div>
                      <div className="preview-surface p-4">Content region</div>
                    </div>
                  </div>

                  <div className="preview-elevated p-4" style={{ maxWidth: system.foundations.containers[system.components.stackedLayout.contentWidth] }}>
                    <div className="preview-surface px-4" style={{ minHeight: stackedHeaderHeight, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="text-sm font-medium">Stacked shell header</span>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.stackedLayout.pageGap} page gap</span>
                    </div>
                    <div className="mt-3 grid gap-3" style={{ gap: stackedPageGap }}>
                      <div className="preview-surface p-4">Page header region</div>
                      <div className="preview-surface p-4">Main content region</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="preview-surface p-4">
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Auth page</p>
                <div className="preview-overlay mt-3 rounded-[var(--preview-dialog-radius)] p-3">
                  <div className="preview-elevated" style={{ maxWidth: authWidth, borderRadius: system.radius[system.components.authLayout.cardRadius], padding: system.foundations.spacing[system.components.authLayout.cardPadding] }}>
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(authPreset.density)} auth preset</p>
                    <p className="preview-heading mt-2 text-lg font-semibold">Sign in</p>
                    <div className="mt-3 grid" style={{ gap: authGap }}>
                      <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Email address" readOnly />
                      <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Password" readOnly />
                      <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Continue</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="preview-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Product patterns</p>
                  <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{sectionLabel(system.components.pageTemplate.style)}</span>
                </div>
                <div className={`mt-4 grid gap-4 ${system.components.pageTemplate.alignment === "split" ? "lg:grid-cols-[1fr_0.9fr]" : ""}`}>
                  <div
                    className="preview-elevated"
                    style={{
                      borderRadius: system.radius[system.components.pageTemplate.radius],
                      padding: system.foundations.spacing[system.components.pageTemplate.padding],
                    }}
                  >
                    <p className="preview-heading text-xl font-semibold">
                      {system.components.pageTemplate.style === "maintenance"
                        ? "Scheduled maintenance in progress"
                        : system.components.pageTemplate.style === "error"
                          ? "Something blocked this workspace"
                          : "No brand systems yet"}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                      {system.components.pageTemplate.style === "maintenance"
                        ? "Exports and previews are paused while the pipeline catches up."
                        : system.components.pageTemplate.style === "error"
                          ? "The system can recover with a fresh validation run."
                          : "Create a new brand profile to generate palettes, tokens, and previews."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Primary action</button>
                      <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Secondary action</button>
                    </div>
                  </div>
                  <div
                    className="preview-surface"
                    style={{
                      borderRadius: system.radius[system.components.saveState.radius],
                      padding: system.foundations.spacing[system.components.saveState.padding],
                      background: system.components.saveState.emphasis === "strong"
                        ? "color-mix(in srgb, var(--preview-action-primary) 10%, var(--preview-surface-elevated))"
                        : "var(--preview-surface-elevated)",
                      border: "1px solid var(--preview-border-default)",
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.saveState.style)} save state</p>
                    <div className="mt-3 grid gap-2 text-sm">
                      {[
                        "Draft saved locally",
                        "Autosave synced 14 seconds ago",
                        "Last publish succeeded",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-[var(--preview-radius-sm)]"
                          style={{
                            padding: system.components.saveState.style === "inline" ? "0" : "0.55rem 0.7rem",
                            background: system.components.saveState.style === "inline" ? "transparent" : index === 2 ? "color-mix(in srgb, var(--preview-success) 8%, transparent)" : "color-mix(in srgb, var(--preview-action-primary) 6%, transparent)",
                          }}
                        >
                          <span>{item}</span>
                          <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index === 0 ? "Now" : index === 1 ? "Live" : "2m"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="preview-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Onboarding and access</p>
                  <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{sectionLabel(system.components.onboarding.layout)}</span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                  <div
                    className="preview-elevated"
                    style={{
                      borderRadius: system.radius[system.components.onboarding.radius],
                      padding: system.foundations.spacing[system.components.onboarding.padding],
                      background: system.components.onboarding.emphasis === "strong"
                        ? "color-mix(in srgb, var(--preview-action-primary) 10%, var(--preview-surface-elevated))"
                        : "var(--preview-surface-elevated)",
                    }}
                  >
                    <p className="text-sm font-semibold">Onboarding flow</p>
                    <div className="mt-3 grid gap-2 text-sm">
                      {(system.components.onboarding.layout === "spotlight"
                        ? ["Connect brand inputs", "Review generated tokens", "Export theme package"]
                        : ["Brand setup complete", "Typography chosen", "Preview approved"]
                      ).map((item, index) => (
                        <div key={item} className="flex items-center justify-between rounded-[var(--preview-radius-sm)] px-3 py-2" style={{ background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 8%, transparent)" : "transparent" }}>
                          <span>{item}</span>
                          <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index === 0 ? "Next" : "Done"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.multiStepFlow.radius], padding: system.foundations.spacing[system.components.multiStepFlow.padding] }}>
                    <p className="text-sm font-semibold">Multi-step review</p>
                    <div className="mt-3 flex items-center gap-3">
                      {["Draft", "Review", "Submit"].map((step, index) => (
                        <div key={step} className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center text-xs font-semibold" style={{ width: "1.75rem", height: "1.75rem", borderRadius: system.components.multiStepFlow.stepStyle === "pill" ? "999px" : system.radius.md, background: index <= 1 ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-border-default) 36%, transparent)", color: index <= 1 ? "var(--preview-action-primary-foreground)" : "var(--preview-text-secondary)" }}>{index + 1}</span>
                          <span className="text-sm" style={{ color: index <= 1 ? "var(--preview-text-primary)" : "var(--preview-text-secondary)" }}>{step}</span>
                          {index < 2 ? <span className="h-px w-5" style={{ background: "color-mix(in srgb, var(--preview-border-default) 70%, transparent)" }} /> : null}
                        </div>
                      ))}
                    </div>
                    {system.components.multiStepFlow.showSummary ? <p className="mt-3 text-xs" style={{ color: "var(--preview-text-muted)" }}>Summary panel is enabled for the final review step.</p> : null}
                  </div>
                  <div className="preview-elevated lg:col-span-2" style={{ borderRadius: system.radius[system.components.permissionState.radius], padding: system.foundations.spacing[system.components.permissionState.padding], background: system.components.permissionState.tone === "strong" ? "color-mix(in srgb, var(--preview-danger) 10%, var(--preview-surface-elevated))" : "var(--preview-surface-elevated)" }}>
                    <p className="text-sm font-semibold">Permission state</p>
                    <div className={`mt-3 ${system.components.permissionState.layout === "panel" ? "grid gap-3 lg:grid-cols-[1fr_auto]" : "flex flex-wrap items-center justify-between gap-3"}`}>
                      <div>
                        <p className="text-sm">You need publish access to ship this theme package.</p>
                        <p className="mt-1 text-xs" style={{ color: "var(--preview-text-muted)" }}>Request elevated access or export a draft for review.</p>
                      </div>
                      <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Request access</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[0.95fr_1.05fr]">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Content primitives</h4>
          <div className="mt-4 space-y-4">
            <div className="preview-elevated p-4">
              <p className="preview-heading text-2xl font-semibold">Heading primitive</p>
              <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                Shared heading styles inherit the heading family and semantic foreground tokens.
              </p>
            </div>
            <div className="preview-surface border p-4" style={{ borderColor: "var(--preview-border-default)" }}>
              <p className="text-sm font-medium">Text primitive</p>
              <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                Body text, helper copy, and supporting prose draw from the same type scale and body family settings.
              </p>
            </div>
            <div className="preview-surface border p-4" style={{ borderColor: "var(--preview-border-default)" }}>
              <p className="text-sm font-medium">Link primitive</p>
              <a
                href="#"
                className="mt-2 inline-flex items-center gap-2"
                style={{
                  fontSize: system.typography.scale[system.components.link.scale].size,
                  fontWeight: system.foundations.fontWeights[system.components.link.weight],
                  color: system.components.link.tone === "brand"
                    ? "var(--preview-action-primary)"
                    : system.components.link.tone === "foreground"
                      ? "var(--preview-text-primary)"
                      : "var(--preview-text-muted)",
                  textDecoration: system.components.link.underline === "always" ? "underline" : "none",
                }}
              >
                Open exported theme files
                <PreviewIcon icon={ArrowRight01Icon} context="nav" size={16} strokeWidth={system.icons.strokeWidth} />
              </a>
              <p className="mt-2 text-xs" style={{ color: "var(--preview-text-muted)" }}>
                Underline, tone, and type scale are recipe-driven.
              </p>
            </div>
            <div className="preview-surface border p-4" style={{ borderColor: "var(--preview-border-default)" }}>
              <p className="text-sm font-medium">Visually hidden primitive</p>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span>Visible label</span>
                <span className="rounded-full border px-2 py-1 text-xs" style={{ borderColor: "var(--preview-border-default)", color: "var(--preview-text-muted)" }}>
                  {system.components.visuallyHidden.labelPrefix}: Skip navigation
                </span>
              </div>
              <p className="mt-2 text-xs" style={{ color: "var(--preview-text-muted)" }}>
                {system.components.visuallyHidden.revealOnFocus ? "Reveal on focus is enabled for keyboard users." : "This stays screen-reader-only unless explicitly exposed."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center text-sm font-semibold"
                style={{
                  width: system.foundations.spacing[system.components.avatar.size],
                  height: system.foundations.spacing[system.components.avatar.size],
                  borderRadius: system.radius[system.components.avatar.radius],
                  background: "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)",
                  boxShadow: system.components.avatar.ring === "none" ? "none" : system.components.avatar.ring === "soft" ? "0 0 0 2px color-mix(in srgb, var(--preview-action-primary) 18%, transparent)" : "0 0 0 3px color-mix(in srgb, var(--preview-action-primary) 32%, transparent)",
                }}
              >
                NS
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Avatar primitive</p>
                <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Size, radius, and ring come from the avatar recipe.</p>
              </div>
            </div>
            <div className="border-t" style={{ borderColor: "var(--preview-border-default)", borderTopWidth: system.components.divider.thickness, marginInline: system.foundations.spacing[system.components.divider.inset] }} />
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Structure primitives</h4>
          <div className="mt-4 grid gap-4">
            <div className="preview-elevated p-4" style={{ position: "relative" }}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Portal primitive</p>
                <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.portal.layer}</span>
              </div>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)", background: "var(--preview-surface)" }}>
                Base page content
              </div>
              <div
                className="absolute right-4 top-4 rounded-[var(--preview-radius-md)] border px-3 py-2 text-sm"
                style={{
                  zIndex: Number(system.foundations.zIndex[system.components.portal.layer]),
                  borderColor: "var(--preview-border-default)",
                  background: system.components.portal.tone === "strong" ? "var(--preview-surface-elevated)" : "color-mix(in srgb, var(--preview-surface-elevated) 82%, var(--preview-background))",
                  transform: `translate(${system.foundations.spacing[system.components.portal.offset]}, ${system.foundations.spacing[system.components.portal.offset]})`,
                  boxShadow: "var(--preview-shadow-sm)",
                }}
              >
                Layered portal content
              </div>
            </div>
            <div className="preview-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Scroll area primitive</p>
                <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.scrollArea.scrollbar}</span>
              </div>
              <div
                className="mt-3 overflow-y-auto rounded-[var(--preview-radius-md)] border"
                style={{
                  maxHeight: system.foundations.containers[system.components.scrollArea.maxHeight],
                  borderColor: "var(--preview-border-default)",
                  padding: system.foundations.spacing[system.components.scrollArea.padding],
                  scrollbarWidth: system.components.scrollArea.scrollbar === "visible" ? "auto" : "thin",
                }}
              >
                <div className="grid gap-2 text-sm">
                  {["Theme.css", "tailwind-theme.css", "tokens.json", "components.json", "README.md", "design-system-session.json"].map((item) => (
                    <div key={item} className="rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.fieldset.radius], padding: system.foundations.spacing[system.components.fieldset.padding] }}>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Fieldset</p>
              <div className="mt-3 grid gap-3">
                <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Label + control grouping" readOnly />
                <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Field structure and support copy stay consistent across forms.</p>
              </div>
            </div>
            <div className="grid" style={{ gap: system.foundations.spacing[system.components.descriptionList.gap], gridTemplateColumns: `${system.foundations.containers[system.components.descriptionList.termWidth]} 1fr` }}>
              {[
                ["Foundation", "Spacing, radius, motion, and typography are represented here."],
                ["Components", "Recipe-driven primitives stay aligned with editable system tokens."],
                ["Export", "Preview matches the artifacts that ship out of the generator."],
              ].map(([term, description]) => (
                <div key={term} className="contents">
                  <p className="text-sm font-semibold">{term}</p>
                  <p className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[1.05fr_0.95fr]">
        <div className="preview-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Extended primitives and actions</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Layout, action, and navigation inventory</h4>
            </div>
            <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Breadth-first coverage</span>
          </div>
          <div className="mt-4 grid gap-4">
            <div className="preview-elevated p-4" style={{ borderRadius: system.radius[system.components.box.radius], boxShadow: system.components.box.surface === "raised" ? system.shadows.md : "none" }}>
              <p className="text-sm font-semibold">Box / Container / Stack / Inline / Grid</p>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)", maxWidth: system.foundations.containers[system.components.container.width], marginInline: system.components.container.align === "center" ? "auto" : "0", padding: system.foundations.spacing[system.components.container.padding] }}>
                <div className="grid" style={{ gap: system.foundations.spacing[system.components.stack.gap] }}>
                  <div className="flex flex-wrap" style={{ gap: system.foundations.spacing[system.components.inline.gap], justifyContent: system.components.inline.align === "between" ? "space-between" : system.components.inline.align === "center" ? "center" : "flex-start" }}>
                    <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Inline</span>
                    <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Stack</span>
                    <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Container</span>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${system.components.gridPrimitive.columns}, minmax(0, 1fr))`, gap: system.foundations.spacing[system.components.gridPrimitive.gap] }}>
                    {Array.from({ length: Number(system.components.gridPrimitive.columns) }).map((_, index) => (
                      <div key={index} className="rounded-[var(--preview-radius-sm)] border px-3 py-3 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>
                        Cell {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Advanced action patterns</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button className="text-sm font-medium" style={{ width: system.foundations.spacing[system.components.iconButton.size], height: system.foundations.spacing[system.components.iconButton.size], borderRadius: system.radius[system.components.iconButton.radius], background: system.components.iconButton.tone === "filled" ? "var(--preview-action-primary)" : system.components.iconButton.tone === "soft" ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent", color: system.components.iconButton.tone === "filled" ? "var(--preview-action-primary-foreground)" : "var(--preview-action-primary)", border: system.components.iconButton.tone === "ghost" ? "1px solid var(--preview-border-default)" : "none" }}>+</button>
                  <button className="text-sm font-medium" style={{ borderRadius: system.radius[system.components.splitButton.radius], padding: "0.65rem 0.9rem", background: system.components.splitButton.tone === "strong" ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)", color: system.components.splitButton.tone === "strong" ? "var(--preview-action-primary-foreground)" : "var(--preview-action-primary)" }}>Split action ▾</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Primary", "Secondary", "Tertiary"].map((item, index) => (
                    <button key={item} className="text-sm font-medium" style={{ borderRadius: system.radius[system.components.buttonGroup.radius], padding: "0.55rem 0.8rem", border: "1px solid var(--preview-border-default)", background: system.components.buttonGroup.attached && index > 0 ? "color-mix(in srgb, var(--preview-border-default) 18%, transparent)" : "transparent" }}>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>Context menu</p>
                  <div className="mt-2 grid gap-2 text-sm" style={{ gap: system.components.contextMenu.density === "compact" ? "0.35rem" : "0.55rem" }}>
                    {["Duplicate", "Share", "Delete"].map((item) => <div key={item} className="rounded-[var(--preview-radius-sm)] px-3 py-2" style={{ background: item === "Delete" ? "color-mix(in srgb, var(--preview-danger) 10%, transparent)" : "color-mix(in srgb, var(--preview-border-default) 12%, transparent)" }}>{item}</div>)}
                  </div>
                </div>
              </div>

              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Navigation additions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Overview", "Components", "Exports"].map((item, index) => (
                    <span key={item} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: system.components.anchorNav.style === "pill" ? index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)" : "color-mix(in srgb, var(--preview-border-default) 18%, transparent)" : "transparent", color: index === 0 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)", borderBottom: system.components.anchorNav.style === "underline" && index === 0 ? "2px solid var(--preview-action-primary)" : undefined }}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  {["Foundations", "Components", "Patterns"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)", paddingInlineStart: `${0.75 + index * 0.55}rem` }}>
                      <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ background: index === 0 ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-border-strong) 42%, transparent)" }} />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-[var(--preview-radius-md)] border px-3" style={{ borderColor: "var(--preview-border-default)", minHeight: system.foundations.spacing[system.components.bottomNav.height] }}>
                  {["Home", "Search", "Profile"].map((item, index) => (
                    <span key={item} className="text-sm font-medium" style={{ color: index === 0 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)" }}>{item}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <a href="#main-content" style={{ color: "var(--preview-action-primary)", textDecoration: system.components.linkButton.emphasis === "underline" ? "underline" : "none" }}>Skip link</a>
                  <button className="text-sm font-medium" style={{ color: system.components.linkButton.tone === "brand" ? "var(--preview-action-primary)" : "var(--preview-text-secondary)" }}>Link button</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Advanced controls and product flows</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Remaining inventory previewed in one surface</h4>
            </div>
            <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Mature-system breadth</span>
          </div>
          <div className="mt-4 grid gap-4">
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">OTP, stepper, select, and input group</p>
              <div className="mt-3 flex" style={{ gap: system.foundations.spacing[system.components.otpInput.gap] }}>
                {Array.from({ length: Number(system.components.otpInput.slots) }).map((_, index) => (
                  <div key={index} className="flex-1 rounded-[var(--preview-radius-sm)] border px-3 py-3 text-center text-sm" style={{ borderColor: "var(--preview-border-default)" }}>{system.components.otpInput.mask ? "•" : index + 1}</div>
                ))}
              </div>
              <div className="mt-3 flex overflow-hidden border" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.inputGroup.radius] }}>
                <span className="px-3 py-2 text-sm" style={{ background: "color-mix(in srgb, var(--preview-border-default) 18%, transparent)" }}>https://</span>
                <span className="min-w-0 flex-1 px-3 py-2 text-sm">brand.example</span>
                <span className="px-3 py-2 text-sm" style={{ background: "color-mix(in srgb, var(--preview-border-default) 12%, transparent)" }}>Check</span>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[var(--preview-radius-md)] border px-3 py-2 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>
                <span>Date-time picker</span>
                <span style={{ color: "var(--preview-text-muted)" }}>{system.components.dateTimePicker.timeFormat}</span>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[var(--preview-radius-md)] border px-3 py-2 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>
                <span>Select field</span>
                <span style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.selectField.style)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs" style={{ color: system.components.characterCount.tone === "warning" ? "var(--preview-warning)" : "var(--preview-text-muted)" }}>
                <span>Character count</span>
                <span>126 / 160</span>
              </div>
            </div>

            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Content, overlays, and product patterns</p>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)", boxShadow: system.shadows[system.components.hoverCard.shadow] }}>
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>Hover card</p>
                <p className="mt-2 text-sm">Design-system package with recent export activity and contributor notes.</p>
              </div>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>
                <pre className="overflow-x-auto text-xs" style={{ lineHeight: 1.6 }}><code>{system.components.codeBlock.lineNumbers ? "01  export const theme = {\n02    color: 'brand'\n03  };" : "export const theme = {\n  color: 'brand'\n};"}</code></pre>
              </div>
              <blockquote className="mt-3 rounded-[var(--preview-radius-md)] border-l-4 px-4 py-3 text-sm" style={{ borderLeftColor: system.components.quoteBlock.border === "accent" ? "var(--preview-action-primary)" : "var(--preview-border-strong)", background: "color-mix(in srgb, var(--preview-border-default) 10%, transparent)" }}>
                “A design system becomes valuable when teams can see how decisions scale.”
              </blockquote>
              <div className="mt-3 grid grid-cols-7 gap-2 text-xs">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div key={day + index} className="rounded-[var(--preview-radius-sm)] border px-2 py-2 text-center" style={{ borderColor: "var(--preview-border-default)", opacity: !system.components.calendarView.showWeekends && index > 4 ? 0.45 : 1 }}>{day}</div>
                ))}
              </div>
              <div className="mt-3 flex items-end gap-2">
                {[38, 62, 46, 74].map((value, index) => (
                  <div key={value} className="flex-1 rounded-t-[var(--preview-radius-sm)]" style={{ height: `${value}px`, background: index === 2 && system.components.chartCard.chartType === "line" ? "var(--preview-success)" : "var(--preview-action-primary)", opacity: system.components.chartCard.chartType === "donut" && index > 1 ? 0.45 : 1 }} />
                ))}
              </div>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>
                <div className="flex items-center justify-between text-sm">
                  <span>Sheet / side panel</span>
                  <span style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.sheet.placement)}</span>
                </div>
                <div className="mt-3 rounded-[var(--preview-radius-sm)] border px-3 py-2 text-sm" style={{ borderColor: "var(--preview-border-default)", maxWidth: system.foundations.containers[system.components.sidePanel.width] }}>Inspector details and review notes</div>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                  <span>Bulk actions</span>
                  <span>{sectionLabel(system.components.bulkActions.selectionStyle)}</span>
                </div>
                <div className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                  <span>Inline edit</span>
                  <span>{sectionLabel(system.components.inlineEdit.trigger)}</span>
                </div>
                <div className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                  <span>Notification center</span>
                  <span>{sectionLabel(system.components.notificationCenter.style)}</span>
                </div>
                <div className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                  <span>Upload flow</span>
                  <span>{sectionLabel(system.components.fileUploadFlow.layout)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[1.08fr_0.92fr]">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Data display patterns</h4>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Token groups", value: String(metrics.paletteCount) },
                { label: "Type roles", value: String(Object.keys(system.typography.scale).length) },
                { label: "Preview families", value: String(componentFamilies.length) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="preview-elevated"
                  style={{
                    padding: system.foundations.spacing[system.components.statCard.padding],
                    borderRadius: system.radius[system.components.statCard.radius],
                    background: system.components.statCard.emphasis === "strong"
                      ? "color-mix(in srgb, var(--preview-action-primary) 8%, var(--preview-surface-elevated))"
                      : "var(--preview-surface-elevated)",
                  }}
                >
                  <p className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>{item.label}</p>
                  <p className="preview-heading mt-3 text-3xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="preview-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">List and list items</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.list.style)}</span>
                </div>
                <div className="mt-4 grid" style={{ gap: system.foundations.spacing[system.components.list.gap] }}>
                  {["Palette QA report", "Accessibility review", "Export handoff"].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                      style={{
                        padding: system.foundations.spacing[system.components.list.itemPadding],
                        borderBottom: system.components.list.style === "divided" && index < 2 ? `1px solid var(--preview-border-default)` : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex rounded-full"
                          style={{
                            width: system.foundations.spacing[system.components.statusDot.size],
                            height: system.foundations.spacing[system.components.statusDot.size],
                            background: index === 0 ? "var(--preview-success)" : index === 1 ? "var(--preview-warning)" : "var(--preview-info)",
                          }}
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index === 0 ? "Ready" : index === 1 ? "Review" : "Queued"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Avatar group and description list</p>
                  <div className="flex items-center">
                    {["NS", "CL", "AM", "+2"].map((label, index) => (
                      <span
                        key={label}
                        className="inline-flex items-center justify-center text-xs font-semibold"
                        style={{
                          width: system.foundations.spacing[system.components.avatarGroup.size],
                          height: system.foundations.spacing[system.components.avatarGroup.size],
                          borderRadius: "999px",
                          marginInlineStart: index === 0 ? "0" : `calc(${system.foundations.spacing[system.components.avatarGroup.overlap]} * -1)`,
                          background: index === 3 ? "var(--preview-surface)" : "color-mix(in srgb, var(--preview-action-primary) 14%, transparent)",
                          boxShadow: system.components.avatarGroup.ring === "none" ? "none" : system.components.avatarGroup.ring === "soft" ? "0 0 0 2px var(--preview-background)" : "0 0 0 3px var(--preview-background)",
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid" style={{ gap: system.foundations.spacing[system.components.descriptionList.gap], gridTemplateColumns: `${system.foundations.containers[system.components.descriptionList.termWidth]} 1fr` }}>
                  {[
                    ["Owner", "Design systems guild"],
                    ["Cadence", "Weekly review"],
                    ["Scope", "Tokens, previews, exports"],
                  ].map(([term, value]) => (
                    <div key={term} className="contents">
                      <span className="text-sm font-semibold">{term}</span>
                      <span className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Timeline and activity feed</h4>
          <div className="mt-4 grid gap-4">
            <div className="preview-elevated p-4">
              <div className="grid" style={{ gap: system.foundations.spacing[system.components.timeline.gap] }}>
                {[
                  ["Palette generated", "2m ago"],
                  ["Semantic roles tuned", "14m ago"],
                  ["Export package reviewed", "32m ago"],
                ].map(([title, time], index) => (
                  <div key={title} className="grid grid-cols-[auto_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className="inline-flex rounded-full"
                        style={{
                          width: system.foundations.spacing[system.components.timeline.markerSize],
                          height: system.foundations.spacing[system.components.timeline.markerSize],
                          background: system.components.timeline.style === "filled" ? "var(--preview-action-primary)" : "var(--preview-background)",
                          boxShadow: system.components.timeline.style === "filled" ? "none" : "0 0 0 2px var(--preview-action-primary)",
                        }}
                      />
                      {index < 2 ? <span className="mt-2 w-px flex-1" style={{ background: "color-mix(in srgb, var(--preview-border-default) 70%, transparent)" }} /> : null}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--preview-text-muted)" }}>{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Activity feed</p>
              <div className="mt-4 grid" style={{ gap: system.foundations.spacing[system.components.activityFeed.gap] }}>
                {[
                  ["Aurelian Studio", "Updated dashboard preset spacing."],
                  ["Northstar Labs", "Exported a new Tailwind package."],
                  ["Vector Health", "Adjusted accessibility focus treatment."],
                ].map(([title, detail], index) => (
                  <div
                    key={title}
                    className="flex items-start gap-3"
                    style={{
                      padding: system.foundations.spacing[system.components.activityFeed.itemPadding],
                      borderRadius: "var(--preview-radius-md)",
                      background: system.components.activityFeed.density === "compact" ? "transparent" : "color-mix(in srgb, var(--preview-surface-elevated) 88%, white)",
                      border: system.components.activityFeed.density === "compact" ? "none" : "1px solid var(--preview-border-default)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center text-xs font-semibold"
                      style={{
                        width: system.foundations.spacing[system.components.avatar.size],
                        height: system.foundations.spacing[system.components.avatar.size],
                        borderRadius: system.radius[system.components.avatar.radius],
                        background: index === 1 ? "color-mix(in srgb, var(--preview-success) 16%, transparent)" : "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)",
                      }}
                    >
                      {title.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{detail}</p>
                    </div>
                    <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index + 1}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[0.95fr_1.05fr]">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Form structure and support</h4>
          <div className="mt-4 border" style={{ borderColor: "var(--preview-border-default)", borderRadius: system.radius[system.components.fieldset.radius], padding: system.foundations.spacing[system.components.fieldset.padding] }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Form section</p>
                <p className="mt-2 text-sm font-semibold">Brand contact details</p>
              </div>
              <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">Draft</span>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
                {system.components.input.showPrefix ? <PreviewIcon icon={Mail01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} /> : null}
                <span className="min-w-0 flex-1">Email address</span>
                {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Required</span> : null}
              </div>
              <div className={`text-xs ${messageInline ? "flex items-center justify-between gap-3" : "space-y-1"}`} style={{ color: "var(--preview-text-muted)" }}>
                <span>Helper text, validation, and field metadata now behave like a more complete form system.</span>
                <span style={{ color: "var(--preview-success)" }}>Saved</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Cancel</button>
                <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Save section</button>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Search and filter row</h4>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr_auto]">
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ borderColor: "var(--preview-input-search-border)", borderBottomColor: system.components.input.searchStyle === "underline" ? "var(--preview-border-strong)" : "var(--preview-input-search-border)", borderRadius: system.components.input.searchStyle === "underline" ? "0" : "var(--preview-input-radius)", borderWidth: system.components.input.searchStyle === "underline" ? "0 0 var(--preview-input-border-width) 0" : "var(--preview-input-border-width)" }}>
              <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
              <span className="min-w-0 flex-1">Search systems</span>
              {system.components.input.showSuffix ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌘K</span> : null}
            </div>
            <div className="preview-input flex items-center justify-between px-[var(--preview-input-px)] py-[var(--preview-input-py)]" style={{ background: "var(--preview-input-select-bg)" }}>
              <span>Status filter</span>
              <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>All ⌄</span>
            </div>
            <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Apply</button>
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--preview-text-muted)" }}>
            Search field, select field, affixes, support text, and actions now read like part of one coherent form recipe layer.
          </p>
        </div>
      </section>
    </div>
  );
}

function FoundationsPreview({ system }: { system: GeneratedSystem }) {
  const metrics = getSystemMetrics(system);
  const lightValues = resolveThemeValues(system, "light");
  const darkValues = resolveThemeValues(system, "dark");
  const paletteEntries = Object.entries(system.palettes);
  const utilityCoverageEntries = Object.entries(system.utilityCoverage);
  const screenPresetEntries = Object.entries(system.screens);
  const qaReport = auditSystem(system);

  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-surface p-5">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Foundation inventory</p>
        <h3 className="preview-heading mt-3 text-3xl font-semibold">Inspect the token system behind the generator.</h3>
        <p className="mt-3 max-w-3xl text-sm" style={{ color: "var(--preview-text-secondary)" }}>
          This view makes the current foundations, themes, utilities, and screen rules visible so we can validate the implemented inventory before adding new surface area.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{metrics.paletteCount} palettes</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{Object.keys(system.typography.scale).length} type roles</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{utilityCoverageEntries.length} utility families</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{screenPresetEntries.length} screen presets</span>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[1.15fr_0.85fr]">
        <div className="preview-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Raw palette scales</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Color ladders</h4>
            </div>
            <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>50-950</span>
          </div>
          <div className="mt-4 grid gap-4">
            {paletteEntries.map(([paletteName, scale]) => (
              <div key={paletteName} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-4 w-4 rounded-full border"
                      style={{ background: scale["500"], borderColor: "color-mix(in srgb, var(--preview-foreground) 10%, transparent)" }}
                    />
                    <p className="text-sm font-semibold">{sectionLabel(paletteName)}</p>
                  </div>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{scale["500"]}</span>
                </div>
                <div className="grid grid-cols-11 gap-2">
                  {SCALE_STEPS.map((step) => (
                    <div key={`${paletteName}-${step}`} className="space-y-2">
                      <div
                        className="h-9 rounded-[calc(var(--preview-radius-sm)*0.9)] border"
                        style={{
                          background: scale[step],
                          borderColor: "color-mix(in srgb, var(--preview-foreground) 8%, transparent)",
                        }}
                      />
                      <p className="text-center text-[10px] font-medium" style={{ color: "var(--preview-text-muted)" }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="preview-stack flex flex-col">
          <div className="preview-surface p-5">
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Theme roles</p>
            <h4 className="preview-heading mt-2 text-xl font-semibold">Semantic tokens in both modes</h4>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {([
                ["light", lightValues, system.lightTokens],
                ["dark", darkValues, system.darkTokens],
              ] as const).map(([themeName, values, tokenRefs]) => (
                <div key={themeName} className="preview-elevated p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{sectionLabel(themeName)}</p>
                    <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{Object.keys(values).length} roles</span>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {SEMANTIC_TOKEN_NAMES.map((token) => (
                      <div key={`${themeName}-${token}`} className="flex items-center gap-3 rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                        <span className="inline-flex h-4 w-4 rounded-full border" style={{ background: values[token], borderColor: "color-mix(in srgb, var(--preview-foreground) 10%, transparent)" }} />
                        <span className="min-w-0 flex-1 text-sm font-medium">{sectionLabel(token)}</span>
                        <span className="truncate text-xs" style={{ color: "var(--preview-text-muted)" }}>{tokenRefs[token]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-surface p-5">
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Font families</p>
            <h4 className="preview-heading mt-2 text-xl font-semibold">Display, heading, and body sources</h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Display", family: system.typography.displayFont, helper: "Display 1-4" },
                { label: "Heading", family: system.typography.headingFont, helper: "H1-H6" },
                { label: "Body", family: system.typography.bodyFont, helper: "Body, support, and code" },
              ].map((item) => (
                <div key={item.label} className="preview-elevated p-4">
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>{item.label}</p>
                  <p className="mt-3 text-lg font-semibold">{item.family}</p>
                  <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{item.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[0.9fr_1.1fr]">
        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Brand theme variants</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">Named theme directions</h4>
          <div className="mt-4 grid gap-3">
            {system.brandThemes.map((theme) => (
              <div key={theme.name} className="preview-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{theme.name}</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{theme.primary}</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <span className="h-8 w-16 rounded-[var(--preview-radius-sm)] border" style={{ background: resolveTokenReference(theme.primary, system.palettes), borderColor: "var(--preview-border-default)" }} />
                  <span className="h-8 w-16 rounded-[var(--preview-radius-sm)] border" style={{ background: resolveTokenReference(theme.surface, system.palettes), borderColor: "var(--preview-border-default)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Safe areas and accessibility</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">Inset rules and interaction baselines</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Safe area insets</p>
              <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3" style={{ borderColor: "var(--preview-border-default)" }}>
                <div className="rounded-[var(--preview-radius-sm)] border p-3 text-sm" style={{ borderColor: "var(--preview-border-default)", paddingTop: system.foundations.spacing[system.foundations.safeAreas.top], paddingRight: system.foundations.spacing[system.foundations.safeAreas.right], paddingBottom: system.foundations.spacing[system.foundations.safeAreas.bottom], paddingLeft: system.foundations.spacing[system.foundations.safeAreas.left] }}>
                  Safe area aware shell
                </div>
              </div>
            </div>
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Accessibility rules</p>
              <div className="mt-3 grid gap-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                <p>Contrast target {system.foundations.accessibility.contrastTarget}</p>
                <p>Keyboard {sectionLabel(system.foundations.accessibility.keyboardPattern)}</p>
                <p>Focus {sectionLabel(system.foundations.accessibility.focusTreatment)}</p>
                <p>Touch target {system.foundations.accessibility.touchTargetMin}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Typography scale</p>
            <h4 className="preview-heading mt-2 text-xl font-semibold">All current typography roles</h4>
          </div>
          <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{TYPOGRAPHY_SCALE_ORDER.length} roles</span>
        </div>
        <div className="mt-4 grid gap-3">
          {TYPOGRAPHY_SCALE_ORDER.map((token) => {
            const styleToken = system.typography.scale[token];
            const fontFamily = token.startsWith("display")
              ? "var(--preview-font-display)"
              : /^h[1-6]$/.test(token)
                ? "var(--preview-font-heading)"
                : "var(--preview-font-body)";

            return (
              <div key={token} className="grid gap-3 rounded-[var(--preview-radius-md)] border px-4 py-4 lg:grid-cols-[180px_1fr_260px]" style={{ borderColor: "var(--preview-border-default)" }}>
                <div>
                  <p className="text-sm font-semibold">{sectionLabel(token)}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--preview-text-muted)" }}>
                    {fontFamily === "var(--preview-font-display)" ? "Display family" : fontFamily === "var(--preview-font-heading)" ? "Heading family" : "Body family"}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily,
                      fontSize: styleToken.size,
                      lineHeight: styleToken.lineHeight,
                      letterSpacing: styleToken.letterSpacing,
                      fontWeight: styleToken.weight,
                    }}
                  >
                    System typography should feel deliberate at every level.
                  </p>
                </div>
                <div className="grid gap-2 text-xs" style={{ color: "var(--preview-text-secondary)" }}>
                  <p>Size {styleToken.size}</p>
                  <p>Leading {styleToken.lineHeight}</p>
                  <p>Weight {styleToken.weight}</p>
                  <p>Tracking {styleToken.letterSpacing ?? "normal"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-2">
        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Spatial scales</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">Spacing, radius, borders, and shadows</h4>
          <div className="mt-4 space-y-5">
            <div>
              <p className="text-sm font-semibold">Spacing scale</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-4 xl:grid-cols-5">
                {Object.entries(system.foundations.spacing).map(([key, value]) => (
                  <div key={key} className="preview-elevated p-3">
                    <div
                      className="rounded-[var(--preview-radius-sm)] bg-[var(--preview-action-primary)]"
                      style={{ width: value, minWidth: "12px", maxWidth: "100%", height: "12px" }}
                    />
                    <p className="mt-3 text-sm font-semibold">{key}</p>
                    <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">Radius scale</p>
                <div className="mt-3 grid gap-3">
                  {Object.entries(system.radius).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-[var(--preview-radius-sm)] border px-4 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-14 border bg-[var(--preview-surface-elevated)]" style={{ borderRadius: value, borderColor: "var(--preview-border-default)" }} />
                        <span className="text-sm font-medium">{sectionLabel(key)}</span>
                      </div>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">Shadow scale</p>
                  <div className="mt-3 grid gap-3">
                    {Object.entries(system.shadows).map(([key, value]) => (
                      <div key={key} className="preview-surface border px-4 py-4" style={{ borderColor: "var(--preview-border-default)", boxShadow: value }}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium">{sectionLabel(key)}</span>
                          <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="preview-elevated p-4">
                  <p className="text-sm font-semibold">Utility defaults</p>
                  <div className="mt-3 grid gap-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                    <p>Default radius {sectionLabel(system.utilities.layout.defaultRadius)}</p>
                    <p>Border radius {sectionLabel(system.utilities.borders.borderRadius)}</p>
                    <p>Border width {sectionLabel(system.utilities.borders.borderWidth)}</p>
                    <p>Surface shadow {sectionLabel(system.utilities.effects.surfaceShadow)}</p>
                    <p>Elevated shadow {sectionLabel(system.utilities.effects.elevatedShadow)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Layout and motion</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">Breakpoints, containers, blur, animation, presets</h4>
          <div className="mt-4 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Breakpoints</p>
                <div className="mt-3 grid gap-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  {Object.entries(system.foundations.breakpoints).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <span>{sectionLabel(key)}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Containers</p>
                <div className="mt-3 grid gap-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  {Object.entries(system.foundations.containers).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <span>{sectionLabel(key)}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Blur</p>
                <div className="mt-3 grid gap-3">
                  {Object.entries(system.foundations.blur).map(([key, value]) => (
                    <div key={key} className="rounded-[var(--preview-radius-sm)] border px-3 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                      <div className="h-10 rounded-[var(--preview-radius-sm)] border bg-white/50" style={{ borderColor: "var(--preview-border-default)", backdropFilter: `blur(${value})` }} />
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs" style={{ color: "var(--preview-text-secondary)" }}>
                        <span>{sectionLabel(key)}</span>
                        <span>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Easing</p>
                <div className="mt-3 grid gap-3">
                  {Object.entries(system.foundations.easing).map(([key, value]) => (
                    <div key={key} className="rounded-[var(--preview-radius-sm)] border px-3 py-3 text-xs" style={{ borderColor: "var(--preview-border-default)" }}>
                      <p className="font-semibold">{sectionLabel(key)}</p>
                      <p className="mt-2" style={{ color: "var(--preview-text-secondary)" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Animations</p>
                <div className="mt-3 grid gap-3">
                  {Object.entries(system.foundations.animations).map(([key, value], index) => (
                    <div key={key} className="rounded-[var(--preview-radius-sm)] border px-3 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                      <div className="h-8 w-8 rounded-full bg-[var(--preview-action-primary)]" style={{ animation: value, animationDelay: `${index * 0.08}s` }} />
                      <div className="mt-2 text-xs" style={{ color: "var(--preview-text-secondary)" }}>
                        <p className="font-semibold text-[var(--preview-text-primary)]">{sectionLabel(key)}</p>
                        <p className="mt-1">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Aspect ratios</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {Object.entries(system.foundations.aspectRatios).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="rounded-[var(--preview-radius-sm)] border bg-[var(--preview-surface)]" style={{ borderColor: "var(--preview-border-default)", aspectRatio: value }} />
                      <div className="flex items-center justify-between gap-3 text-xs" style={{ color: "var(--preview-text-secondary)" }}>
                        <span>{sectionLabel(key)}</span>
                        <span>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Screen presets</p>
                <div className="mt-3 grid gap-3">
                  {screenPresetEntries.map(([key, preset]) => (
                    <div key={key} className="rounded-[var(--preview-radius-sm)] border px-3 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{sectionLabel(key)}</p>
                        <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(preset.density)}</span>
                      </div>
                      <div className="mt-2 grid gap-1 text-xs" style={{ color: "var(--preview-text-secondary)" }}>
                        <p>Max width {system.foundations.containers[preset.maxWidth]}</p>
                        <p>Section gap {system.foundations.spacing[preset.sectionGap]}</p>
                        <p>Chrome padding {system.foundations.spacing[preset.chromePadding]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-surface p-5">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>System rules</p>
        <h4 className="preview-heading mt-2 text-xl font-semibold">Utility settings and coverage matrix</h4>
        <div className="mt-4 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="preview-elevated p-4">
            <p className="text-sm font-semibold">Utility settings snapshot</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Content width", value: system.foundations.containers[system.utilities.layout.contentWidth] },
                { label: "Section gap", value: system.foundations.spacing[system.utilities.layout.sectionGap] },
                { label: "Card gap", value: system.foundations.spacing[system.utilities.layout.cardGap] },
                { label: "Density", value: sectionLabel(system.utilities.spacing.densityMode) },
                { label: "Control height", value: system.foundations.spacing[system.utilities.sizing.controlHeight] },
                { label: "Sidebar width", value: system.foundations.containers[system.utilities.sizing.sidebarWidth] },
                { label: "Heading weight", value: system.foundations.fontWeights[system.utilities.typography.headingWeight] },
                { label: "Body leading", value: system.foundations.leading[system.utilities.typography.bodyLeading] },
                { label: "Motion level", value: sectionLabel(system.utilities.motion.motionLevel) },
                { label: "Transition ease", value: sectionLabel(system.utilities.motion.transitionEase) },
                { label: "Focus ring", value: system.utilities.interactivity.focusRingWidth },
                { label: "Selection", value: sectionLabel(system.utilities.interactivity.selectionStyle) },
              ].map((item) => (
                <div key={item.label} className="rounded-[var(--preview-radius-sm)] border px-3 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                  <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--preview-text-muted)" }}>{item.label}</p>
                  <p className="mt-2 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-elevated p-4">
            <p className="text-sm font-semibold">Utility family coverage</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {utilityCoverageEntries.map(([family, coverage]) => (
                <div key={family} className="rounded-[var(--preview-radius-sm)] border px-3 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{sectionLabel(family)}</p>
                    <span
                      className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={{
                        background: coverage.enabled
                          ? "color-mix(in srgb, var(--preview-success) 12%, transparent)"
                          : "color-mix(in srgb, var(--preview-danger) 12%, transparent)",
                        color: coverage.enabled ? "var(--preview-success)" : "var(--preview-danger)",
                      }}
                    >
                      {coverage.enabled ? "Enabled" : "Off"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="preview-badge px-2 py-1 text-[10px] font-semibold">{sectionLabel(coverage.mode)}</span>
                    <span className="preview-badge px-2 py-1 text-[10px] font-semibold">{coverage.densityAware ? "Density aware" : "Density neutral"}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5" style={{ color: "var(--preview-text-secondary)" }}>{coverage.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[0.95fr_1.05fr]">
        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Mature foundation tokens</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">Borders, opacity, durations, and stacking</h4>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(system.foundations.borderWidths).map(([key, value]) => (
                <div key={key} className="preview-elevated p-4">
                  <div className="h-10 rounded-[var(--preview-radius-sm)] bg-[var(--preview-surface)]" style={{ border: `${value} solid var(--preview-border-strong)` }} />
                  <p className="mt-3 text-sm font-semibold">{sectionLabel(key)}</p>
                  <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {Object.entries(system.foundations.opacity).map(([key, value]) => (
                <div key={key} className="preview-elevated p-4">
                  <div className="h-10 rounded-[var(--preview-radius-sm)] bg-[var(--preview-action-primary)]" style={{ opacity: value }} />
                  <p className="mt-3 text-sm font-semibold">{sectionLabel(key)}</p>
                  <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(system.foundations.durations).map(([key, value]) => (
                <div key={key} className="preview-elevated p-4">
                  <div className="h-2 rounded-full bg-[var(--preview-border-default)]">
                    <div className="h-2 rounded-full bg-[var(--preview-action-primary)]" style={{ width: key === "fast" ? "45%" : key === "standard" ? "70%" : "100%", transitionDuration: value }} />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{sectionLabel(key)}</p>
                  <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(system.foundations.zIndex).map(([key, value]) => (
                <div key={key} className="preview-elevated p-4">
                  <div className="relative h-16 rounded-[var(--preview-radius-sm)] border bg-[var(--preview-surface)]" style={{ borderColor: "var(--preview-border-default)" }}>
                    <span className="absolute left-3 top-3 h-7 w-7 rounded-full bg-[var(--preview-border-default)]" />
                    <span className="absolute left-6 top-6 h-7 w-7 rounded-full bg-[var(--preview-action-primary)]" style={{ zIndex: Number(value) }} />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{sectionLabel(key)}</p>
                  <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>z-{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Content and accessibility</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">Usage rules that now live in foundations</h4>
          <div className="mt-4 space-y-4">
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Link and list rules</p>
              <a
                href="#"
                className="mt-3 inline-block text-sm"
                style={{
                  color: "var(--preview-link-color)",
                  fontWeight: "var(--preview-link-weight)",
                  textDecorationLine: "var(--preview-link-underline)",
                  textUnderlineOffset: "0.18em",
                }}
              >
                Review the content foundation guidance
              </a>
              <ul className="mt-3 text-sm" style={{ color: "var(--preview-text-secondary)", paddingInlineStart: "var(--preview-list-indent)", display: "grid", gap: "var(--preview-list-gap)", listStyleType: system.foundations.content.lists.marker === "decimal" ? "decimal" : "disc" }}>
                <li>Link tone: {sectionLabel(system.foundations.content.links.tone)}</li>
                <li>Marker style: {sectionLabel(system.foundations.content.lists.marker)}</li>
                <li>Truncation clamp: {system.foundations.content.truncation.multiLineClamp} lines</li>
              </ul>
            </div>
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Code and truncation</p>
              <code
                className="mt-3 inline-block border"
                style={{
                  borderColor: "var(--preview-border-default)",
                  borderRadius: "var(--preview-code-radius)",
                  padding: "var(--preview-code-py) var(--preview-code-px)",
                  fontSize: system.typography.scale[system.foundations.content.code.fontScale].size,
                  lineHeight: system.typography.scale[system.foundations.content.code.fontScale].lineHeight,
                }}
              >
                npm run build && npm run lint
              </code>
              <p
                className="mt-3 text-sm"
                style={{
                  color: "var(--preview-text-secondary)",
                  maxWidth: system.foundations.containers[system.foundations.content.truncation.maxInlineSize],
                  whiteSpace: system.foundations.content.truncation.singleLine ? "nowrap" : "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                This line demonstrates how the current truncation rules constrain long content before it breaks layout rhythm across the product surface.
              </p>
            </div>
            <div className="preview-elevated p-4">
              <p className="text-sm font-semibold">Accessibility baseline</p>
              <div className="mt-3 grid gap-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                <p>Contrast target: {system.foundations.accessibility.contrastTarget}</p>
                <p>Focus treatment: {sectionLabel(system.foundations.accessibility.focusTreatment)}</p>
                <p>Keyboard pattern: {sectionLabel(system.foundations.accessibility.keyboardPattern)}</p>
                <p>Touch target minimum: {system.foundations.spacing[system.foundations.accessibility.touchTargetMin]}</p>
                <p>Screen reader prefix: {system.foundations.accessibility.screenReaderLabelPrefix}</p>
              </div>
              <button
                className="preview-button-secondary mt-4 px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium"
                style={{ minHeight: "var(--preview-touch-target-min)" }}
              >
                Focus sample
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-[0.82fr_1.18fr]">
        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>QA posture</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">System health snapshot</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="preview-elevated p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--preview-text-muted)" }}>Score</p>
              <p className="preview-heading mt-3 text-4xl font-semibold">{qaReport.score}</p>
            </div>
            <div className="preview-elevated p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--preview-text-muted)" }}>Export readiness</p>
              <p className="mt-3 text-lg font-semibold">{sectionLabel(qaReport.exportReadiness)}</p>
            </div>
            <div className="preview-elevated p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--preview-text-muted)" }}>Contrast warnings</p>
              <p className="mt-3 text-lg font-semibold">{qaReport.contrastWarnings.length}</p>
            </div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Findings</p>
          <h4 className="preview-heading mt-2 text-xl font-semibold">What the built-in QA is currently reporting</h4>
          <div className="mt-4 grid gap-3">
            {qaReport.findings.length ? qaReport.findings.map((finding) => (
              <div key={finding.label} className="rounded-[var(--preview-radius-sm)] border px-4 py-3" style={{ borderColor: "var(--preview-border-default)" }}>
                <p className="text-sm font-semibold">{sectionLabel(finding.severity)}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{finding.label}</p>
              </div>
            )) : (
              <div className="rounded-[var(--preview-radius-sm)] border px-4 py-4 text-sm" style={{ borderColor: "color-mix(in srgb, var(--preview-success) 25%, transparent)", background: "color-mix(in srgb, var(--preview-success) 10%, transparent)", color: "var(--preview-text-primary)" }}>
                The current system passes the built-in QA checks with no active findings.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="preview-surface p-5">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Export inventory</p>
        <h4 className="preview-heading mt-2 text-xl font-semibold">Artifacts already generated by the system</h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ["tokens.json", "Full token payload including palettes, themes, typography, icons, utilities, and screens."],
            ["components.json", "Component recipes and icon settings for downstream system usage."],
            ["theme.css", "Reusable CSS custom property output for the generated design system."],
            ["tailwind-theme.css", "Tailwind v4-ready @theme file for direct project integration."],
            ["README.md", "Developer handoff guidance for setup, usage, and export structure."],
            ["design-system-session.json", "Round-trip session file so a system can be loaded back into the app."],
          ].map(([fileName, description]) => (
            <div key={fileName} className="preview-elevated p-4">
              <p className="text-sm font-semibold">{fileName}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IconsPreview({ system }: { system: GeneratedSystem }) {
  const iconSize = system.icons.defaultSize;
  const iconStroke = system.icons.strokeWidth;
  const iconShowcase = [
    { label: "Buttons", icon: ArrowRight01Icon, context: "buttons" as const },
    { label: "Alerts", icon: Alert02Icon, context: "alerts" as const },
    { label: "Navigation", icon: Home01Icon, context: "nav" as const },
    { label: "Tables", icon: TableIcon, context: "tables" as const },
    { label: "Inputs", icon: Search01Icon, context: "inputs" as const },
    { label: "Analytics", icon: Analytics01Icon, context: "tables" as const },
    { label: "Mail", icon: Mail01Icon, context: "inputs" as const },
    { label: "Settings", icon: Settings01Icon, context: "nav" as const },
  ];

  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-surface p-5">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Icon library</p>
        <h3 className="preview-heading mt-3 text-3xl font-semibold">Hugeicons are now part of the design system surface.</h3>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--preview-text-secondary)" }}>
          Default size, stroke width, color behavior, and semantic icon usage all come from the editable icon system.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{iconSize}px default size</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{iconStroke.toFixed(1)} stroke</span>
          <span className="preview-badge px-[var(--preview-badge-px)] py-[var(--preview-badge-py)] text-xs font-semibold">{sectionLabel(system.icons.colorBehavior)} color mode</span>
        </div>
      </section>

      <section className="preview-grid-gap grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="preview-elevated p-5">
          <h4 className="preview-heading text-xl font-semibold">System icon grid</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {iconShowcase.map((item) => (
              <div key={item.label} className="preview-surface flex items-center gap-3 px-4 py-3">
                <PreviewIcon icon={item.icon} context={item.context} size={iconSize} strokeWidth={iconStroke} />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(item.context)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="preview-elevated p-5">
          <h4 className="preview-heading text-xl font-semibold">Context usage</h4>
          <div className="mt-4 space-y-4">
            <button className="preview-button-primary flex items-center gap-3 px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">
              <PreviewIcon icon={ArrowRight01Icon} context="buttons" size={iconSize} strokeWidth={iconStroke} />
              Export theme
            </button>
            <div className="preview-input flex items-center gap-3 px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
              <PreviewIcon icon={Search01Icon} context="inputs" size={iconSize} strokeWidth={iconStroke} />
              <span style={{ color: "var(--preview-text-muted)" }}>Search tokens</span>
            </div>
            <div className="preview-alert-warning flex items-center gap-3 px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">
              <PreviewIcon icon={Alert02Icon} context="alerts" size={iconSize} strokeWidth={iconStroke} />
              Alert icons inherit the alert semantic usage token.
            </div>
            <div className="preview-surface flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <PreviewIcon icon={Menu01Icon} context="nav" size={iconSize} strokeWidth={iconStroke} />
                <span className="font-medium">Navigation item</span>
              </div>
              <PreviewIcon icon={Notification03Icon} context="nav" size={iconSize} strokeWidth={iconStroke} />
            </div>
            <div className="preview-surface overflow-hidden border rounded-[var(--preview-table-radius)]" style={{ borderColor: "var(--preview-border-default)" }}>
              <div className="flex items-center justify-between px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-sm">
                <div className="flex items-center gap-3">
                  <PreviewIcon icon={TableIcon} context="tables" size={iconSize} strokeWidth={iconStroke} />
                  Data exports
                </div>
                <PreviewIcon icon={ChartHistogramIcon} context="tables" size={iconSize} strokeWidth={iconStroke} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardPreview({ brandName, system }: { brandName: string; system: GeneratedSystem }) {
  const metrics = getSystemMetrics(system);
  const dashboardPreset = system.screens.dashboard;
  const dashboardGap = system.foundations.spacing[dashboardPreset.sectionGap];
  const dashboardBannerColor = resolveTokenReference(system.components.banner.color, system.palettes);
  const dashboardBannerBackground = system.components.banner.style === "solid"
    ? dashboardBannerColor
    : `color-mix(in srgb, ${dashboardBannerColor} ${system.components.banner.style === "outlined" ? "10%" : "14%"}, transparent)`;
  const dashboardBannerBorder = system.components.banner.style === "outlined"
    ? `color-mix(in srgb, ${dashboardBannerColor} 34%, transparent)`
    : "transparent";
  const dashboardToastBackground = system.components.toast.tone === "strong"
    ? "var(--preview-surface-elevated)"
    : "color-mix(in srgb, var(--preview-surface-elevated) 82%, var(--preview-background))";
  const dashboardToastShadow = system.shadows[system.components.toast.shadow];
  const dashboardProgressTrack = system.components.progress.tone === "strong"
    ? "color-mix(in srgb, var(--preview-action-primary) 16%, transparent)"
    : "color-mix(in srgb, var(--preview-border-default) 52%, transparent)";
  const dashboardProgressFill = system.components.progress.tone === "strong"
    ? "var(--preview-action-primary)"
    : "color-mix(in srgb, var(--preview-action-primary) 78%, white)";

  return (
    <div className="preview-grid-gap grid xl:grid-cols-[220px_1fr]">
      <aside className="preview-surface space-y-4 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Workspace</p>
          <h3 className="preview-heading mt-2 text-xl font-semibold">{brandName}</h3>
        </div>
        {["Overview", "Design tokens", "Exports", "Brand profiles"].map((item, index) => (
          <button
            key={item}
            className="flex w-full items-center rounded-[var(--preview-radius-md)] px-3 py-3 text-left text-sm"
            style={{
              background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent",
              color: index === 1 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)",
            }}
          >
            {item}
          </button>
        ))}
      </aside>

      <div className="preview-stack flex flex-col">
        <nav className="preview-surface flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Top nav</p>
            <h3 className="preview-heading mt-2 text-2xl font-semibold">Design system operations</h3>
          </div>
          <button className="preview-button-primary rounded-[var(--preview-radius-pill)] px-4 py-3 font-medium">Publish theme package</button>
        </nav>

        <section className="preview-surface p-5">
          <div className="mb-4 flex flex-wrap items-center" style={{ gap: system.foundations.spacing[system.components.breadcrumbs.gap] }}>
            {["Workspace", "Operations", "Northstar Labs"].map((item, index) => (
              <div key={item} className="flex items-center" style={{ gap: system.foundations.spacing[system.components.breadcrumbs.gap] }}>
                <span className="text-sm" style={{ color: index === 2 ? "var(--preview-text-primary)" : "var(--preview-text-secondary)", fontWeight: index === 2 ? 600 : 500 }}>{item}</span>
                {index < 2 ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.breadcrumbs.separatorStyle === "slash" ? "/" : "›"}</span> : null}
              </div>
            ))}
          </div>

          <div
            className="mb-4 flex flex-wrap items-center justify-between gap-3 border"
            style={{
              padding: system.foundations.spacing[system.components.banner.padding],
              borderRadius: system.radius[system.components.banner.radius],
              background: dashboardBannerBackground,
              borderColor: dashboardBannerBorder,
              color: system.components.banner.style === "solid" ? "var(--preview-action-primary-foreground)" : dashboardBannerColor,
            }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.16em]">Release banner</p>
              <p className="mt-1 text-sm font-medium">Two component families still need sign-off before this theme package ships.</p>
            </div>
            <button className="text-sm font-semibold">Open QA</button>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4" style={{ marginBottom: dashboardGap }}>
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Page header</p>
              <h4 className="preview-heading mt-2 text-2xl font-semibold">Operations dashboard</h4>
              <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                Dashboard screens pull max-width, density, section spacing, and chrome padding from the dashboard screen preset.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Share</button>
              <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Create profile</button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]" style={{ gap: dashboardGap }}>
            <div className="preview-input flex items-center gap-3" style={{ paddingInline: system.foundations.spacing[system.components.searchField.paddingX], paddingBlock: system.foundations.spacing[system.components.searchField.paddingY], borderColor: system.components.searchField.style === "underline" ? "transparent" : "var(--preview-border-default)", borderBottomColor: system.components.searchField.style === "underline" ? "var(--preview-border-strong)" : undefined, borderRadius: system.components.searchField.style === "underline" ? "0" : system.radius[system.components.searchField.radius], borderWidth: system.components.searchField.style === "underline" ? "0 0 var(--preview-input-border-width) 0" : "var(--preview-input-border-width)" }}>
              <PreviewIcon icon={Search01Icon} context="inputs" size={system.icons.defaultSize} strokeWidth={system.icons.strokeWidth} />
              <span className="min-w-0 flex-1">Search systems and exports</span>
              {system.components.searchField.showShortcut ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌘K</span> : null}
            </div>
            <div className="preview-input flex items-center justify-between px-[var(--preview-input-px)] py-[var(--preview-input-py)]">
              <span>Theme health</span>
              <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>All</span>
            </div>
            <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Filters</button>
          </div>

          <div className="mt-4 flex items-center" style={{ gap: system.foundations.spacing[system.components.stepper.gap] }}>
            {["Profile", "Review", "Export"].map((step, index) => (
              <div key={step} className="flex items-center" style={{ gap: system.foundations.spacing[system.components.stepper.gap] }}>
                <span
                  className="inline-flex items-center justify-center text-xs font-semibold"
                  style={{
                    width: system.foundations.spacing[system.components.stepper.markerSize],
                    height: system.foundations.spacing[system.components.stepper.markerSize],
                    borderRadius: system.components.stepper.style === "pill" ? "999px" : system.radius.md,
                    background: index === 0 ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-border-default) 36%, transparent)",
                    color: index === 0 ? "var(--preview-action-primary-foreground)" : "var(--preview-text-secondary)",
                  }}
                >
                  {index + 1}
                </span>
                <span className="text-sm" style={{ color: index === 0 ? "var(--preview-text-primary)" : "var(--preview-text-secondary)" }}>{step}</span>
                {index < 2 ? <span className="h-px w-6" style={{ background: "color-mix(in srgb, var(--preview-border-default) 70%, transparent)" }} /> : null}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="min-w-[12rem] flex-1">
              {system.components.progress.showLabel ? <div className="mb-2 flex items-center justify-between text-xs" style={{ color: "var(--preview-text-muted)" }}><span>Release readiness</span><span>82%</span></div> : null}
              <div className="overflow-hidden" style={{ height: system.foundations.spacing[system.components.progress.height], borderRadius: system.radius[system.components.progress.radius], background: dashboardProgressTrack }}>
                <div style={{ width: "82%", height: "100%", borderRadius: system.radius[system.components.progress.radius], background: dashboardProgressFill }} />
              </div>
            </div>

            <div
              className="border"
              style={{
                padding: system.foundations.spacing[system.components.toast.padding],
                borderRadius: system.radius[system.components.toast.radius],
                boxShadow: dashboardToastShadow,
                background: dashboardToastBackground,
                borderColor: "var(--preview-border-default)",
                maxWidth: "20rem",
              }}
            >
                <p className="text-sm font-semibold">Toast / notification</p>
                <p className="mt-1 text-sm" style={{ color: "var(--preview-text-secondary)" }}>Theme export finished and the session file is ready.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.autocomplete.radius], padding: system.foundations.spacing[system.components.autocomplete.padding] }}>
                <p className="text-sm font-semibold">Autocomplete</p>
                <div className="mt-3 grid" style={{ gap: system.components.autocomplete.suggestionDensity === "compact" ? "0.4rem" : "0.6rem" }}>
                  {["Northstar Labs", "Northstar Growth", "Northstar Health"].map((item, index) => (
                    <div key={item} className="text-sm" style={{ padding: system.components.autocomplete.suggestionDensity === "compact" ? "0.45rem 0.6rem" : "0.65rem 0.8rem", borderRadius: "var(--preview-radius-sm)", background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent" }}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.multiSelect.radius], padding: system.foundations.spacing[system.components.multiSelect.padding] }}>
                <p className="text-sm font-semibold">Multi-select filters</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Finance", "Healthcare", "Editorial", "SaaS"].slice(0, system.components.multiSelect.maxVisible).map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 text-xs font-semibold"
                      style={{
                        padding: `${system.foundations.spacing[system.components.tag.paddingY]} ${system.foundations.spacing[system.components.tag.paddingX]}`,
                        borderRadius: system.radius[system.components.multiSelect.radius],
                        background: system.components.multiSelect.tagStyle === "outline" ? "transparent" : "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)",
                        color: "var(--preview-action-primary)",
                        border: `1px solid color-mix(in srgb, var(--preview-action-primary) 24%, transparent)`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                  <span className="inline-flex items-center text-xs" style={{ color: "var(--preview-text-muted)" }}>+2 more</span>
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.dateRangePicker.radius], padding: system.foundations.spacing[system.components.dateRangePicker.padding] }}>
                <p className="text-sm font-semibold">Date range</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Apr 01", "Apr 19", "vs prev."].slice(0, system.components.dateRangePicker.showComparison ? 3 : 2).map((item, index) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-[var(--preview-radius-pill)] border px-3 py-1 text-xs font-medium"
                      style={{
                        borderColor: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 28%, transparent)" : "var(--preview-border-default)",
                        background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 9%, transparent)" : "transparent",
                        color: index === 0 ? "var(--preview-action-primary)" : "var(--preview-text-secondary)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.fileUpload.radius], padding: system.foundations.spacing[system.components.fileUpload.padding], border: `1px dashed ${system.components.fileUpload.dragState === "strong" ? "var(--preview-action-primary)" : "var(--preview-border-strong)"}` }}>
                <p className="text-sm font-semibold">Asset upload</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  {system.components.fileUpload.style === "dropzone" ? "Drop revised logos and exports here." : "Attach files inline inside the workflow."}
                </p>
                {system.components.fileUpload.showPreview ? <p className="mt-2 text-xs" style={{ color: "var(--preview-text-muted)" }}>2 files staged for review</p> : null}
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.dataGrid.radius], padding: system.foundations.spacing[system.components.dataGrid.cellPadding] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Data grid</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.dataGrid.selectionStyle)}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  {[
                    ["□", "Northstar Labs", "Healthy"],
                    ["■", "Aurelian Studio", "Review"],
                    ["□", "Vector Health", "Ready"],
                  ].map((row, index) => (
                    <div key={row[1]} className="grid grid-cols-[0.32fr_1.18fr_0.9fr] rounded-[var(--preview-radius-sm)]" style={{ padding: system.components.dataGrid.density === "compact" ? "0.5rem 0.65rem" : "0.65rem 0.8rem", background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 8%, transparent)" : "var(--preview-surface)" }}>
                      {row.map((cell) => <span key={cell}>{cell}</span>)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: "var(--preview-radius-lg)", padding: "1rem" }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Density slider</p>
                  {system.components.slider.showValue ? <span className="text-xs font-medium" style={{ color: "var(--preview-action-primary)" }}>72%</span> : null}
                </div>
                <div className="mt-4 relative" style={{ height: system.foundations.spacing[system.components.slider.thumbSize] }}>
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full" style={{ height: system.foundations.spacing[system.components.slider.trackHeight], background: dashboardProgressTrack }} />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full" style={{ width: "72%", height: system.foundations.spacing[system.components.slider.trackHeight], background: "var(--preview-action-primary)" }} />
                  <span className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm" style={{ left: "calc(72% - 0.5rem)", width: system.foundations.spacing[system.components.slider.thumbSize], height: system.foundations.spacing[system.components.slider.thumbSize], background: "var(--preview-action-primary)" }} />
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.commandPalette.radius], padding: system.foundations.spacing[system.components.commandPalette.padding], boxShadow: system.shadows[system.components.commandPalette.shadow] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Command palette</p>
                  {system.components.commandPalette.showShortcuts ? <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>⌘K</span> : null}
                </div>
                <div className="mt-3 grid" style={{ gap: system.components.commandPalette.density === "compact" ? "0.45rem" : "0.65rem" }}>
                  {["Open Foundations preview", "Go to component recipes", "Export system package"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-[var(--preview-radius-sm)] border text-sm" style={{ padding: system.components.commandPalette.density === "compact" ? "0.55rem 0.7rem" : "0.7rem 0.85rem", borderColor: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 24%, transparent)" : "var(--preview-border-default)", background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 8%, transparent)" : "transparent" }}>
                      <span>{item}</span>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.commandPalette.showShortcuts ? "↵" : "Run"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.saveState.radius], padding: system.foundations.spacing[system.components.saveState.padding] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Save states</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.saveState.style)}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  {["Draft saved", "Autosave running", "Publish complete"].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-[var(--preview-radius-sm)]"
                      style={{
                        padding: system.components.saveState.style === "inline" ? "0" : "0.55rem 0.7rem",
                        background: system.components.saveState.style === "inline" ? "transparent" : index === 2 ? "color-mix(in srgb, var(--preview-success) 8%, transparent)" : "color-mix(in srgb, var(--preview-action-primary) 6%, transparent)",
                      }}
                    >
                      <span>{item}</span>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index === 0 ? "Now" : index === 1 ? "Live" : "2m"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.pageTemplate.radius], padding: system.foundations.spacing[system.components.pageTemplate.padding] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Template state</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.pageTemplate.style)}</span>
                </div>
                <p className="mt-3 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  {system.components.pageTemplate.style === "maintenance"
                    ? "This workspace is temporarily paused for maintenance."
                    : system.components.pageTemplate.style === "error"
                      ? "A blocking issue needs review before publishing."
                      : "No brand systems match the current filters yet."}
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm"
                    style={{
                      color: system.components.link.tone === "brand" ? "var(--preview-action-primary)" : system.components.link.tone === "foreground" ? "var(--preview-text-primary)" : "var(--preview-text-muted)",
                      textDecoration: system.components.link.underline === "always" ? "underline" : "none",
                      fontWeight: system.foundations.fontWeights[system.components.link.weight],
                    }}
                  >
                    Review recovery steps
                    <PreviewIcon icon={ArrowRight01Icon} context="nav" size={16} strokeWidth={system.icons.strokeWidth} />
                  </a>
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.onboarding.radius], padding: system.foundations.spacing[system.components.onboarding.padding] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Onboarding</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.onboarding.layout)}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  {(system.components.onboarding.layout === "spotlight"
                    ? ["Connect brand", "Choose fonts", "Export system"]
                    : ["Brand complete", "Preview approved", "Export ready"]
                  ).map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-[var(--preview-radius-sm)] px-3 py-2" style={{ background: index === 0 ? "color-mix(in srgb, var(--preview-action-primary) 8%, transparent)" : "transparent" }}>
                      <span>{item}</span>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index === 0 ? "Next" : "Done"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.permissionState.radius], padding: system.foundations.spacing[system.components.permissionState.padding], background: system.components.permissionState.tone === "strong" ? "color-mix(in srgb, var(--preview-danger) 10%, var(--preview-surface-elevated))" : "var(--preview-surface-elevated)" }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Permission state</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.permissionState.layout)}</span>
                </div>
                <p className="mt-3 text-sm" style={{ color: "var(--preview-text-secondary)" }}>Publish access is required to release this package to the shared workspace.</p>
                <button className="mt-4 preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">Request access</button>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.multiStepFlow.radius], padding: system.foundations.spacing[system.components.multiStepFlow.padding] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Multi-step flow</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{sectionLabel(system.components.multiStepFlow.stepStyle)}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {["Draft", "Review", "Submit"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center text-xs font-semibold" style={{ width: "1.75rem", height: "1.75rem", borderRadius: system.components.multiStepFlow.stepStyle === "pill" ? "999px" : system.radius.md, background: index <= 1 ? "var(--preview-action-primary)" : "color-mix(in srgb, var(--preview-border-default) 36%, transparent)", color: index <= 1 ? "var(--preview-action-primary-foreground)" : "var(--preview-text-secondary)" }}>{index + 1}</span>
                      <span className="text-sm" style={{ color: index <= 1 ? "var(--preview-text-primary)" : "var(--preview-text-secondary)" }}>{step}</span>
                    </div>
                  ))}
                </div>
                {system.components.multiStepFlow.showSummary ? <p className="mt-3 text-xs" style={{ color: "var(--preview-text-muted)" }}>Summary panel remains visible before submit.</p> : null}
              </div>
              <div className="preview-elevated" style={{ borderRadius: "var(--preview-radius-lg)", padding: "1rem", position: "relative" }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Portal layer</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.portal.layer}</span>
                </div>
                <div className="mt-3 rounded-[var(--preview-radius-md)] border p-3 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>
                  Base workspace content
                </div>
                <div
                  className="absolute right-5 top-14 rounded-[var(--preview-radius-md)] border px-3 py-2 text-xs"
                  style={{
                    zIndex: Number(system.foundations.zIndex[system.components.portal.layer]),
                    borderColor: "var(--preview-border-default)",
                    background: system.components.portal.tone === "strong" ? "var(--preview-surface-elevated)" : "color-mix(in srgb, var(--preview-surface-elevated) 82%, var(--preview-background))",
                    transform: `translate(${system.foundations.spacing[system.components.portal.offset]}, ${system.foundations.spacing[system.components.portal.offset]})`,
                    boxShadow: "var(--preview-shadow-sm)",
                  }}
                >
                  Layered details
                </div>
              </div>
              <div className="preview-elevated" style={{ borderRadius: system.radius[system.components.scrollArea.radius], padding: system.foundations.spacing[system.components.scrollArea.padding] }}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Scroll area</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{system.components.scrollArea.scrollbar}</span>
                </div>
                <div className="mt-3 overflow-y-auto rounded-[var(--preview-radius-md)] border" style={{ maxHeight: system.foundations.containers[system.components.scrollArea.maxHeight], borderColor: "var(--preview-border-default)", padding: "0.5rem", scrollbarWidth: system.components.scrollArea.scrollbar === "visible" ? "auto" : "thin" }}>
                  <div className="grid gap-2 text-sm">
                    {["Northstar Labs", "Aurelian Studio", "Vector Health", "Helio Systems", "Monarch Grid", "Atlas Health"].map((item) => (
                      <div key={item} className="rounded-[var(--preview-radius-sm)] border px-3 py-2" style={{ borderColor: "var(--preview-border-default)" }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="preview-elevated"
                style={{
                  padding: system.foundations.spacing[system.components.popover.padding],
                  borderRadius: system.radius[system.components.popover.radius],
                  boxShadow: system.shadows[system.components.popover.shadow],
                  background: system.components.popover.tone === "strong" ? "var(--preview-surface-elevated)" : "var(--preview-surface)",
                }}
              >
                <p className="text-sm font-semibold">Popover</p>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>QA notes and metadata can surface here without taking over the page.</p>
              </div>
              <div className="preview-overlay rounded-[var(--preview-dialog-radius)] p-3" style={{ display: "flex", justifyContent: "center" }}>
                <div className="preview-elevated" style={{ maxWidth: "20rem", borderRadius: system.radius[system.components.dialog.radius], boxShadow: system.shadows[system.components.dialog.shadow] }}>
                  <div className="px-[var(--preview-dialog-padding)] py-[var(--preview-dialog-padding)]">
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>{system.components.dialog.mode === "alert" ? "Alert dialog" : "Dialog"}</p>
                    <p className="mt-2 text-sm font-semibold">{system.components.dialog.mode === "alert" ? "Delete this export package?" : "Review package details"}</p>
                    <div className="mt-3 flex gap-3">
                      <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">{system.components.dialog.mode === "alert" ? "Cancel" : "Close"}</button>
                      <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] text-sm">{system.components.dialog.mode === "alert" ? "Delete" : "Confirm"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>

        <div className="preview-grid-gap grid lg:grid-cols-3">
          {[
            { label: "Tokens generated", value: String(metrics.tokenCount) },
            { label: "Custom palettes", value: String(metrics.customPaletteCount) },
            { label: "Export files", value: String(metrics.exportFileCount) },
          ].map((card) => (
            <div
              key={card.label}
              className="preview-elevated"
              style={{
                padding: system.foundations.spacing[system.components.statCard.padding],
                borderRadius: system.radius[system.components.statCard.radius],
                background: system.components.statCard.emphasis === "strong"
                  ? "color-mix(in srgb, var(--preview-action-primary) 8%, var(--preview-surface-elevated))"
                  : "var(--preview-surface-elevated)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>{card.label}</p>
              <p className="preview-heading mt-3 text-4xl font-semibold">{card.value}</p>
              <p className="mt-3 text-sm" style={{ color: "var(--preview-text-muted)" }}>Updated live from the token editor panel.</p>
            </div>
          ))}
        </div>

        <div className="preview-grid-gap grid xl:grid-cols-[1.2fr_0.8fr]">
          <section className="preview-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="preview-heading text-xl font-semibold">Brand profiles</h4>
              <div className="flex gap-2">
                <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Search systems" readOnly />
                <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)]">Filter</button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden border rounded-[var(--preview-table-radius)]" style={{ borderColor: "var(--preview-border-default)" }}>
              <div
                className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr] px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-xs uppercase tracking-[0.16em]"
                style={{
                  color: "var(--preview-text-muted)",
                  background: system.components.table.headerStyle === "elevated" ? "var(--preview-surface-elevated)" : "color-mix(in srgb, var(--preview-border-default) 24%, transparent)",
                }}
              >
                <span>Brand</span>
                <span>Direction</span>
                <span>Theme health</span>
                <span>Owner</span>
              </div>
              {[
                ["Northstar Labs", "Fintech", "Healthy", "AM"],
                ["Aurelian Studio", "Editorial", "Review", "CL"],
                ["Vector Health", "Minimal", "Healthy", "JN"],
              ].map((row) => (
                <div key={row[0]} data-zebra={system.components.table.zebraStripes ? "true" : "false"} className="preview-table-row grid grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr] px-[var(--preview-table-px)] py-[var(--preview-table-py)] text-sm">
                  {row.map((cell) => (
                    <span key={cell}>{cell}</span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="preview-stack flex flex-col">
            <div className="preview-surface p-5">
              <h4 className="preview-heading text-xl font-semibold">Form section</h4>
              <div className="mt-4 space-y-3">
                <input className="preview-input w-full px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Token group name" readOnly />
                <textarea className="preview-input w-full min-h-[var(--preview-textarea-min-height)] rounded-[var(--preview-textarea-radius)] px-[var(--preview-textarea-padding)] py-[var(--preview-textarea-padding)]" value="Design rationale and implementation notes." readOnly />
                <button className="preview-button-primary w-full px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Save mapping</button>
              </div>
            </div>

            <div className="preview-overlay rounded-[var(--preview-dialog-radius)] p-3" style={{ display: "flex", justifyContent: system.components.dialog.presentation === "drawer" || system.components.dialog.placement === "right" ? "flex-end" : "center" }}>
              <div className="preview-elevated p-5" style={{ maxWidth: "var(--preview-dialog-width)", width: system.components.dialog.presentation === "drawer" ? "100%" : undefined, borderRadius: "var(--preview-dialog-radius)", boxShadow: "var(--preview-dialog-shadow)" }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>{system.components.dialog.presentation === "drawer" ? "Drawer preview" : "Dialog preview"}</p>
                <h4 className="preview-heading mt-2 text-xl font-semibold">Export package</h4>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  Includes theme CSS, Tailwind v4 theme layer, JSON tokens, component recipes, README, and a reusable session file.
                </p>
                <div className="mt-4 border px-[var(--preview-dialog-padding)] py-[var(--preview-dialog-padding)] text-sm rounded-[var(--preview-dialog-radius)]" style={{ borderColor: "var(--preview-border-default)" }}>
                  {metrics.exportFileCount} files ready for ZIP download
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MarketingPreview({ brandName, system }: { brandName: string; system: GeneratedSystem }) {
  const metrics = getSystemMetrics(system);

  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-surface overflow-hidden p-6">
        <div className="preview-grid-gap grid lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--preview-text-muted)" }}>Marketing preview</p>
            <h2 className="preview-display mt-3 text-[clamp(3rem,5vw,5rem)] leading-[0.92] font-semibold">
              Turn a logo and a few colors into a real product system.
            </h2>
            <p className="mt-4 max-w-xl text-base" style={{ color: "var(--preview-text-secondary)" }}>
              {brandName} teams can shape palettes, semantic roles, typography, and export artifacts without hand-authoring every token by hand.
            </p>
            <p className="mt-3 text-sm" style={{ color: "var(--preview-text-muted)" }}>
              {metrics.paletteCount} palettes, {metrics.customPaletteCount} custom palettes, and {metrics.exportFileCount} production-ready files.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Generate theme</button>
              <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Preview dashboard</button>
            </div>
          </div>

          <div className="preview-grid-gap grid sm:grid-cols-2">
            {["OKLCH scales", "Semantic tokens", "Tailwind export", "Dark mode"].map((item) => (
              <div key={item} className="preview-elevated p-4">
                <div className="h-10 w-10 rounded-2xl" style={{ background: "color-mix(in srgb, var(--preview-action-primary) 14%, transparent)" }} />
                <p className="mt-4 font-medium">{item}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  Tuned for practical product work rather than decorative mock outputs.
                </p>
              </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="preview-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Avatar group</p>
                  <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>Owners</span>
                </div>
                <div className="mt-4 flex items-center">
                  {["AM", "CL", "JN", "+3"].map((label, index) => (
                    <span
                      key={label}
                      className="inline-flex items-center justify-center text-xs font-semibold"
                      style={{
                        width: system.foundations.spacing[system.components.avatarGroup.size],
                        height: system.foundations.spacing[system.components.avatarGroup.size],
                        borderRadius: "999px",
                        marginInlineStart: index === 0 ? "0" : `calc(${system.foundations.spacing[system.components.avatarGroup.overlap]} * -1)`,
                        background: index === 3 ? "var(--preview-surface)" : "color-mix(in srgb, var(--preview-action-primary) 14%, transparent)",
                        boxShadow: system.components.avatarGroup.ring === "none" ? "none" : system.components.avatarGroup.ring === "soft" ? "0 0 0 2px var(--preview-background)" : "0 0 0 3px var(--preview-background)",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="preview-elevated p-4">
                <p className="text-sm font-semibold">Activity feed</p>
                <div className="mt-4 grid" style={{ gap: system.foundations.spacing[system.components.activityFeed.gap] }}>
                  {[
                    ["Northstar Labs", "Published a new token package."],
                    ["Aurelian Studio", "Adjusted marketing typography."],
                    ["Vector Health", "Resolved two contrast warnings."],
                  ].map(([title, detail], index) => (
                    <div
                      key={title}
                      className="flex items-start gap-3"
                      style={{
                        padding: system.foundations.spacing[system.components.activityFeed.itemPadding],
                        borderRadius: "var(--preview-radius-md)",
                        background: system.components.activityFeed.density === "compact" ? "transparent" : "color-mix(in srgb, var(--preview-surface-elevated) 88%, white)",
                        border: system.components.activityFeed.density === "compact" ? "none" : "1px solid var(--preview-border-default)",
                      }}
                    >
                      <span
                        className="inline-flex items-center justify-center text-xs font-semibold"
                        style={{
                          width: system.foundations.spacing[system.components.avatar.size],
                          height: system.foundations.spacing[system.components.avatar.size],
                          borderRadius: system.radius[system.components.avatar.radius],
                          background: index === 2 ? "color-mix(in srgb, var(--preview-success) 16%, transparent)" : "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)",
                        }}
                      >
                        {title.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="mt-1 text-sm" style={{ color: "var(--preview-text-secondary)" }}>{detail}</p>
                      </div>
                      <span className="text-xs" style={{ color: "var(--preview-text-muted)" }}>{index + 1}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

      <section className="preview-grid-gap grid lg:grid-cols-3">
        {[
          "Generate usable palette ladders with intentional 500 anchors.",
          "Preview real components, dashboards, and landing surfaces instantly.",
          "Ship a reusable package for Tailwind CSS v4 projects.",
        ].map((text, index) => (
          <div key={text} className="preview-surface p-5">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Feature 0{index + 1}</p>
            <h3 className="preview-heading mt-3 text-2xl font-semibold">{text}</h3>
            <p className="mt-3 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
              Each section reflects the same semantic token model, so UI and marketing surfaces feel related.
            </p>
          </div>
        ))}
      </section>

      <section className="preview-elevated p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Call to action</p>
            <h3 className="preview-heading mt-3 text-3xl font-semibold">Export a token package your team can ship this sprint.</h3>
          </div>
          <button className="preview-button-primary rounded-[var(--preview-radius-pill)] px-5 py-3 font-medium">Download starter kit</button>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--preview-radius-lg)] border px-4 py-3 text-sm" style={{ borderColor: "var(--preview-border-default)", color: "var(--preview-text-secondary)" }}>
        <span>{brandName} design system handoff</span>
        <span>Built for product, brand, and engineering teams</span>
      </footer>
    </div>
  );
}

export function DesignSystemGenerator() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [system, setSystem] = useState(() => createGeneratedSystem(INITIAL_INPUTS));
  const [previewMode, setPreviewMode] = useState<PreviewMode>("dashboard");
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>("light");
  const [controlView, setControlView] = useState<ControlPanelView>("inputs");

  function updateInputs(updater: (current: BrandInputs) => BrandInputs) {
    setInputs((current) => {
      const next = updater(current);
      setSystem(createGeneratedSystem(next));
      return next;
    });
  }

  const colorErrors = useMemo(() => {
    const errors: Record<string, string | undefined> = {
      primaryColor: isValidHex(inputs.primaryColor) ? undefined : "Use a valid hex color like #635bff.",
      secondaryColor: inputs.secondaryColor && !isValidHex(inputs.secondaryColor) ? "Use a valid hex color or leave it blank." : undefined,
      accentColor: inputs.accentColor && !isValidHex(inputs.accentColor) ? "Use a valid hex color or leave it blank." : undefined,
      neutralBaseHex: inputs.neutralBasePreference === "custom" && !isValidHex(inputs.neutralBaseHex)
        ? "Use a valid hex color for the custom neutral anchor."
        : undefined,
    };

    if (inputs.advancedPaletteInputs) {
      for (const [key, value] of Object.entries(inputs.paletteOverrides)) {
        errors[`paletteOverrides.${key}`] = value && !isValidHex(value)
          ? "Use a valid hex color or leave this override blank."
          : undefined;
      }

      for (const color of inputs.customColors) {
        errors[`customColors.${color.id}.name`] = color.hex && !color.name.trim()
          ? "Add a color name so the custom palette can be exported cleanly."
          : undefined;
        errors[`customColors.${color.id}.hex`] = color.hex && !isValidHex(color.hex)
          ? "Use a valid hex color like #7c3aed."
          : !color.hex && color.name.trim()
            ? "Add a hex color for this custom palette."
            : undefined;
      }
    }

    return errors;
  }, [inputs]);

  const qaReport = useMemo(() => auditSystem(system), [system]);

  return (
    <main className="mx-auto w-full max-w-[1880px] px-4 py-5 sm:px-6 lg:px-8">
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.45rem] border border-app-border/70 bg-app-surface/80 px-5 py-4 backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Generator Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-app-foreground">
            Brand seeds in, production-ready theme files out.
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-app-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-app-border bg-app-bg px-3 py-2"><Layers3 className="h-4 w-4" /> Semantic tokens</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-app-border bg-app-bg px-3 py-2"><MonitorCog className="h-4 w-4" /> Live product previews</span>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="panel rounded-[1.25rem] p-3">
            <div className="flex flex-wrap gap-2">
              {([
                ["inputs", "Brand inputs"],
                ["editor", "Editable tokens"],
              ] as const).map(([view, label]) => (
                <button
                  key={view}
                  type="button"
                  className="workspace-tab"
                  data-active={controlView === view}
                  onClick={() => setControlView(view)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {controlView === "inputs" ? (
            <BrandInputPanel inputs={inputs} setInputs={updateInputs} colorErrors={colorErrors} />
          ) : (
            <TokenPanel setInputs={setInputs} system={system} setSystem={setSystem} brandName={inputs.brandName} />
          )}
        </div>

        <div className="space-y-4">
          <div className="panel rounded-[1.25rem] p-4">
            <p className="text-sm font-semibold text-app-foreground">Live generation is active</p>
            <p className="mt-1 text-sm text-app-muted">
              Brand inputs regenerate palettes and semantics instantly. Use the unified control sidebar to switch between setup and token editing without shrinking the live preview.
            </p>
          </div>

          <PreviewPanel
            brandName={inputs.brandName}
            logoDataUrl={inputs.logoDataUrl}
            system={system}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            contrastWarnings={qaReport.contrastWarnings}
            qualityScore={qaReport.score}
            exportReadiness={qaReport.exportReadiness}
          />
        </div>
      </section>
    </main>
  );
}
