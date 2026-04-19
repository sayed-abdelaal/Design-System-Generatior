import { FONT_OPTIONS } from "@/data/fonts";
import { makeNeutralAnchor, makeScaleFromAnchor, normalizeHex } from "@/lib/color";
import {
  AnimationScale,
  AspectRatioScale,
  BrandInputs,
  BreakpointScale,
  BorderWidthScale,
  ComponentRecipes,
  ContainerScale,
  ContentFoundations,
  CustomPalette,
  Density,
  EasingScale,
  FontWeightScale,
  FoundationTokens,
  GeneratedSystem,
  InsetShadowScale,
  IconSystem,
  MotionDurationScale,
  OpacityScale,
  BlurScale,
  DropShadowScale,
  LeadingScale,
  AccessibilityFoundations,
  PaletteCollection,
  RadiusScale,
  ScreenPresets,
  ShadowScale,
  SpacingScale,
  TrackingScale,
  ThemeSemanticTokens,
  TypographyScale,
  UtilityCoverageMatrix,
  UtilitySettings,
  ZIndexScale,
} from "@/types/design-system";

function buildTypographyScale(direction: BrandInputs["styleDirection"]): TypographyScale {
  const base = {
    display1: { size: "clamp(3.6rem, 6vw, 5.8rem)", lineHeight: "0.92", weight: "700", letterSpacing: "-0.05em" },
    display2: { size: "clamp(3rem, 5vw, 4.8rem)", lineHeight: "0.94", weight: "680", letterSpacing: "-0.045em" },
    display3: { size: "clamp(2.55rem, 4vw, 4rem)", lineHeight: "0.97", weight: "660", letterSpacing: "-0.04em" },
    display4: { size: "clamp(2.15rem, 3vw, 3.2rem)", lineHeight: "1", weight: "640", letterSpacing: "-0.03em" },
    h1: { size: "clamp(2.1rem, 3vw, 3.4rem)", lineHeight: "1.02", weight: "650", letterSpacing: "-0.035em" },
    h2: { size: "clamp(1.7rem, 2.2vw, 2.5rem)", lineHeight: "1.08", weight: "620", letterSpacing: "-0.03em" },
    h3: { size: "1.45rem", lineHeight: "1.12", weight: "620", letterSpacing: "-0.02em" },
    h4: { size: "1.14rem", lineHeight: "1.2", weight: "600", letterSpacing: "-0.015em" },
    h5: { size: "1rem", lineHeight: "1.28", weight: "600", letterSpacing: "-0.01em" },
    h6: { size: "0.9rem", lineHeight: "1.34", weight: "600", letterSpacing: "-0.005em" },
    bodyLg: { size: "1.05rem", lineHeight: "1.7", weight: "500" },
    body: { size: "0.96rem", lineHeight: "1.65", weight: "450" },
    bodySm: { size: "0.875rem", lineHeight: "1.55", weight: "450" },
    caption: { size: "0.75rem", lineHeight: "1.4", weight: "600", letterSpacing: "0.04em" },
    overline: { size: "0.72rem", lineHeight: "1.3", weight: "650", letterSpacing: "0.12em" },
    label: { size: "0.86rem", lineHeight: "1.4", weight: "600", letterSpacing: "0.01em" },
    helper: { size: "0.8rem", lineHeight: "1.45", weight: "450" },
    code: { size: "0.92rem", lineHeight: "1.6", weight: "500", letterSpacing: "-0.01em" },
    codeSm: { size: "0.78rem", lineHeight: "1.5", weight: "500", letterSpacing: "-0.005em" },
  } satisfies TypographyScale;

  if (direction === "editorial") {
    return {
      ...base,
      display1: { ...base.display1, size: "clamp(4rem, 6.4vw, 6.4rem)", lineHeight: "0.9", weight: "720" },
      display2: { ...base.display2, size: "clamp(3.35rem, 5.3vw, 5.2rem)", lineHeight: "0.92", weight: "700" },
      bodyLg: { ...base.bodyLg, size: "1.08rem", lineHeight: "1.8" },
      overline: { ...base.overline, letterSpacing: "0.16em" },
    };
  }

  if (direction === "bold") {
    return {
      ...base,
      display1: { ...base.display1, weight: "760" },
      display2: { ...base.display2, weight: "740" },
      h1: { ...base.h1, weight: "720" },
      h2: { ...base.h2, weight: "700" },
      label: { ...base.label, weight: "650" },
    };
  }

  return base;
}

