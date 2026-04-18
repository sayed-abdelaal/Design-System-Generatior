import JSZip from "jszip";

import { FONT_OPTIONS } from "@/data/fonts";
import { resolveTokenReference } from "@/lib/generator";
import {
  GeneratedSystem,
  PALETTE_NAMES,
  SCALE_STEPS,
  SEMANTIC_TOKEN_NAMES,
  ThemeSemanticTokens,
} from "@/types/design-system";

function semanticBlock(name: string, tokens: ThemeSemanticTokens, system: GeneratedSystem) {
  return SEMANTIC_TOKEN_NAMES.map((token) => {
    const cssName = token.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    const value = resolveTokenReference(tokens[token], system.palettes);

    return `  --ds-${cssName}: ${value};`;
  }).join("\n");
}

function paletteLines(system: GeneratedSystem) {
  return PALETTE_NAMES.flatMap((paletteName) =>
    SCALE_STEPS.map((step) => `  --ds-${paletteName}-${step}: ${system.palettes[paletteName][step]};`),
  ).join("\n");
}

function typographyLines(system: GeneratedSystem) {
  return [
    `  --ds-font-heading: ${system.typography.headingFont};`,
    `  --ds-font-body: ${system.typography.bodyFont};`,
    ...Object.entries(system.typography.scale).flatMap(([key, token]) => [
      `  --ds-type-${key}-size: ${token.size};`,
      `  --ds-type-${key}-line-height: ${token.lineHeight};`,
      `  --ds-type-${key}-weight: ${token.weight};`,
      ...(token.letterSpacing ? [`  --ds-type-${key}-tracking: ${token.letterSpacing};`] : []),
    ]),
  ].join("\n");
}

function chromeLines(system: GeneratedSystem) {
  return [
    ...Object.entries(system.radius).map(([key, value]) => `  --ds-radius-${key}: ${value};`),
    ...Object.entries(system.shadows).map(([key, value]) => `  --ds-shadow-${key}: ${value};`),
    ...Object.entries(system.foundations.insetShadows).map(([key, value]) => `  --ds-inset-shadow-${key}: ${value};`),
    ...Object.entries(system.foundations.dropShadows).map(([key, value]) => `  --ds-drop-shadow-${key}: ${value};`),
    ...Object.entries(system.foundations.blur).map(([key, value]) => `  --ds-blur-${key}: ${value};`),
    ...Object.entries(system.foundations.easing).map(([key, value]) => `  --ds-ease-${key}: ${value};`),
    ...Object.entries(system.foundations.animations).map(([key, value]) => `  --ds-animate-${key}: ${value};`),
    ...Object.entries(system.foundations.breakpoints).map(([key, value]) => `  --ds-breakpoint-${key}: ${value};`),
    ...Object.entries(system.foundations.containers).map(([key, value]) => `  --ds-container-${key}: ${value};`),
    ...Object.entries(system.foundations.spacing).map(([key, value]) => `  --ds-spacing-${key}: ${value};`),
    ...Object.entries(system.foundations.fontWeights).map(([key, value]) => `  --ds-font-weight-${key}: ${value};`),
    ...Object.entries(system.foundations.tracking).map(([key, value]) => `  --ds-tracking-${key}: ${value};`),
    ...Object.entries(system.foundations.leading).map(([key, value]) => `  --ds-leading-${key}: ${value};`),
    ...Object.entries(system.foundations.aspectRatios).map(([key, value]) => `  --ds-aspect-${key}: ${value};`),
    `  --ds-density: ${system.density};`,
  ].join("\n");
}

export function buildThemeCss(system: GeneratedSystem) {
  return `:root {\n${paletteLines(system)}\n${typographyLines(system)}\n${chromeLines(system)}\n${semanticBlock("light", system.lightTokens, system)}\n}\n\n[data-theme="dark"] {\n${semanticBlock("dark", system.darkTokens, system)}\n}\n`;
}

