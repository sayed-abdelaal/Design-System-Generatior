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

const PREVIEW_MODES = ["ui-kit", "dashboard", "marketing"] as const;
type PreviewMode = (typeof PREVIEW_MODES)[number];
type ActiveTheme = "light" | "dark";

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
    "--preview-animate-fade-in": system.foundations.animations.fadeIn,
  } as CSSProperties;
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
}: {
  brandName: string;
  logoDataUrl: string | null;
  system: GeneratedSystem;
  previewMode: PreviewMode;
  setPreviewMode: Dispatch<SetStateAction<PreviewMode>>;
  activeTheme: ActiveTheme;
  setActiveTheme: Dispatch<SetStateAction<ActiveTheme>>;
  contrastWarnings: string[];
}) {
  const previewStyle = useMemo(() => createPreviewStyle(system, activeTheme), [system, activeTheme]);

  return (
    <div className="space-y-4">
      <div className="panel rounded-[1.6rem] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">Live Preview</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-app-foreground">Preview the full product system</h2>
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

        <div className="max-h-[calc(100vh-15rem)] overflow-auto p-6">
          {previewMode === "ui-kit" ? (
            <UIKitPreview />
          ) : previewMode === "dashboard" ? (
            <DashboardPreview brandName={brandName} />
          ) : (
            <MarketingPreview brandName={brandName} />
          )}
        </div>
      </div>
    </div>
  );
}

function TokenPanel({
  system,
  setSystem,
  brandName,
}: {
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

  function exportFile(type: "tokens" | "theme" | "tailwind" | "readme") {
    if (type === "tokens") {
      downloadTextFile("tokens.json", buildTokensJson(system, brandName), "application/json");
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

    downloadTextFile("README.md", buildReadme(brandName), "text/markdown");
  }

  async function exportZip() {
    const blob = await buildZip(system, brandName);
    downloadBlob(`${brandName.toLowerCase().replace(/\s+/g, "-") || "design-system"}-tokens.zip`, blob);
  }

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
          <div className="flex items-center gap-2 text-sm font-semibold text-app-foreground">
            <Download className="h-4 w-4" />
            Export files
          </div>
          <div className="mt-4 grid gap-2">
            <button type="button" className="field text-left" onClick={() => exportFile("tokens")}>Download `tokens.json`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("theme")}>Download `theme.css`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("tailwind")}>Download `tailwind-theme.css`</button>
            <button type="button" className="field text-left" onClick={() => exportFile("readme")}>Download `README.md`</button>
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

function UIKitPreview() {
  return (
    <div className="preview-stack flex flex-col">
      <section className="preview-grid-gap grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="preview-surface space-y-4 p-5">
          <span className="preview-badge inline-flex rounded-full px-3 py-1 text-xs font-semibold">Buttons and Inputs</span>
          <div>
            <h3 className="preview-heading text-3xl font-semibold">A grounded UI kit with brand-backed defaults.</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
              Primary and secondary components are mapped from semantic tokens instead of hard-coded colors.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="preview-button-primary rounded-[var(--preview-radius-pill)] px-4 py-3 font-medium">Primary button</button>
            <button className="preview-button-secondary rounded-[var(--preview-radius-pill)] px-4 py-3 font-medium">Secondary action</button>
          </div>
          <div className="grid gap-3">
            <input className="preview-input rounded-[var(--preview-radius-md)] px-4 py-3" value="Workspace name" readOnly />
            <textarea className="preview-input min-h-28 rounded-[var(--preview-radius-md)] px-4 py-3" value="Supporting notes that explain how tokens should feel in the product surface." readOnly />
            <select className="preview-input rounded-[var(--preview-radius-md)] px-4 py-3" defaultValue="comfortable">
              <option value="comfortable">Comfortable density</option>
            </select>
          </div>
        </div>

        <div className="preview-stack flex flex-col">
          <div className="preview-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: "var(--preview-text-secondary)" }}>Badges and alerts</span>
              <span className="preview-badge rounded-full px-3 py-1 text-xs font-semibold">New release</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="preview-alert-success rounded-[var(--preview-radius-md)] px-4 py-3 text-sm">Accessible success state with semantic green mapping.</div>
              <div className="preview-alert-warning rounded-[var(--preview-radius-md)] px-4 py-3 text-sm">Warning tokens stay warm and legible in both themes.</div>
              <div className="preview-alert-danger rounded-[var(--preview-radius-md)] px-4 py-3 text-sm">Danger surfaces carry urgency without overpowering the UI.</div>
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

function DashboardPreview({ brandName }: { brandName: string }) {
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
                <input className="preview-input rounded-[var(--preview-radius-pill)] px-4 py-2" value="Search systems" readOnly />
                <button className="preview-button-secondary rounded-[var(--preview-radius-pill)] px-4 py-2">Filter</button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[var(--preview-radius-lg)] border" style={{ borderColor: "var(--preview-border-default)" }}>
              <div className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr] bg-[var(--preview-surface-elevated)] px-4 py-3 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--preview-text-muted)" }}>
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
                <div key={row[0]} className="preview-table-row grid grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr] px-4 py-3 text-sm">
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
                <input className="preview-input w-full rounded-[var(--preview-radius-md)] px-4 py-3" value="Token group name" readOnly />
                <textarea className="preview-input min-h-24 w-full rounded-[var(--preview-radius-md)] px-4 py-3" value="Design rationale and implementation notes." readOnly />
                <button className="preview-button-primary w-full rounded-[var(--preview-radius-md)] px-4 py-3 font-medium">Save mapping</button>
              </div>
            </div>

            <div className="preview-elevated p-5">
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--preview-text-muted)" }}>Drawer preview</p>
              <h4 className="preview-heading mt-2 text-xl font-semibold">Export package</h4>
              <p className="mt-2 text-sm" style={{ color: "var(--preview-text-secondary)" }}>
                Includes theme CSS, Tailwind v4 theme layer, JSON tokens, and a handoff README.
              </p>
              <div className="mt-4 rounded-[var(--preview-radius-md)] border px-4 py-3 text-sm" style={{ borderColor: "var(--preview-border-default)" }}>
                Ready for ZIP download
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
              <button className="preview-button-primary rounded-[var(--preview-radius-pill)] px-5 py-3 font-medium">Generate theme</button>
              <button className="preview-button-secondary rounded-[var(--preview-radius-pill)] px-5 py-3 font-medium">Preview dashboard</button>
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

  const contrastWarnings = useMemo(() => {
    const lightValues = resolveThemeValues(system, "light");
    const darkValues = resolveThemeValues(system, "dark");
    const warnings: string[] = [];

    if (getContrastRatio(lightValues.textPrimary, lightValues.background) < 4.5) {
      warnings.push("Light theme body copy is below the recommended contrast threshold.");
    }

    if (getContrastRatio(darkValues.textPrimary, darkValues.background) < 4.5) {
      warnings.push("Dark theme body copy is below the recommended contrast threshold.");
    }

    if (getContrastRatio(lightValues.actionPrimaryForeground, lightValues.actionPrimary) < 4.5) {
      warnings.push("Primary button contrast is weak in the light theme.");
    }

    return warnings;
  }, [system]);

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
            contrastWarnings={contrastWarnings}
          />
        </div>

        <TokenPanel system={system} setSystem={setSystem} brandName={inputs.brandName} />
      </section>
    </main>
  );
}