function buildRadii(direction: BrandInputs["styleDirection"]): RadiusScale {
  if (direction === "minimal") {
    return { none: "0rem", sm: "0.45rem", md: "0.8rem", lg: "1rem", xl: "1.4rem", pill: "999px" };
  }

  if (direction === "editorial") {
    return { none: "0rem", sm: "0.3rem", md: "0.6rem", lg: "0.95rem", xl: "1.2rem", pill: "999px" };
  }

  return { none: "0rem", sm: "0.5rem", md: "0.95rem", lg: "1.2rem", xl: "1.6rem", pill: "999px" };
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

function buildSpacing(density: Density): SpacingScale {
  if (density === "compact") {
    return {
      "0": "0rem",
      "1": "0.2rem",
      "2": "0.35rem",
      "3": "0.55rem",
      "4": "0.75rem",
      "5": "0.95rem",
      "6": "1.15rem",
      "8": "1.45rem",
      "10": "1.9rem",
      "12": "2.35rem",
      "16": "3rem",
      "20": "4rem",
      "24": "5rem",
    };
  }

  if (density === "airy") {
    return {
      "0": "0rem",
      "1": "0.3rem",
      "2": "0.5rem",
      "3": "0.8rem",
      "4": "1rem",
      "5": "1.3rem",
      "6": "1.6rem",
      "8": "2rem",
      "10": "2.6rem",
      "12": "3.2rem",
      "16": "4.3rem",
      "20": "5.6rem",
      "24": "7rem",
    };
  }

  return {
    "0": "0rem",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.2rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
  };
}

function buildFontWeights(direction: BrandInputs["styleDirection"]): FontWeightScale {
  if (direction === "bold") {
    return { regular: "500", medium: "600", semibold: "700", bold: "800" };
  }

  return { regular: "450", medium: "520", semibold: "620", bold: "720" };
}

function buildTracking(direction: BrandInputs["styleDirection"]): TrackingScale {
  if (direction === "editorial") {
    return { tight: "-0.045em", normal: "-0.015em", wide: "0.08em" };
  }

  return { tight: "-0.03em", normal: "0em", wide: "0.06em" };
}

function buildLeading(density: Density): LeadingScale {
  if (density === "compact") {
    return { snug: "1.15", normal: "1.45", relaxed: "1.6" };
  }

  if (density === "airy") {
    return { snug: "1.25", normal: "1.6", relaxed: "1.82" };
  }

  return { snug: "1.2", normal: "1.5", relaxed: "1.72" };
}

function buildBreakpoints(): BreakpointScale {
  return { sm: "40rem", md: "48rem", lg: "64rem", xl: "80rem", "2xl": "96rem" };
}

function buildContainers(density: Density): ContainerScale {
  if (density === "airy") {
    return { sm: "26rem", md: "34rem", lg: "46rem", xl: "62rem", "2xl": "76rem" };
  }

  return { sm: "24rem", md: "32rem", lg: "42rem", xl: "58rem", "2xl": "72rem" };
}

function buildInsetShadows(): InsetShadowScale {
  return {
    xs: "inset 0 1px 0 rgba(255,255,255,0.55)",
    sm: "inset 0 1px 2px rgba(15,23,42,0.08)",
  };
}

function buildDropShadows(): DropShadowScale {
  return {
    sm: "0 4px 10px rgba(15,23,42,0.12)",
    md: "0 10px 18px rgba(15,23,42,0.18)",
  };
}

function buildBlur(direction: BrandInputs["styleDirection"]): BlurScale {
  if (direction === "minimal") {
    return { sm: "4px", md: "10px", lg: "16px" };
  }

  return { sm: "6px", md: "12px", lg: "20px" };
}

function buildOpacity(direction: BrandInputs["styleDirection"]): OpacityScale {
  if (direction === "bold") {
    return { subtle: "0.72", muted: "0.58", disabled: "0.42", strong: "0.9" };
  }

  return { subtle: "0.8", muted: "0.64", disabled: "0.46", strong: "0.92" };
}

function buildEasing(): EasingScale {
  return {
    standard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
    entrance: "cubic-bezier(0.12, 0.9, 0.24, 1)",
  };
}

function buildDurations(direction: BrandInputs["styleDirection"]): MotionDurationScale {
  if (direction === "minimal") {
    return { fast: "120ms", standard: "180ms", slow: "260ms" };
  }

  if (direction === "bold") {
    return { fast: "150ms", standard: "220ms", slow: "320ms" };
  }

  return { fast: "140ms", standard: "200ms", slow: "280ms" };
}

function buildAnimations(): AnimationScale {
  return {
    fadeIn: "fade-in 180ms var(--ease-standard)",
    riseIn: "rise-in 240ms var(--ease-entrance)",
    pulseSoft: "pulse-soft 2.4s ease-in-out infinite",
  };
}

function buildAspectRatios(): AspectRatioScale {
  return { square: "1 / 1", video: "16 / 9", portrait: "4 / 5", wide: "21 / 9" };
}

function buildBorderWidths(direction: BrandInputs["styleDirection"]): BorderWidthScale {
  if (direction === "bold") {
    return { hairline: "1px", default: "2px", strong: "3px" };
  }

  return { hairline: "1px", default: "1.5px", strong: "2px" };
}

function buildZIndex(): ZIndexScale {
  return {
    base: "0",
    dropdown: "30",
    sticky: "40",
    overlay: "50",
    modal: "60",
    toast: "70",
  };
}

function buildContentFoundations(density: Density, direction: BrandInputs["styleDirection"]): ContentFoundations {
  return {
    links: {
      underline: direction === "editorial" ? "always" : direction === "minimal" ? "hover" : "hover",
      weight: direction === "bold" ? "semibold" : "medium",
      tone: direction === "minimal" ? "foreground" : "brand",
    },
    lists: {
      marker: direction === "editorial" ? "decimal" : "disc",
      gap: density === "compact" ? "2" : "3",
      indent: density === "airy" ? "6" : "5",
    },
    code: {
      fontScale: density === "compact" ? "codeSm" : "code",
      radius: direction === "minimal" ? "sm" : "md",
      paddingX: density === "compact" ? "2" : "3",
      paddingY: density === "compact" ? "1" : "2",
    },
    truncation: {
      singleLine: true,
      multiLineClamp: direction === "editorial" ? "4" : "3",
      maxInlineSize: density === "airy" ? "lg" : "md",
    },
  };
}

function buildAccessibilityFoundations(density: Density, direction: BrandInputs["styleDirection"]): AccessibilityFoundations {
  return {
    contrastTarget: direction === "minimal" ? "AA" : "AAA",
    focusTreatment: direction === "bold" ? "high-contrast" : direction === "studio" ? "brand" : "soft",
    keyboardPattern: density === "airy" ? "enhanced" : "standard",
    screenReaderLabelPrefix: "Design system",
    touchTargetMin: density === "compact" ? "10" : "12",
  };
}

function buildFoundations(direction: BrandInputs["styleDirection"]): {
  foundations: FoundationTokens;
  density: Density;
} {
  const density = buildDensity(direction);

  return {
    density,
    foundations: {
      spacing: buildSpacing(density),
      fontWeights: buildFontWeights(direction),
      tracking: buildTracking(direction),
      leading: buildLeading(density),
      breakpoints: buildBreakpoints(),
      containers: buildContainers(density),
      borderWidths: buildBorderWidths(direction),
      insetShadows: buildInsetShadows(),
      dropShadows: buildDropShadows(),
      blur: buildBlur(direction),
      opacity: buildOpacity(direction),
      easing: buildEasing(),
      durations: buildDurations(direction),
      animations: buildAnimations(),
      aspectRatios: buildAspectRatios(),
      zIndex: buildZIndex(),
      content: buildContentFoundations(density, direction),
      accessibility: buildAccessibilityFoundations(density, direction),
    },
  };
}

function buildUtilitySettings(
  density: Density,
  direction: BrandInputs["styleDirection"],
): UtilitySettings {
  return {
    layout: {
      contentWidth: direction === "editorial" ? "xl" : "lg",
      sectionGap: density === "airy" ? "12" : "10",
      cardGap: density === "compact" ? "4" : "6",
      defaultRadius: direction === "editorial" ? "md" : "lg",
    },
    spacing: {
      densityMode: density,
      stackGap: density === "compact" ? "4" : "6",
      inlineGap: density === "compact" ? "3" : "4",
      insetPadding: density === "airy" ? "6" : "5",
    },
    sizing: {
      controlHeight: density === "compact" ? "10" : "12",
      sidebarWidth: "sm",
      modalWidth: direction === "editorial" ? "lg" : "md",
    },
    typography: {
      headingWeight: direction === "bold" ? "bold" : "semibold",
      bodyWeight: "regular",
      bodyLeading: density === "airy" ? "relaxed" : "normal",
      headingTracking: direction === "editorial" ? "tight" : "normal",
    },
    borders: {
      borderRadius: direction === "minimal" ? "md" : "lg",
      borderWidth: direction === "bold" ? "strong" : "default",
      outlineStyle: direction === "bold" ? "brand" : "soft",
    },
    effects: {
      surfaceShadow: "sm",
      elevatedShadow: "lg",
      surfaceBlur: density === "compact" ? "sm" : "md",
    },
    motion: {
      motionLevel: direction === "minimal" ? "calm" : direction === "bold" ? "expressive" : "balanced",
      transitionEase: direction === "bold" ? "emphasized" : "standard",
      entranceAnimation: direction === "minimal" ? "fadeIn" : "riseIn",
    },
    interactivity: {
      focusRingWidth: density === "compact" ? "3px" : "4px",
      controlCursor: "pointer",
      selectionStyle: "brand",
    },
  };
}

function buildUtilityCoverage(
  density: Density,
  direction: BrandInputs["styleDirection"],
): UtilityCoverageMatrix {
  const expressive = direction === "bold" || direction === "studio";
  const editorial = direction === "editorial";

  return {
    layout: {
      mode: "mixed",
      enabled: true,
      densityAware: true,
      notes: "Content width, overflow posture, positioning, and shell defaults.",
    },
    flexboxGrid: {
      mode: "preset",
      enabled: true,
      densityAware: true,
      notes: "Grid and flex recipes stay preset-driven to keep structure predictable.",
    },
    spacing: {
      mode: "token",
      enabled: true,
      densityAware: true,
      notes: density === "compact"
        ? "Compact spacing scale drives stack, inset, and control rhythm."
        : "Spacing scale remains editable and feeds all layout rhythm decisions.",
    },
    sizing: {
      mode: "mixed",
      enabled: true,
      densityAware: true,
      notes: "Sizing combines spacing tokens with control and shell presets.",
    },
    typography: {
      mode: "token",
      enabled: true,
      densityAware: editorial,
      notes: "Font, tracking, leading, and weights flow directly from theme tokens.",
    },
    backgrounds: {
      mode: "mixed",
      enabled: true,
      densityAware: false,
      notes: "Backgrounds use semantic surfaces plus preset gradient and tint behavior.",
    },
    borders: {
      mode: "mixed",
      enabled: true,
      densityAware: true,
      notes: "Radius is token-driven; outline weight and treatment use utility presets.",
    },
    effects: {
      mode: expressive ? "token" : "mixed",
      enabled: true,
      densityAware: false,
      notes: "Shadows, opacity, and surface depth are adjustable before export.",
    },
    filters: {
      mode: "preset",
      enabled: true,
      densityAware: false,
      notes: "Filters stay intentionally narrow so exported systems remain practical.",
    },
    tables: {
      mode: "mixed",
      enabled: true,
      densityAware: true,
      notes: "Density, striping, and header posture map to table recipes.",
    },
    transitionsAnimation: {
      mode: "token",
      enabled: true,
      densityAware: false,
      notes: "Motion tokens drive transitions, easing, and entrance behavior.",
    },
    transforms: {
      mode: "preset",
      enabled: true,
      densityAware: false,
      notes: "Transforms remain preset-oriented for hover lift and staged reveals.",
    },
    interactivity: {
      mode: "mixed",
      enabled: true,
      densityAware: true,
      notes: "Focus, selection, cursor, and control affordances are system-tunable.",
    },
    svg: {
      mode: "token",
      enabled: true,
      densityAware: false,
      notes: "SVG fill and stroke inherit semantic color tokens.",
    },
    accessibility: {
      mode: "preset",
      enabled: true,
      densityAware: false,
      notes: "Contrast warnings, focus posture, and high-contrast fallbacks stay enforced.",
    },
  };
}

function buildScreenPresets(density: Density): ScreenPresets {
  const dashboardGap = density === "airy" ? "12" : density === "compact" ? "6" : "8";
  const dashboardPadding = density === "airy" ? "8" : "6";

  return {
    dashboard: {
      maxWidth: "2xl",
      sectionGap: dashboardGap,
      chromePadding: dashboardPadding,
      density,
    },
    settings: {
      maxWidth: "xl",
      sectionGap: density === "compact" ? "6" : "8",
      chromePadding: density === "airy" ? "6" : "5",
      density,
    },
    auth: {
      maxWidth: "sm",
      sectionGap: density === "airy" ? "6" : "5",
      chromePadding: density === "compact" ? "4" : "5",
      density: density === "airy" ? "comfortable" : density,
    },
    marketing: {
      maxWidth: "2xl",
      sectionGap: density === "compact" ? "8" : "12",
      chromePadding: density === "airy" ? "10" : "8",
      density: density === "compact" ? "comfortable" : density,
    },
    dataTable: {
      maxWidth: "2xl",
      sectionGap: density === "compact" ? "6" : "8",
      chromePadding: density === "compact" ? "5" : "6",
      density,
    },
    formPage: {
      maxWidth: "lg",
      sectionGap: density === "airy" ? "8" : "6",
      chromePadding: density === "compact" ? "4" : "5",
      density,
    },
  };
}

function buildIconSystem(direction: BrandInputs["styleDirection"]): IconSystem {
  return {
    defaultSize: direction === "editorial" ? 22 : direction === "bold" ? 24 : 20,
    strokeWidth: direction === "minimal" ? 1.5 : direction === "bold" ? 1.9 : 1.7,
    colorBehavior: direction === "minimal" ? "current" : "semantic",
    semanticUsage: {
      buttons: "neutral.50",
      alerts: "warning.700",
      nav: "primary.600",
      tables: "secondary.600",
      inputs: "accent.600",
    },
  };
}

function buildComponentRecipes(
  density: Density,
  direction: BrandInputs["styleDirection"],
): ComponentRecipes {
  const compact = density === "compact";
  const airy = density === "airy";

  return {
    button: {
      radius: direction === "editorial" ? "md" : "pill",
      paddingX: compact ? "4" : airy ? "6" : "5",
      paddingY: compact ? "3" : "4",
      primaryShadow: direction === "bold" ? "md" : "sm",
      secondaryStyle: direction === "minimal" ? "outline" : "soft",
      ghostStyle: direction === "minimal" ? "minimal" : "subtle",
      hoverLift: direction === "minimal" ? "none" : direction === "bold" ? "md" : "sm",
      colors: {
        primary: {
          background: "primary.600",
          foreground: "neutral.50",
          border: "primary.700",
          hoverBackground: "primary.700",
          hoverForeground: "neutral.50",
          hoverBorder: "primary.800",
        },
        secondary: {
          background: "secondary.100",
          foreground: "secondary.700",
          border: "secondary.300",
          hoverBackground: "secondary.200",
          hoverForeground: "secondary.800",
          hoverBorder: "secondary.400",
        },
        ghost: {
          background: "neutral.50",
          foreground: "neutral.700",
          border: "neutral.200",
          hoverBackground: "neutral.100",
          hoverForeground: "neutral.900",
          hoverBorder: "neutral.300",
        },
      },
    },
    input: {
      radius: direction === "minimal" ? "md" : "lg",
      paddingX: compact ? "4" : "5",
      paddingY: compact ? "3" : "4",
      borderStyle: direction === "bold" ? "strong" : "soft",
      validationStyle: direction === "bold" ? "strong" : "soft",
      showHelperText: true,
      showPrefix: direction !== "minimal",
      showSuffix: direction === "bold" || direction === "studio",
      searchStyle: direction === "minimal" ? "underline" : "boxed",
      selectStyle: direction === "editorial" ? "quiet" : "default",
      messageStyle: density === "compact" ? "inline" : "stacked",
      readOnlyStyle: direction === "minimal" ? "outlined" : "muted",
    },
    searchField: {
      radius: direction === "minimal" ? "md" : "pill",
      paddingX: compact ? "4" : "5",
      paddingY: compact ? "3" : "4",
      style: direction === "minimal" ? "underline" : "boxed",
      showShortcut: direction !== "minimal",
    },
    typedField: {
      passwordReveal: direction !== "editorial",
      numberControls: compact ? "inline" : "split",
      contactIcon: direction !== "minimal",
      urlPreview: direction !== "bold",
    },
    datePicker: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      density: compact ? "compact" : "comfortable",
      showWeekNumbers: airy,
    },
    dateRangePicker: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      presetStyle: direction === "minimal" ? "inline" : "chips",
      showComparison: direction !== "minimal",
    },
    timePicker: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      format: direction === "editorial" ? "24h" : "12h",
      step: compact ? "30m" : "15m",
    },
    fileUpload: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      style: direction === "minimal" ? "inline" : "dropzone",
      showPreview: direction !== "minimal",
      dragState: direction === "bold" ? "strong" : "soft",
    },
    slider: {
      trackHeight: compact ? "1" : "2",
      thumbSize: compact ? "4" : "5",
      showValue: true,
      showTicks: airy,
    },
    rangeSlider: {
      trackHeight: compact ? "1" : "2",
      thumbSize: compact ? "4" : "5",
      showValues: true,
      showInputs: direction !== "minimal",
    },
    textarea: {
      radius: direction === "minimal" ? "md" : "lg",
      minHeight: airy ? "16" : "12",
      padding: compact ? "4" : "5",
    },
    badge: {
      radius: direction === "minimal" ? "md" : "pill",
      paddingX: compact ? "3" : "4",
      paddingY: compact ? "1" : "2",
      style: direction === "bold" ? "solid" : "soft",
      color: {
        background: direction === "bold" ? "primary.600" : "primary.100",
        foreground: direction === "bold" ? "neutral.50" : "primary.700",
        border: "primary.300",
      },
    },
    tag: {
      radius: direction === "minimal" ? "sm" : "pill",
      paddingX: compact ? "2" : "3",
      paddingY: "1",
      style: direction === "bold" ? "outline" : "soft",
      color: {
        background: direction === "bold" ? "highlight.100" : "neutral.100",
        foreground: direction === "bold" ? "highlight.800" : "neutral.700",
        border: direction === "bold" ? "highlight.400" : "neutral.300",
      },
    },
    alert: {
      radius: direction === "editorial" ? "md" : "lg",
      padding: compact ? "4" : "5",
      emphasis: direction === "bold" ? "strong" : "soft",
      variantStyle: direction === "minimal" ? "outlined" : "tinted",
      colors: {
        success: "success.600",
        warning: "warning.600",
        danger: "danger.600",
        info: "info.600",
        attention: "attention.600",
      },
    },
    toast: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      shadow: direction === "bold" ? "lg" : "md",
      tone: direction === "bold" ? "strong" : "soft",
      placement: compact ? "stacked" : "floating",
    },
    banner: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      style: direction === "bold" ? "solid" : direction === "minimal" ? "outlined" : "soft",
      color: direction === "editorial" ? "attention.600" : "info.600",
    },
    statusDot: {
      size: compact ? "3" : "4",
      style: direction === "bold" ? "solid" : "soft",
    },
    progress: {
      radius: "pill",
      height: compact ? "2" : "3",
      tone: direction === "bold" ? "strong" : "soft",
      showLabel: true,
    },
    loader: {
      size: compact ? "5" : "6",
      stroke: direction === "minimal" ? "thin" : direction === "bold" ? "bold" : "regular",
      style: direction === "editorial" ? "orbit" : "spinner",
    },
    skeleton: {
      radius: direction === "minimal" ? "md" : "lg",
      lineHeight: compact ? "3" : "4",
      shimmer: direction === "bold" ? "strong" : "soft",
    },
    state: {
      radius: direction === "minimal" ? "lg" : "xl",
      padding: compact ? "5" : "6",
      layout: airy ? "feature" : "compact",
      iconEmphasis: direction === "bold" ? "strong" : "soft",
    },
    table: {
      radius: direction === "minimal" ? "md" : "lg",
      cellPaddingX: compact ? "3" : "4",
      cellPaddingY: compact ? "3" : "4",
      headerStyle: direction === "editorial" ? "elevated" : "muted",
      density: compact ? "compact" : "comfortable",
      zebraStripes: direction !== "minimal",
    },
    dataGrid: {
      radius: direction === "minimal" ? "md" : "lg",
      cellPadding: compact ? "3" : "4",
      headerStyle: direction === "editorial" ? "elevated" : "muted",
      density: compact ? "compact" : "comfortable",
      selectionStyle: direction === "minimal" ? "row" : "checkbox",
      stickyHeader: direction !== "minimal",
    },
    sidebar: {
      width: airy ? "md" : "sm",
      itemGap: compact ? "3" : "4",
      itemRadius: direction === "minimal" ? "md" : "lg",
    },
    checkbox: {
      size: compact ? "4" : "5",
      radius: direction === "minimal" ? "sm" : "md",
      tone: direction === "bold" ? "strong" : "soft",
    },
    combobox: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      shadow: direction === "bold" ? "md" : "sm",
    },
    autocomplete: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      suggestionDensity: compact ? "compact" : "comfortable",
      showPreview: direction !== "minimal",
    },
    radioGroup: {
      gap: compact ? "3" : "4",
      tone: direction === "bold" ? "strong" : "soft",
    },
    switch: {
      trackWidth: compact ? "8" : "10",
      trackHeight: compact ? "4" : "5",
      thumbSize: compact ? "3" : "4",
      tone: direction === "bold" ? "strong" : "soft",
    },
    descriptionList: {
      gap: compact ? "3" : "4",
      termWidth: "sm",
    },
    list: {
      gap: compact ? "2" : "3",
      itemPadding: compact ? "3" : "4",
      style: direction === "minimal" ? "plain" : "divided",
    },
    dialog: {
      radius: direction === "editorial" ? "lg" : "xl",
      width: airy ? "lg" : "md",
      padding: compact ? "5" : "6",
      shadow: direction === "bold" ? "lg" : "md",
      overlayBlur: direction === "minimal" ? "sm" : "md",
      overlayTone: direction === "bold" ? "strong" : "soft",
      presentation: direction === "minimal" ? "drawer" : "modal",
      placement: direction === "minimal" ? "right" : "center",
      mode: direction === "bold" ? "alert" : "standard",
    },
    listbox: {
      radius: direction === "minimal" ? "md" : "lg",
      optionPadding: compact ? "3" : "4",
      maxHeight: "sm",
    },
    multiSelect: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      tagStyle: direction === "bold" ? "outline" : "soft",
      maxVisible: compact ? 2 : 3,
    },
    pagination: {
      radius: direction === "minimal" ? "md" : "pill",
      gap: compact ? "2" : "3",
    },
    breadcrumbs: {
      gap: compact ? "2" : "3",
      separatorStyle: direction === "editorial" ? "slash" : "chevron",
      emphasis: direction === "bold" ? "strong" : "soft",
    },
    stepper: {
      gap: compact ? "3" : "4",
      markerSize: compact ? "5" : "6",
      style: direction === "minimal" ? "line" : "pill",
    },
    tabs: {
      radius: direction === "minimal" ? "md" : "pill",
      gap: compact ? "2" : "3",
      activeStyle: direction === "editorial" ? "underline" : "pill",
      tone: direction === "bold" ? "strong" : "soft",
    },
    dropdown: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      shadow: direction === "bold" ? "md" : "sm",
    },
    commandPalette: {
      radius: direction === "minimal" ? "lg" : "xl",
      padding: compact ? "4" : "5",
      shadow: direction === "bold" ? "lg" : "md",
      density: compact ? "compact" : "comfortable",
      showShortcuts: direction !== "minimal",
      previewPane: direction === "bold" || direction === "studio",
    },
    popover: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      shadow: direction === "bold" ? "md" : "sm",
      tone: direction === "bold" ? "strong" : "soft",
    },
    tooltip: {
      radius: direction === "minimal" ? "sm" : "md",
      padding: compact ? "2" : "3",
      tone: direction === "bold" ? "strong" : "soft",
    },
    navbar: {
      height: compact ? "10" : "12",
      paddingX: compact ? "4" : "6",
      blur: direction === "minimal" ? "sm" : "md",
    },
    avatar: {
      size: compact ? "8" : "10",
      radius: "pill",
      ring: direction === "minimal" ? "none" : direction === "bold" ? "strong" : "soft",
    },
    avatarGroup: {
      size: compact ? "6" : "8",
      overlap: compact ? "2" : "3",
      ring: direction === "minimal" ? "none" : direction === "bold" ? "strong" : "soft",
    },
    statCard: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      emphasis: direction === "bold" ? "strong" : "soft",
    },
    timeline: {
      gap: compact ? "3" : "4",
      markerSize: compact ? "3" : "4",
      style: direction === "editorial" ? "filled" : "line",
    },
    activityFeed: {
      gap: compact ? "3" : "4",
      itemPadding: compact ? "3" : "4",
      density: compact ? "compact" : "comfortable",
    },
    divider: {
      thickness: direction === "bold" ? "2px" : "1px",
      inset: compact ? "3" : "4",
    },
    heading: {
      scale: "h3",
      weight: direction === "bold" ? "bold" : "semibold",
      tracking: direction === "editorial" ? "tight" : "normal",
    },
    text: {
      scale: "body",
      leading: airy ? "relaxed" : "normal",
      tone: "secondary",
    },
    link: {
      scale: compact ? "bodySm" : "body",
      weight: direction === "bold" ? "semibold" : "medium",
      underline: direction === "editorial" ? "always" : direction === "minimal" ? "hover" : "hover",
      tone: direction === "minimal" ? "foreground" : "brand",
    },
    visuallyHidden: {
      labelPrefix: "Screen reader",
      revealOnFocus: direction !== "minimal",
    },
    portal: {
      layer: direction === "bold" ? "modal" : "overlay",
      offset: compact ? "3" : "4",
      tone: direction === "bold" ? "strong" : "soft",
    },
    scrollArea: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      scrollbar: direction === "minimal" ? "subtle" : "visible",
      maxHeight: compact ? "sm" : "md",
    },
    fieldset: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      legendStyle: direction === "editorial" ? "stacked" : "inline",
    },
    sidebarLayout: {
      contentWidth: "xl",
      sidebarWidth: airy ? "md" : "sm",
      headerHeight: compact ? "10" : "12",
      pageGap: compact ? "4" : "6",
    },
    stackedLayout: {
      contentWidth: "xl",
      sidebarWidth: "sm",
      headerHeight: compact ? "10" : "12",
      pageGap: compact ? "4" : "6",
    },
    authLayout: {
      cardWidth: airy ? "md" : "sm",
      cardRadius: direction === "minimal" ? "lg" : "xl",
      cardPadding: compact ? "5" : "6",
    },
    saveState: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "3" : "4",
      style: direction === "minimal" ? "inline" : direction === "bold" ? "toast" : "banner",
      emphasis: direction === "bold" ? "strong" : "soft",
    },
    pageTemplate: {
      radius: direction === "minimal" ? "lg" : "xl",
      padding: airy ? "8" : compact ? "5" : "6",
      style: direction === "bold" ? "maintenance" : direction === "minimal" ? "empty" : "error",
      alignment: direction === "editorial" ? "split" : "centered",
    },
    onboarding: {
      radius: direction === "minimal" ? "lg" : "xl",
      padding: compact ? "5" : "6",
      layout: direction === "editorial" ? "spotlight" : "checklist",
      emphasis: direction === "bold" ? "strong" : "soft",
    },
    multiStepFlow: {
      radius: direction === "minimal" ? "md" : "lg",
      padding: compact ? "4" : "5",
      stepStyle: direction === "minimal" ? "line" : "pill",
      showSummary: direction !== "minimal",
    },
    permissionState: {
      radius: direction === "minimal" ? "lg" : "xl",
      padding: compact ? "4" : "5",
      tone: direction === "bold" ? "strong" : "soft",
      layout: direction === "editorial" ? "panel" : "inline",
    },
  };
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
      info: "info.600",
      attention: "attention.600",
      highlight: "highlight.500",
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
      info: "info.400",
      attention: "attention.400",
      highlight: "highlight.400",
    },
  };
}