export function buildTailwindThemeCss(system: GeneratedSystem) {
  return `@import "tailwindcss";\n\n@theme static inline {\n  --color-background: var(--ds-background);\n  --color-foreground: var(--ds-foreground);\n  --color-surface: var(--ds-surface);\n  --color-surface-elevated: var(--ds-surface-elevated);\n  --color-text-primary: var(--ds-text-primary);\n  --color-text-secondary: var(--ds-text-secondary);\n  --color-text-muted: var(--ds-text-muted);\n  --color-border-default: var(--ds-border-default);\n  --color-border-strong: var(--ds-border-strong);\n  --color-action-primary: var(--ds-action-primary);\n  --color-action-secondary: var(--ds-action-secondary);\n  --color-focus-ring: var(--ds-focus-ring);\n  --color-success: var(--ds-success);\n  --color-warning: var(--ds-warning);\n  --color-danger: var(--ds-danger);\n  --font-sans: var(--ds-font-body);\n  --font-display: var(--ds-font-heading);\n${PALETTE_NAMES.flatMap((paletteName) => SCALE_STEPS.map((step) => `  --color-${paletteName}-${step}: ${system.palettes[paletteName][step]};`)).join("\n")}\n${Object.entries(system.foundations.spacing).map(([key, value]) => `  --spacing-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.fontWeights).map(([key, value]) => `  --font-weight-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.tracking).map(([key, value]) => `  --tracking-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.leading).map(([key, value]) => `  --leading-${key}: ${value};`).join("\n")}\n${Object.entries(system.radius).map(([key, value]) => `  --radius-${key}: ${value};`).join("\n")}\n${Object.entries(system.shadows).map(([key, value]) => `  --shadow-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.insetShadows).map(([key, value]) => `  --inset-shadow-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.dropShadows).map(([key, value]) => `  --drop-shadow-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.blur).map(([key, value]) => `  --blur-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.breakpoints).map(([key, value]) => `  --breakpoint-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.containers).map(([key, value]) => `  --container-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.aspectRatios).map(([key, value]) => `  --aspect-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.easing).map(([key, value]) => `  --ease-${key}: ${value};`).join("\n")}\n${Object.entries(system.foundations.animations).map(([key, value]) => `  --animate-${key}: ${value};`).join("\n")}\n}\n\n@theme {\n  @keyframes fade-in {\n    0% { opacity: 0; }\n    100% { opacity: 1; }\n  }\n\n  @keyframes rise-in {\n    0% { opacity: 0; transform: translateY(8px); }\n    100% { opacity: 1; transform: translateY(0); }\n  }\n\n  @keyframes pulse-soft {\n    0%, 100% { opacity: 1; }\n    50% { opacity: 0.7; }\n  }\n}\n`;
}

export function buildTokensJson(system: GeneratedSystem, brandName: string) {
  const heading = FONT_OPTIONS.find((font) => font.cssVariable === system.typography.headingFont)?.family ?? "Custom";
  const body = FONT_OPTIONS.find((font) => font.cssVariable === system.typography.bodyFont)?.family ?? "Custom";

  return JSON.stringify(
    {
      meta: {
        product: "Tailwind Design System Generator",
        brandName,
      },
      palettes: system.palettes,
      semantics: {
        light: system.lightTokens,
        dark: system.darkTokens,
      },
      typography: {
        headingFont: heading,
        bodyFont: body,
        scale: system.typography.scale,
      },
      foundations: system.foundations,
      utilities: system.utilities,
      components: system.components,
      radius: system.radius,
      shadows: system.shadows,
      density: system.density,
    },
    null,
    2,
  );
}

export function buildReadme(brandName: string) {
  return `# ${brandName} Design Tokens\n\nThis package was generated by Tailwind Design System Generator.\n\n## Files\n- \`theme.css\` defines raw palette variables, semantic tokens, typography, radius, shadows, and density.\n- \`tailwind-theme.css\` maps those variables into Tailwind CSS v4 with \`@theme\`.\n- \`tokens.json\` provides the same values in JSON form for tooling.\n\n## Usage\n1. Import \`theme.css\` after your app styles.\n2. Import \`tailwind-theme.css\` anywhere Tailwind reads your theme layer.\n3. Toggle dark mode by adding \`data-theme="dark"\` on a parent element.\n`;
}

export async function buildZip(system: GeneratedSystem, brandName: string) {
  const zip = new JSZip();
  zip.file("tokens.json", buildTokensJson(system, brandName));
  zip.file("theme.css", buildThemeCss(system));
  zip.file("tailwind-theme.css", buildTailwindThemeCss(system));
  zip.file("README.md", buildReadme(brandName));

  return zip.generateAsync({ type: "blob" });
}

export function downloadTextFile(filename: string, contents: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
