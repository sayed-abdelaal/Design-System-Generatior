"use client";

import Image from "next/image";
import type { ChangeEvent, CSSProperties, Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
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
  Density,
  GeneratedSystem,
  PALETTE_NAMES,
  PaletteName,
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

const INITIAL_INPUTS: BrandInputs = {
  brandName: "Northstar Labs",
  primaryColor: "#635bff",
  secondaryColor: "#d06d2f",
  accentColor: "#0ea5a4",
  neutralBasePreference: "balanced",
  headingFont: "fraunces",
  bodyFont: "manrope",
  styleDirection: "fintech",
  logoDataUrl: null,
};

const PREVIEW_MODES = ["ui-kit", "components", "dashboard", "marketing"] as const;
type PreviewMode = (typeof PREVIEW_MODES)[number];
type ActiveTheme = "light" | "dark";
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
  const defaultRadius = system.radius[system.utilities.layout.defaultRadius];
  const borderWidthMap = {
    hairline: "1px",
    default: "1.5px",
    strong: "2px",
  } as const;
  const selectionMap = {
    brand: "color-mix(in oklch, var(--preview-action-primary) 22%, white)",
    neutral: "color-mix(in oklch, var(--preview-text-muted) 20%, white)",
  } as const;
  const buttonSecondaryBg = system.components.button.secondaryStyle === "soft"
    ? "color-mix(in srgb, var(--preview-action-secondary) 14%, transparent)"
    : "transparent";
  const buttonSecondaryBorder = system.components.button.secondaryStyle === "soft"
    ? "color-mix(in srgb, var(--preview-action-secondary) 35%, var(--preview-border-default))"
    : "var(--preview-action-secondary)";
  const badgeSoftBg = "color-mix(in srgb, var(--preview-action-primary) 12%, transparent)";
  const badgeSolidBg = "var(--preview-action-primary)";
  const alertStrongSuccessBg = "color-mix(in srgb, var(--preview-success) 18%, transparent)";
  const alertSoftSuccessBg = "color-mix(in srgb, var(--preview-success) 12%, transparent)";
  const alertStrongWarningBg = "color-mix(in srgb, var(--preview-warning) 22%, transparent)";
  const alertSoftWarningBg = "color-mix(in srgb, var(--preview-warning) 14%, transparent)";
  const alertStrongDangerBg = "color-mix(in srgb, var(--preview-danger) 18%, transparent)";
  const alertSoftDangerBg = "color-mix(in srgb, var(--preview-danger) 12%, transparent)";
  const hoverLiftMap = {
    none: "0px",
    sm: "1px",
    md: "2px",
  } as const;
  const ghostBg = system.components.button.ghostStyle === "minimal"
    ? "transparent"
    : "color-mix(in srgb, var(--preview-surface-elevated) 88%, transparent)";
  const alertBorderVariant = system.components.alert.variantStyle === "outlined"
    ? "color-mix(in srgb, currentColor 40%, transparent)"
    : "transparent";
  const dialogOverlay = system.components.dialog.overlayTone === "strong"
    ? "color-mix(in srgb, var(--preview-foreground) 34%, transparent)"
    : "color-mix(in srgb, var(--preview-foreground) 18%, transparent)";

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
    "--preview-font-heading": system.typography.headingFont,
    "--preview-font-body": system.typography.bodyFont,
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
    "--preview-border-width": borderWidthMap[system.utilities.borders.borderWidth],
    "--preview-surface-shadow": system.shadows[system.utilities.effects.surfaceShadow],
    "--preview-elevated-shadow": system.shadows[system.utilities.effects.elevatedShadow],
    "--preview-transition-ease": system.foundations.easing[system.utilities.motion.transitionEase],
    "--preview-stack-gap": system.foundations.spacing[system.utilities.spacing.stackGap],
    "--preview-card-gap": system.foundations.spacing[system.utilities.layout.cardGap],
    "--preview-focus-ring-width": system.utilities.interactivity.focusRingWidth,
    "--preview-control-cursor": system.utilities.interactivity.controlCursor,
    "--preview-selection-bg": selectionMap[system.utilities.interactivity.selectionStyle],
    "--preview-button-radius": system.radius[system.components.button.radius],
    "--preview-button-shadow": system.shadows[system.components.button.primaryShadow],
    "--preview-button-px": system.foundations.spacing[system.components.button.paddingX],
    "--preview-button-py": system.foundations.spacing[system.components.button.paddingY],
    "--preview-button-secondary-bg": buttonSecondaryBg,
    "--preview-button-secondary-border": buttonSecondaryBorder,
    "--preview-button-ghost-bg": ghostBg,
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
    "--preview-textarea-radius": system.radius[system.components.textarea.radius],
    "--preview-textarea-padding": system.foundations.spacing[system.components.textarea.padding],
    "--preview-textarea-min-height": system.foundations.spacing[system.components.textarea.minHeight],
    "--preview-badge-radius": system.radius[system.components.badge.radius],
    "--preview-badge-px": system.foundations.spacing[system.components.badge.paddingX],
    "--preview-badge-py": system.foundations.spacing[system.components.badge.paddingY],
    "--preview-badge-bg": system.components.badge.style === "solid" ? badgeSolidBg : badgeSoftBg,
    "--preview-badge-fg": system.components.badge.style === "solid" ? "var(--preview-action-primary-foreground)" : "var(--preview-action-primary)",
    "--preview-alert-radius": system.radius[system.components.alert.radius],
    "--preview-alert-padding": system.foundations.spacing[system.components.alert.padding],
    "--preview-alert-success-bg": system.components.alert.emphasis === "strong" ? alertStrongSuccessBg : alertSoftSuccessBg,
    "--preview-alert-success-border": system.components.alert.variantStyle === "outlined" ? alertBorderVariant : "color-mix(in srgb, var(--preview-success) 26%, transparent)",
    "--preview-alert-warning-bg": system.components.alert.emphasis === "strong" ? alertStrongWarningBg : alertSoftWarningBg,
    "--preview-alert-warning-border": system.components.alert.variantStyle === "outlined" ? alertBorderVariant : "color-mix(in srgb, var(--preview-warning) 28%, transparent)",
    "--preview-alert-danger-bg": system.components.alert.emphasis === "strong" ? alertStrongDangerBg : alertSoftDangerBg,
    "--preview-alert-danger-border": system.components.alert.variantStyle === "outlined" ? alertBorderVariant : "color-mix(in srgb, var(--preview-danger) 24%, transparent)",
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
  if (previewMode === "dashboard") {
    return "dashboard" as const;
  }

  if (previewMode === "marketing") {
    return "marketing" as const;
  }

  if (previewMode === "components") {
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

function tokenReferenceOptions() {
  return PALETTE_NAMES.flatMap((paletteName) =>
    SCALE_STEPS.map((step) => `${paletteName}.${step}` as TokenReference),
  );
}

function BrandInputPanel({
  inputs,
  setInputs,
  colorErrors,
}: {
  inputs: BrandInputs;
  setInputs: (updater: (current: BrandInputs) => BrandInputs) => void;
  colorErrors: Partial<Record<"primaryColor" | "secondaryColor" | "accentColor", string>>;
}) {
  function handleInputChange(key: keyof BrandInputs, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
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
    <div className="panel subtle-grid sticky top-5 overflow-hidden rounded-[1.6rem]">
      <div className="border-b border-app-border/70 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Brand Inputs</p>
        <h1 className="mt-3 max-w-xs text-2xl font-semibold tracking-[-0.04em] text-app-foreground">
          Tailwind Design System Generator
        </h1>
        <p className="mt-2 text-sm leading-6 text-app-muted">
          Craft a shippable theme from a brand seed, preview it in context, and export Tailwind-ready files.
        </p>
      </div>

      <div className="space-y-6 px-5 py-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-app-foreground">Brand name</span>
          <input
            className="field"
            value={inputs.brandName}
            onChange={(event) => handleInputChange("brandName", event.target.value)}
            placeholder="Enter brand name"
          />
        </label>

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
                  className="h-12 w-14 cursor-pointer rounded-2xl border border-app-border bg-transparent p-1"
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-app-foreground">Neutral base</span>
            <select
              className="field"
              value={inputs.neutralBasePreference}
              onChange={(event) => handleInputChange("neutralBasePreference", event.target.value)}
            >
              <option value="balanced">Balanced</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="slate">Slate</option>
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
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

        <div className="space-y-2">
          <span className="text-sm font-medium text-app-foreground">Logo upload</span>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[1.1rem] border border-dashed border-app-border bg-app-surface px-4 py-4">
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
      <div className="panel rounded-[1.6rem] p-4">
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

      <div className="preview-shell panel overflow-hidden rounded-[2rem]" style={previewStyle}>
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
          <div style={{ maxWidth: previewMetrics.maxWidth }}>
            {previewMode === "ui-kit" ? (
              <UIKitPreview system={system} />
            ) : previewMode === "components" ? (
              <ComponentsPreview system={system} />
            ) : previewMode === "dashboard" ? (
              <DashboardPreview brandName={brandName} system={system} />
            ) : (
              <MarketingPreview brandName={brandName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenPanel({
  inputs,
  setInputs,
  system,
  setSystem,
  brandName,
}: {
  inputs: BrandInputs;
  setInputs: Dispatch<SetStateAction<BrandInputs>>;
  system: GeneratedSystem;
  setSystem: Dispatch<SetStateAction<GeneratedSystem>>;
  brandName: string;
}) {
  const tokenOptions = useMemo(() => tokenReferenceOptions(), []);

  function updatePaletteValue(palette: PaletteName, step: ScaleStep, value: string) {
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

  function updateTypographyValue(key: "headingFont" | "bodyFont", value: string) {
    const font = FONT_OPTIONS.find((item) => item.id === value);

    if (!font) {
      return;
    }

    setSystem((current) => ({
      ...current,
      typography: {
        ...current.typography,
        [key]: font.cssVariable,
      },
    }));
  }

  function updateDensity(value: Density) {
    setSystem((current) => ({ ...current, density: value }));
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
        JSON.stringify({ version: 1, inputs, system }, null, 2),
        "application/json",
      );
      return;
    }

    downloadTextFile("README.md", buildReadme(brandName), "text/markdown");
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
    <div className="panel sticky top-5 rounded-[1.6rem]">
      <div className="border-b border-app-border/70 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Editable Tokens</p>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-app-foreground">Tune before export</h2>
        <p className="mt-2 text-sm leading-6 text-app-muted">
          Adjust raw scales, semantic token mappings, typography, radius, shadows, and export production-ready assets.
        </p>
      </div>

      <div className="max-h-[calc(100vh-4rem)] space-y-5 overflow-auto px-5 py-5">
        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Palette className="h-4 w-4" /> Raw color scales</span>
          </summary>
          <div className="space-y-5 border-t border-app-border/70 px-4 py-4">
            {PALETTE_NAMES.map((paletteName) => (
              <div key={paletteName} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-app-foreground">{sectionLabel(paletteName)}</h3>
                  <div className="flex gap-1">
                    {SCALE_STEPS.slice(0, 5).map((step) => (
                      <span
                        key={step}
                        className="h-5 w-5 rounded-full border border-white/70"
                        style={{ background: system.palettes[paletteName][step] }}
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
                        value={system.palettes[paletteName][step]}
                        onChange={(event) => updatePaletteValue(paletteName, step, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>

        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4" /> Tailwind foundations</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(system.foundations.spacing).map(([key, value]) => (
                <label key={`spacing-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Spacing {key}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          spacing: { ...current.foundations.spacing, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(system.foundations.fontWeights).map(([key, value]) => (
                <label key={`weight-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Weight {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          fontWeights: { ...current.foundations.fontWeights, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
              {Object.entries(system.foundations.tracking).map(([key, value]) => (
                <label key={`tracking-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Tracking {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          tracking: { ...current.foundations.tracking, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
              {Object.entries(system.foundations.leading).map(([key, value]) => (
                <label key={`leading-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Leading {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          leading: { ...current.foundations.leading, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(system.foundations.breakpoints).map(([key, value]) => (
                <label key={`breakpoint-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Breakpoint {key}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          breakpoints: { ...current.foundations.breakpoints, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
              {Object.entries(system.foundations.containers).map(([key, value]) => (
                <label key={`container-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Container {key}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          containers: { ...current.foundations.containers, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-2">
              {Object.entries(system.foundations.blur).map(([key, value]) => (
                <label key={`blur-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Blur {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          blur: { ...current.foundations.blur, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-2">
              {Object.entries(system.foundations.easing).map(([key, value]) => (
                <label key={`ease-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Easing {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          easing: { ...current.foundations.easing, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
              {Object.entries(system.foundations.animations).map(([key, value]) => (
                <label key={`animation-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Animation {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          animations: { ...current.foundations.animations, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(system.foundations.insetShadows).map(([key, value]) => (
                <label key={`inset-shadow-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Inset shadow {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          insetShadows: { ...current.foundations.insetShadows, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
              {Object.entries(system.foundations.dropShadows).map(([key, value]) => (
                <label key={`drop-shadow-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Drop shadow {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          dropShadows: { ...current.foundations.dropShadows, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
              {Object.entries(system.foundations.aspectRatios).map(([key, value]) => (
                <label key={`aspect-${key}`} className="space-y-1 text-xs text-app-muted">
                  <span>Aspect {sectionLabel(key)}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        foundations: {
                          ...current.foundations,
                          aspectRatios: { ...current.foundations.aspectRatios, [key]: event.target.value },
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </details>

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
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
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
                <span>Pagination radius</span>
                <select className="field px-3 py-2 text-sm" value={system.components.pagination.radius}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, pagination: { ...current.components.pagination, radius: event.target.value as typeof current.components.pagination.radius } },
                  }))}>
                  {Object.keys(system.radius).map((key) => <option key={key} value={key}>{key}</option>)}
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
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
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
                <span>Auth card width</span>
                <select className="field px-3 py-2 text-sm" value={system.components.authLayout.cardWidth}
                  onChange={(event) => setSystem((current) => ({
                    ...current,
                    components: { ...current.components, authLayout: { ...current.components.authLayout, cardWidth: event.target.value as typeof current.components.authLayout.cardWidth } },
                  }))}>
                  {Object.keys(system.foundations.containers).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
            </div>
          </div>
        </details>

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
                      <select
                        className="field px-3 py-2"
                        value={system[themeName][token]}
                        onChange={(event) => updateThemeToken(themeName, token, event.target.value as TokenReference)}
                      >
                        {tokenOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>

        <details open className="rounded-[1.3rem] border border-app-border bg-app-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-app-foreground">
            <span className="inline-flex items-center gap-2"><Type className="h-4 w-4" /> Typography and chrome</span>
          </summary>
          <div className="space-y-4 border-t border-app-border/70 px-4 py-4">
            <div className="grid gap-3">
              <label className="space-y-2">
                <span className="text-sm text-app-muted">Heading font</span>
                <select
                  className="field"
                  value={FONT_OPTIONS.find((font) => font.cssVariable === system.typography.headingFont)?.id}
                  onChange={(event) => updateTypographyValue("headingFont", event.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-app-muted">Body font</span>
                <select
                  className="field"
                  value={FONT_OPTIONS.find((font) => font.cssVariable === system.typography.bodyFont)?.id}
                  onChange={(event) => updateTypographyValue("bodyFont", event.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(system.radius).map(([key, value]) => (
                <label key={key} className="space-y-1 text-xs text-app-muted">
                  <span>Radius {key.toUpperCase()}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        radius: { ...current.radius, [key]: event.target.value },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-2">
              {Object.entries(system.shadows).map(([key, value]) => (
                <label key={key} className="space-y-1 text-xs text-app-muted">
                  <span>Shadow {key.toUpperCase()}</span>
                  <input
                    className="field px-3 py-2 text-sm"
                    value={value}
                    onChange={(event) =>
                      setSystem((current) => ({
                        ...current,
                        shadows: { ...current.shadows, [key]: event.target.value },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <label className="space-y-2">
              <span className="text-sm text-app-muted">Density</span>
              <select
                className="field"
                value={system.density}
                onChange={(event) => updateDensity(event.target.value as Density)}
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="airy">Airy</option>
              </select>
            </label>
          </div>
        </details>

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
      </div>
    </div>
  );
}

function UIKitPreview({ system }: { system: GeneratedSystem }) {
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
            <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Primary button</button>
            <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Secondary action</button>
            <button className="preview-button-ghost px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Ghost action</button>
          </div>
          <div className="grid gap-3">
            <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Workspace name" readOnly />
            <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="success" value="Brand color validated" readOnly />
            <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="error" value="Accent color needs contrast help" readOnly />
            {system.components.input.showHelperText ? (
              <p className="text-xs" style={{ color: "var(--preview-text-muted)" }}>
                {`Helper text ${" "}`}
                <span style={{ display: "inline-block" }}>
                  stays attached to control recipes.
                </span>
              </p>
            ) : null}
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
            </div>
          </div>

          <div className="preview-surface p-5">
            <div className="flex rounded-full border p-1" style={{ borderColor: "var(--preview-border-default)" }}>
              {["Overview", "Components", "States"].map((tab, index) => (
                <button
                  key={tab}
                  className="preview-tab flex-1 rounded-full border border-transparent px-3 py-2 text-sm"
                  data-active={index === 0}
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
  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-surface p-5">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--preview-text-muted)" }}>Component lab</p>
        <h3 className="preview-heading mt-3 text-3xl font-semibold">Inspect variants, states, and system recipes in one place.</h3>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--preview-text-secondary)" }}>
          Every example below is using the same component recipe layer you edit in the right panel.
        </p>
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
            <div>
              <input className="preview-input w-full px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Default input" readOnly />
              {system.components.input.showHelperText ? (
                <p className="mt-2 text-xs" style={{ color: "var(--preview-text-muted)" }}>Helper text follows the component recipe toggle.</p>
              ) : null}
            </div>
            <div>
              <input className="preview-input w-full px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="success" value="Success state" readOnly />
              <p className="mt-2 text-xs" style={{ color: "var(--preview-success)" }}>Everything checks out.</p>
            </div>
            <div>
              <input className="preview-input w-full px-[var(--preview-input-px)] py-[var(--preview-input-py)]" data-state="error" value="Error state" readOnly />
              <p className="mt-2 text-xs" style={{ color: "var(--preview-danger)" }}>Needs a more accessible accent value.</p>
            </div>
            <textarea className="preview-input w-full min-h-[var(--preview-textarea-min-height)] rounded-[var(--preview-textarea-radius)] px-[var(--preview-textarea-padding)] py-[var(--preview-textarea-padding)]" value="Textarea recipe uses its own min-height and padding settings." readOnly />
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
            <div className="preview-alert-success px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Success alert recipe</div>
            <div className="preview-alert-warning px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Warning alert recipe</div>
            <div className="preview-alert-danger px-[var(--preview-alert-padding)] py-[var(--preview-alert-padding)] text-sm">Danger alert recipe</div>
          </div>
        </div>

        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Table and Dialog</h4>
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

          <div className="preview-overlay mt-5 rounded-[var(--preview-dialog-radius)] p-3">
            <div className="preview-elevated" style={{ maxWidth: "var(--preview-dialog-width)", borderRadius: "var(--preview-dialog-radius)", boxShadow: "var(--preview-dialog-shadow)" }}>
              <div className="px-[var(--preview-dialog-padding)] py-[var(--preview-dialog-padding)]">
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Dialog recipe</p>
                <h5 className="preview-heading mt-2 text-lg font-semibold">Review export package</h5>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  Overlay tone, blur, radius, width, and shadow are all recipe-driven.
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="preview-button-secondary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Cancel</button>
                  <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Export now</button>
                </div>
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
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-2">
        <div className="preview-surface p-5">
          <div className="flex items-center justify-between" style={{ minHeight: system.foundations.spacing[system.components.navbar.height], paddingInline: system.foundations.spacing[system.components.navbar.paddingX], backdropFilter: `blur(${system.foundations.blur[system.components.navbar.blur]})` }}>
            <div className="flex items-center gap-3">
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
                <div key={item} className="text-sm" style={{ padding: "0.75rem 1rem", borderRadius: system.radius[system.components.sidebar.itemRadius], background: index === 1 ? "color-mix(in srgb, var(--preview-action-primary) 10%, transparent)" : "transparent" }}>
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
                  <span className="text-sm font-medium">{term}</span>
                  <span className="text-sm" style={{ color: "var(--preview-text-secondary)" }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="border-t" style={{ borderColor: "var(--preview-border-default)", borderTopWidth: system.components.divider.thickness, marginInline: system.foundations.spacing[system.components.divider.inset] }} />
          </div>
        </div>
      </section>

      <section className="preview-grid-gap grid xl:grid-cols-3">
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Sidebar layout</h4>
          <div className="mt-4 grid" style={{ gridTemplateColumns: `${system.foundations.containers[system.components.sidebarLayout.sidebarWidth]} 1fr`, gap: system.foundations.spacing[system.components.sidebarLayout.pageGap] }}>
            <div className="preview-elevated p-4">Sidebar</div>
            <div className="preview-elevated p-4">Content</div>
          </div>
        </div>
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Stacked layout</h4>
          <div className="preview-elevated p-4" style={{ minHeight: system.foundations.spacing[system.components.stackedLayout.headerHeight] }}>Header</div>
          <div className="preview-elevated mt-4 p-4">Page content</div>
        </div>
        <div className="preview-surface p-5">
          <h4 className="preview-heading text-xl font-semibold">Auth layout</h4>
          <div className="preview-overlay rounded-[var(--preview-dialog-radius)] p-3">
            <div className="preview-elevated" style={{ maxWidth: system.foundations.containers[system.components.authLayout.cardWidth], borderRadius: system.radius[system.components.authLayout.cardRadius], padding: system.foundations.spacing[system.components.authLayout.cardPadding] }}>
              <p className="preview-heading text-lg font-semibold">Sign in</p>
              <div className="mt-3 grid gap-3">
                <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Email address" readOnly />
                <input className="preview-input px-[var(--preview-input-px)] py-[var(--preview-input-py)]" value="Password" readOnly />
                <button className="preview-button-primary px-[var(--preview-button-px)] py-[var(--preview-button-py)] font-medium">Continue</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardPreview({ brandName, system }: { brandName: string; system: GeneratedSystem }) {
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

        <div className="preview-grid-gap grid lg:grid-cols-3">
          {[
            { label: "Tokens generated", value: "168" },
            { label: "Contrast checks", value: "14" },
            { label: "Font pairs", value: "6" },
          ].map((card) => (
            <div key={card.label} className="preview-elevated p-5">
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

            <div className="preview-overlay rounded-[var(--preview-dialog-radius)] p-3">
              <div className="preview-elevated p-5" style={{ maxWidth: "var(--preview-dialog-width)", borderRadius: "var(--preview-dialog-radius)", boxShadow: "var(--preview-dialog-shadow)" }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Drawer preview</p>
                <h4 className="preview-heading mt-2 text-xl font-semibold">Export package</h4>
                <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                  Includes theme CSS, Tailwind v4 theme layer, JSON tokens, and a handoff README.
                </p>
                <div className="mt-4 border px-[var(--preview-dialog-padding)] py-[var(--preview-dialog-padding)] text-sm rounded-[var(--preview-dialog-radius)]" style={{ borderColor: "var(--preview-border-default)" }}>
                  Ready for ZIP download
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MarketingPreview({ brandName }: { brandName: string }) {
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

  function updateInputs(updater: (current: BrandInputs) => BrandInputs) {
    setInputs((current) => {
      const next = updater(current);
      setSystem(createGeneratedSystem(next));
      return next;
    });
  }

  const colorErrors = {
    primaryColor: isValidHex(inputs.primaryColor) ? undefined : "Use a valid hex color like #635bff.",
    secondaryColor: inputs.secondaryColor && !isValidHex(inputs.secondaryColor) ? "Use a valid hex color or leave it blank." : undefined,
    accentColor: inputs.accentColor && !isValidHex(inputs.accentColor) ? "Use a valid hex color or leave it blank." : undefined,
  };

  const qaReport = useMemo(() => auditSystem(system), [system]);

  return (
    <main className="mx-auto w-full max-w-[1880px] px-4 py-5 sm:px-6 lg:px-8">
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border border-app-border/70 bg-app-surface/80 px-5 py-4 backdrop-blur-sm">
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

      <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)_370px] 2xl:grid-cols-[360px_minmax(0,1fr)_390px]">
        <BrandInputPanel inputs={inputs} setInputs={updateInputs} colorErrors={colorErrors} />

        <div className="space-y-4">
          <div className="panel rounded-[1.5rem] p-4">
            <p className="text-sm font-semibold text-app-foreground">Live generation is active</p>
            <p className="mt-1 text-sm text-app-muted">
              Brand inputs regenerate palettes and semantics instantly. The editor on the right lets you make final overrides before export.
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

        <TokenPanel inputs={inputs} setInputs={setInputs} system={system} setSystem={setSystem} brandName={inputs.brandName} />
      </section>
    </main>
  );
}