function slugifyPaletteName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "custom-color";
}

function resolvePaletteAnchor(
  inputs: BrandInputs,
  key: keyof BrandInputs["paletteOverrides"],
  fallback: string,
) {
  const override = inputs.advancedPaletteInputs ? inputs.paletteOverrides[key] : undefined;
  return normalizeHex(override ?? "", fallback);
}

function buildCustomPalettes(inputs: BrandInputs): { metadata: CustomPalette[]; collection: Record<string, ReturnType<typeof makeScaleFromAnchor>> } {
  const metadata: CustomPalette[] = [];
  const collection: Record<string, ReturnType<typeof makeScaleFromAnchor>> = {};

  for (const color of inputs.customColors) {
    const normalizedHex = normalizeHex(color.hex, "");
    if (!normalizedHex || !color.name.trim()) {
      continue;
    }

    const slug = slugifyPaletteName(color.name);
    metadata.push({
      id: color.id,
      name: color.name.trim(),
      slug,
      hex: normalizedHex,
    });
    collection[slug] = makeScaleFromAnchor(normalizedHex);
  }

  return { metadata, collection };
}

function getFontCssVariable(fontId: string, fallbackId: string) {
  return FONT_OPTIONS.find((font) => font.id === fontId)?.cssVariable
    ?? FONT_OPTIONS.find((font) => font.id === fallbackId)?.cssVariable
    ?? "var(--font-manrope)";
}

export function createGeneratedSystem(inputs: BrandInputs): GeneratedSystem {
  const primary = resolvePaletteAnchor(inputs, "primary", normalizeHex(inputs.primaryColor, "#7c5cff"));
  const secondary = resolvePaletteAnchor(inputs, "secondary", normalizeHex(inputs.secondaryColor, "#c77734"));
  const accent = resolvePaletteAnchor(inputs, "accent", normalizeHex(inputs.accentColor, "#16a34a"));
  const neutralSource = inputs.neutralBasePreference === "custom"
    ? normalizeHex(inputs.neutralBaseHex, primary)
    : makeNeutralAnchor(primary, inputs.neutralBasePreference);
  const neutralAnchor = resolvePaletteAnchor(inputs, "neutral", neutralSource);
  const success = resolvePaletteAnchor(inputs, "success", "#16a34a");
  const warning = resolvePaletteAnchor(inputs, "warning", "#d97706");
  const danger = resolvePaletteAnchor(inputs, "danger", "#dc2626");
  const info = resolvePaletteAnchor(inputs, "info", "#0284c7");
  const attention = resolvePaletteAnchor(inputs, "attention", "#ea580c");
  const highlight = resolvePaletteAnchor(inputs, "highlight", "#eab308");
  const { metadata: customPalettes, collection: customPaletteCollection } = buildCustomPalettes(inputs);

  const palettes: PaletteCollection = {
    primary: makeScaleFromAnchor(primary),
    secondary: makeScaleFromAnchor(secondary),
    accent: makeScaleFromAnchor(accent),
    neutral: makeScaleFromAnchor(neutralAnchor, true),
    success: makeScaleFromAnchor(success),
    warning: makeScaleFromAnchor(warning),
    danger: makeScaleFromAnchor(danger),
    info: makeScaleFromAnchor(info),
    attention: makeScaleFromAnchor(attention),
    highlight: makeScaleFromAnchor(highlight),
    ...customPaletteCollection,
  };

  const { lightTokens, darkTokens } = buildSemanticTokens();
  const { foundations, density } = buildFoundations(inputs.styleDirection);
  const utilities = buildUtilitySettings(density, inputs.styleDirection);
  const utilityCoverage = buildUtilityCoverage(density, inputs.styleDirection);
  const components = buildComponentRecipes(density, inputs.styleDirection);
  const screens = buildScreenPresets(density);
  const icons = buildIconSystem(inputs.styleDirection);

  return {
    palettes,
    customPalettes,
    lightTokens,
    darkTokens,
    typography: {
      displayFont: getFontCssVariable(inputs.displayFont, "fraunces"),
      headingFont: getFontCssVariable(inputs.headingFont, "fraunces"),
      bodyFont: getFontCssVariable(inputs.bodyFont, "manrope"),
      scale: buildTypographyScale(inputs.styleDirection),
    },
    icons,
    radius: buildRadii(inputs.styleDirection),
    shadows: buildShadows(inputs.styleDirection),
    foundations,
    utilities,
    utilityCoverage,
    components,
    screens,
    density,
  };
}

export function resolveTokenReference(reference: string, palettes: PaletteCollection) {
  const [paletteName, scaleStep] = reference.split(".");

  if (!paletteName || !scaleStep) {
    return "#000000";
  }

  return palettes[paletteName as keyof PaletteCollection]?.[scaleStep as keyof PaletteCollection["primary"]] ?? "#000000";
}
