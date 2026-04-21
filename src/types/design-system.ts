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
  "info",
  "attention",
  "highlight",
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
  "info",
  "attention",
  "highlight",
] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];
export type PaletteName = (typeof PALETTE_NAMES)[number];
export type SemanticTokenName = (typeof SEMANTIC_TOKEN_NAMES)[number];

export type ColorScale = Record<ScaleStep, string>;
export type PaletteCollection = Record<string, ColorScale>;
export type TokenReference = `${string}.${ScaleStep}`;
export type ThemeSemanticTokens = Record<SemanticTokenName, TokenReference>;

export type NeutralBasePreference =
  | "balanced"
  | "warm"
  | "cool"
  | "slate"
  | "stone"
  | "sand"
  | "zinc"
  | "graphite"
  | "moss"
  | "cocoa"
  | "custom";
export type StyleDirection =
  | "fintech"
  | "minimal"
  | "bold"
  | "editorial"
  | "studio"
  | "luxury"
  | "playful"
  | "brutalist"
  | "futuristic"
  | "organic";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  cssVariable: string;
  category: "sans" | "serif" | "display";
};

export type TypographyScaleToken = {
  size: string;
  lineHeight: string;
  weight: string;
  letterSpacing?: string;
};

export type TypographyScale = Record<
  | "display1"
  | "display2"
  | "display3"
  | "display4"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "bodyLg"
  | "body"
  | "bodySm"
  | "caption"
  | "overline"
  | "label"
  | "helper"
  | "code"
  | "codeSm",
  TypographyScaleToken
>;

export type TypographyTokens = {
  displayFont: string;
  headingFont: string;
  bodyFont: string;
  scale: TypographyScale;
};

export type ColorInputKey = PaletteName;

export type PaletteOverrideMap = Partial<Record<ColorInputKey, string>>;

export type CustomColorInput = {
  id: string;
  name: string;
  hex: string;
};

export type CustomPalette = {
  id: string;
  name: string;
  slug: string;
  hex: string;
};

export type RadiusScale = {
  none: string;
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

export type InsetShadowScale = {
  xs: string;
  sm: string;
};

export type DropShadowScale = {
  sm: string;
  md: string;
};

export type BlurScale = {
  sm: string;
  md: string;
  lg: string;
};

export type OpacityScale = {
  subtle: string;
  muted: string;
  disabled: string;
  strong: string;
};

export type EasingScale = {
  standard: string;
  emphasized: string;
  entrance: string;
};

export type MotionDurationScale = {
  fast: string;
  standard: string;
  slow: string;
};

export type AnimationScale = {
  fadeIn: string;
  riseIn: string;
  pulseSoft: string;
};

export type BreakpointScale = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
};

export type ContainerScale = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
};

export type AspectRatioScale = {
  square: string;
  video: string;
  portrait: string;
  wide: string;
};

export type BorderWidthScale = {
  hairline: string;
  default: string;
  strong: string;
};

export type ZIndexScale = {
  base: string;
  dropdown: string;
  sticky: string;
  overlay: string;
  modal: string;
  toast: string;
};

export type SpacingScale = Record<
  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24",
  string
>;

export type FontWeightScale = {
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
};

export type TrackingScale = {
  tight: string;
  normal: string;
  wide: string;
};

export type LeadingScale = {
  snug: string;
  normal: string;
  relaxed: string;
};

export type LinkStyleRules = {
  underline: "always" | "hover" | "never";
  weight: keyof FontWeightScale;
  tone: "brand" | "foreground" | "muted";
};

export type ListStyleRules = {
  marker: "disc" | "decimal" | "dash";
  gap: keyof SpacingScale;
  indent: keyof SpacingScale;
};

export type CodeStyleRules = {
  fontScale: keyof TypographyScale;
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
};

export type TruncationRules = {
  singleLine: boolean;
  multiLineClamp: "2" | "3" | "4";
  maxInlineSize: keyof ContainerScale;
};

export type ContentFoundations = {
  links: LinkStyleRules;
  lists: ListStyleRules;
  code: CodeStyleRules;
  truncation: TruncationRules;
};

export type AccessibilityFoundations = {
  contrastTarget: "AA" | "AAA";
  focusTreatment: "soft" | "brand" | "high-contrast";
  keyboardPattern: "standard" | "enhanced";
  screenReaderLabelPrefix: string;
  touchTargetMin: keyof SpacingScale;
};

export type SafeAreaFoundations = {
  top: keyof SpacingScale;
  right: keyof SpacingScale;
  bottom: keyof SpacingScale;
  left: keyof SpacingScale;
};

export type FoundationTokens = {
  spacing: SpacingScale;
  fontWeights: FontWeightScale;
  tracking: TrackingScale;
  leading: LeadingScale;
  breakpoints: BreakpointScale;
  containers: ContainerScale;
  borderWidths: BorderWidthScale;
  insetShadows: InsetShadowScale;
  dropShadows: DropShadowScale;
  blur: BlurScale;
  opacity: OpacityScale;
  easing: EasingScale;
  durations: MotionDurationScale;
  animations: AnimationScale;
  aspectRatios: AspectRatioScale;
  zIndex: ZIndexScale;
  content: ContentFoundations;
  accessibility: AccessibilityFoundations;
  safeAreas: SafeAreaFoundations;
};

export type LayoutUtilitySettings = {
  contentWidth: keyof ContainerScale;
  sectionGap: keyof SpacingScale;
  cardGap: keyof SpacingScale;
  defaultRadius: keyof RadiusScale;
};

export type SpacingUtilitySettings = {
  densityMode: Density;
  stackGap: keyof SpacingScale;
  inlineGap: keyof SpacingScale;
  insetPadding: keyof SpacingScale;
};

export type SizingUtilitySettings = {
  controlHeight: keyof SpacingScale;
  sidebarWidth: keyof ContainerScale;
  modalWidth: keyof ContainerScale;
};

export type TypographyUtilitySettings = {
  headingWeight: keyof FontWeightScale;
  bodyWeight: keyof FontWeightScale;
  bodyLeading: keyof LeadingScale;
  headingTracking: keyof TrackingScale;
};

export type BorderUtilitySettings = {
  borderRadius: keyof RadiusScale;
  borderWidth: "hairline" | "default" | "strong";
  outlineStyle: "soft" | "brand" | "high-contrast";
};

export type EffectUtilitySettings = {
  surfaceShadow: keyof ShadowScale;
  elevatedShadow: keyof ShadowScale;
  surfaceBlur: keyof BlurScale;
};

export type MotionUtilitySettings = {
  motionLevel: "calm" | "balanced" | "expressive";
  transitionEase: keyof EasingScale;
  entranceAnimation: keyof AnimationScale;
};

export type InteractivityUtilitySettings = {
  focusRingWidth: "2px" | "3px" | "4px";
  controlCursor: "pointer" | "default";
  selectionStyle: "brand" | "neutral";
};

export type UtilitySettings = {
  layout: LayoutUtilitySettings;
  spacing: SpacingUtilitySettings;
  sizing: SizingUtilitySettings;
  typography: TypographyUtilitySettings;
  borders: BorderUtilitySettings;
  effects: EffectUtilitySettings;
  motion: MotionUtilitySettings;
  interactivity: InteractivityUtilitySettings;
};

export type UtilityFamilyMode = "token" | "preset" | "mixed";

export type UtilityFamilyCoverage = {
  mode: UtilityFamilyMode;
  enabled: boolean;
  densityAware: boolean;
  notes: string;
};

export type UtilityCoverageMatrix = {
  layout: UtilityFamilyCoverage;
  flexboxGrid: UtilityFamilyCoverage;
  spacing: UtilityFamilyCoverage;
  sizing: UtilityFamilyCoverage;
  typography: UtilityFamilyCoverage;
  backgrounds: UtilityFamilyCoverage;
  borders: UtilityFamilyCoverage;
  effects: UtilityFamilyCoverage;
  filters: UtilityFamilyCoverage;
  tables: UtilityFamilyCoverage;
  transitionsAnimation: UtilityFamilyCoverage;
  transforms: UtilityFamilyCoverage;
  interactivity: UtilityFamilyCoverage;
  svg: UtilityFamilyCoverage;
  accessibility: UtilityFamilyCoverage;
};

export type ButtonRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  primaryShadow: keyof ShadowScale;
  secondaryStyle: "outline" | "soft";
  ghostStyle: "subtle" | "minimal";
  hoverLift: "none" | "sm" | "md";
  colors: {
    primary: {
      background: TokenReference;
      foreground: TokenReference;
      border: TokenReference;
      hoverBackground: TokenReference;
      hoverForeground: TokenReference;
      hoverBorder: TokenReference;
    };
    secondary: {
      background: TokenReference;
      foreground: TokenReference;
      border: TokenReference;
      hoverBackground: TokenReference;
      hoverForeground: TokenReference;
      hoverBorder: TokenReference;
    };
    ghost: {
      background: TokenReference;
      foreground: TokenReference;
      border: TokenReference;
      hoverBackground: TokenReference;
      hoverForeground: TokenReference;
      hoverBorder: TokenReference;
    };
  };
};

export type InputRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  borderStyle: "soft" | "strong";
  validationStyle: "soft" | "strong";
  showHelperText: boolean;
  showPrefix: boolean;
  showSuffix: boolean;
  searchStyle: "boxed" | "underline";
  selectStyle: "default" | "quiet";
  messageStyle: "stacked" | "inline";
  readOnlyStyle: "muted" | "outlined";
};

export type SearchFieldRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  style: "boxed" | "underline";
  showShortcut: boolean;
};

export type TypedFieldRecipe = {
  passwordReveal: boolean;
  numberControls: "inline" | "split";
  contactIcon: boolean;
  urlPreview: boolean;
};

export type DatePickerRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  density: "compact" | "comfortable";
  showWeekNumbers: boolean;
};

export type DateRangePickerRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  presetStyle: "chips" | "inline";
  showComparison: boolean;
};

export type TimePickerRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  format: "12h" | "24h";
  step: "15m" | "30m" | "60m";
};

export type FileUploadRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  style: "dropzone" | "inline";
  showPreview: boolean;
  dragState: "soft" | "strong";
};

export type SliderRecipe = {
  trackHeight: keyof SpacingScale;
  thumbSize: keyof SpacingScale;
  showValue: boolean;
  showTicks: boolean;
};

export type RangeSliderRecipe = {
  trackHeight: keyof SpacingScale;
  thumbSize: keyof SpacingScale;
  showValues: boolean;
  showInputs: boolean;
};

export type TextareaRecipe = {
  radius: keyof RadiusScale;
  minHeight: keyof SpacingScale;
  padding: keyof SpacingScale;
};

export type BadgeRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  style: "soft" | "solid";
  color: {
    background: TokenReference;
    foreground: TokenReference;
    border: TokenReference;
  };
};

export type AlertRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  emphasis: "soft" | "strong";
  variantStyle: "tinted" | "outlined";
  colors: {
    success: TokenReference;
    warning: TokenReference;
    danger: TokenReference;
    info: TokenReference;
    attention: TokenReference;
  };
};

export type TagRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  style: "soft" | "outline";
  color: {
    background: TokenReference;
    foreground: TokenReference;
    border: TokenReference;
  };
};

export type ToastRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
  tone: "soft" | "strong";
  placement: "stacked" | "floating";
};

export type BannerRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  style: "soft" | "outlined" | "solid";
  color: TokenReference;
};

export type StatusDotRecipe = {
  size: keyof SpacingScale;
  style: "soft" | "solid";
};

export type ProgressRecipe = {
  radius: keyof RadiusScale;
  height: keyof SpacingScale;
  tone: "soft" | "strong";
  showLabel: boolean;
};

export type LoaderRecipe = {
  size: keyof SpacingScale;
  stroke: "thin" | "regular" | "bold";
  style: "spinner" | "orbit";
};

export type SkeletonRecipe = {
  radius: keyof RadiusScale;
  lineHeight: keyof SpacingScale;
  shimmer: "soft" | "strong";
};

export type StateRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  layout: "compact" | "feature";
  iconEmphasis: "soft" | "strong";
};

export type TableRecipe = {
  radius: keyof RadiusScale;
  cellPaddingX: keyof SpacingScale;
  cellPaddingY: keyof SpacingScale;
  headerStyle: "muted" | "elevated";
  density: "compact" | "comfortable";
  zebraStripes: boolean;
};

export type DataGridRecipe = {
  radius: keyof RadiusScale;
  cellPadding: keyof SpacingScale;
  headerStyle: "muted" | "elevated";
  density: "compact" | "comfortable";
  selectionStyle: "checkbox" | "row";
  stickyHeader: boolean;
};

export type DialogRecipe = {
  radius: keyof RadiusScale;
  width: keyof ContainerScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
  overlayBlur: keyof BlurScale;
  overlayTone: "soft" | "strong";
  presentation: "modal" | "drawer";
  placement: "center" | "right";
  mode: "standard" | "alert";
};

export type CheckboxRecipe = {
  size: keyof SpacingScale;
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type ComboboxRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
};

export type AutocompleteRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  suggestionDensity: "compact" | "comfortable";
  showPreview: boolean;
};

export type RadioGroupRecipe = {
  gap: keyof SpacingScale;
  tone: "soft" | "strong";
};

export type SwitchRecipe = {
  trackWidth: keyof SpacingScale;
  trackHeight: keyof SpacingScale;
  thumbSize: keyof SpacingScale;
  tone: "soft" | "strong";
};

export type DescriptionListRecipe = {
  gap: keyof SpacingScale;
  termWidth: keyof ContainerScale;
};

export type ListRecipe = {
  gap: keyof SpacingScale;
  itemPadding: keyof SpacingScale;
  style: "plain" | "divided";
};

export type AvatarGroupRecipe = {
  size: keyof SpacingScale;
  overlap: keyof SpacingScale;
  ring: "none" | "soft" | "strong";
};

export type StatCardRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  emphasis: "soft" | "strong";
};

export type TimelineRecipe = {
  gap: keyof SpacingScale;
  markerSize: keyof SpacingScale;
  style: "line" | "filled";
};

export type ActivityFeedRecipe = {
  gap: keyof SpacingScale;
  itemPadding: keyof SpacingScale;
  density: "compact" | "comfortable";
};

export type ListboxRecipe = {
  radius: keyof RadiusScale;
  optionPadding: keyof SpacingScale;
  maxHeight: keyof ContainerScale;
};

export type MultiSelectRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  tagStyle: "soft" | "outline";
  maxVisible: 2 | 3 | 4;
};

export type PaginationRecipe = {
  radius: keyof RadiusScale;
  gap: keyof SpacingScale;
};

export type BreadcrumbsRecipe = {
  gap: keyof SpacingScale;
  separatorStyle: "chevron" | "slash";
  emphasis: "soft" | "strong";
};

export type StepperRecipe = {
  gap: keyof SpacingScale;
  markerSize: keyof SpacingScale;
  style: "line" | "pill";
};

export type TabsRecipe = {
  radius: keyof RadiusScale;
  gap: keyof SpacingScale;
  activeStyle: "pill" | "underline";
  tone: "soft" | "strong";
};

export type DropdownRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
};

export type CommandPaletteRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
  density: "compact" | "comfortable";
  showShortcuts: boolean;
  previewPane: boolean;
};

export type PopoverRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
  tone: "soft" | "strong";
};

export type TooltipRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  tone: "soft" | "strong";
};

export type NavbarRecipe = {
  height: keyof SpacingScale;
  paddingX: keyof SpacingScale;
  blur: keyof BlurScale;
};

export type SidebarRecipe = {
  width: keyof ContainerScale;
  itemGap: keyof SpacingScale;
  itemRadius: keyof RadiusScale;
};

export type AvatarRecipe = {
  size: keyof SpacingScale;
  radius: keyof RadiusScale;
  ring: "none" | "soft" | "strong";
};

export type DividerRecipe = {
  thickness: "1px" | "2px";
  inset: keyof SpacingScale;
};

export type HeadingRecipe = {
  scale: keyof TypographyScale;
  weight: keyof FontWeightScale;
  tracking: keyof TrackingScale;
};

export type TextRecipe = {
  scale: keyof TypographyScale;
  leading: keyof LeadingScale;
  tone: "primary" | "secondary" | "muted";
};

export type LinkRecipe = {
  scale: keyof TypographyScale;
  weight: keyof FontWeightScale;
  underline: "always" | "hover" | "none";
  tone: "brand" | "foreground" | "muted";
};

export type BoxRecipe = {
  padding: keyof SpacingScale;
  radius: keyof RadiusScale;
  surface: "flat" | "raised";
};

export type ContainerRecipe = {
  width: keyof ContainerScale;
  padding: keyof SpacingScale;
  align: "left" | "center";
};

export type StackRecipe = {
  gap: keyof SpacingScale;
  align: "start" | "center" | "stretch";
};

export type InlineRecipe = {
  gap: keyof SpacingScale;
  wrap: boolean;
  align: "start" | "center" | "between";
};

export type GridPrimitiveRecipe = {
  columns: "2" | "3" | "4";
  gap: keyof SpacingScale;
  responsive: "auto" | "fixed";
};

export type IconButtonRecipe = {
  size: keyof SpacingScale;
  radius: keyof RadiusScale;
  tone: "filled" | "soft" | "ghost";
};

export type LinkButtonRecipe = {
  scale: keyof TypographyScale;
  emphasis: "underline" | "solid";
  tone: "brand" | "muted";
};

export type SplitButtonRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type ButtonGroupRecipe = {
  radius: keyof RadiusScale;
  attached: boolean;
};

export type ContextMenuRecipe = {
  radius: keyof RadiusScale;
  density: "compact" | "comfortable";
};

export type SkipLinkRecipe = {
  radius: keyof RadiusScale;
  offset: keyof SpacingScale;
  reveal: "inline" | "floating";
};

export type AnchorNavRecipe = {
  gap: keyof SpacingScale;
  style: "underline" | "pill";
};

export type BottomNavRecipe = {
  height: keyof SpacingScale;
  emphasis: "soft" | "strong";
};

export type TreeViewRecipe = {
  indent: keyof SpacingScale;
  density: "compact" | "comfortable";
};

export type VisuallyHiddenRecipe = {
  labelPrefix: string;
  revealOnFocus: boolean;
};

export type PortalRecipe = {
  layer: keyof ZIndexScale;
  offset: keyof SpacingScale;
  tone: "soft" | "strong";
};

export type ScrollAreaRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  scrollbar: "subtle" | "visible";
  maxHeight: keyof ContainerScale;
};

export type OtpInputRecipe = {
  slots: "4" | "6";
  gap: keyof SpacingScale;
  mask: boolean;
};

export type StepperInputRecipe = {
  radius: keyof RadiusScale;
  stepSize: "1" | "5" | "10";
};

export type DateTimePickerRecipe = {
  radius: keyof RadiusScale;
  density: "compact" | "comfortable";
  timeFormat: "12h" | "24h";
};

export type SelectFieldRecipe = {
  radius: keyof RadiusScale;
  style: "default" | "quiet" | "underline";
};

export type InputGroupRecipe = {
  radius: keyof RadiusScale;
  gap: keyof SpacingScale;
  attached: boolean;
};

export type CharacterCountRecipe = {
  tone: "muted" | "warning";
  alignment: "end" | "between";
};

export type FieldsetRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  legendStyle: "inline" | "stacked";
};

export type LayoutShellRecipe = {
  contentWidth: keyof ContainerScale;
  sidebarWidth: keyof ContainerScale;
  headerHeight: keyof SpacingScale;
  pageGap: keyof SpacingScale;
};

export type AuthLayoutRecipe = {
  cardWidth: keyof ContainerScale;
  cardRadius: keyof RadiusScale;
  cardPadding: keyof SpacingScale;
};

export type SaveStateRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  style: "inline" | "banner" | "toast";
  emphasis: "soft" | "strong";
};

export type PageTemplateRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  style: "empty" | "error" | "maintenance";
  alignment: "centered" | "split";
};

export type OnboardingRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  layout: "checklist" | "spotlight";
  emphasis: "soft" | "strong";
};

export type MultiStepFlowRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  stepStyle: "pill" | "line";
  showSummary: boolean;
};

export type PermissionStateRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  tone: "soft" | "strong";
  layout: "inline" | "panel";
};

export type HoverCardRecipe = {
  radius: keyof RadiusScale;
  shadow: keyof ShadowScale;
  trigger: "hover" | "click";
};

export type CodeBlockRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  lineNumbers: boolean;
};

export type QuoteBlockRecipe = {
  radius: keyof RadiusScale;
  border: "accent" | "neutral";
};

export type CalendarViewRecipe = {
  density: "compact" | "comfortable";
  showWeekends: boolean;
};

export type FilterBarRecipe = {
  radius: keyof RadiusScale;
  chips: boolean;
  sticky: boolean;
};

export type ChartCardRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  chartType: "line" | "bar" | "donut";
};

export type SheetRecipe = {
  radius: keyof RadiusScale;
  placement: "bottom" | "right";
  tone: "soft" | "strong";
};

export type SidePanelRecipe = {
  width: keyof ContainerScale;
  tone: "soft" | "strong";
};

export type BulkActionsRecipe = {
  radius: keyof RadiusScale;
  selectionStyle: "inline" | "bar";
};

export type InlineEditRecipe = {
  radius: keyof RadiusScale;
  trigger: "icon" | "row";
};

export type TableSelectionRecipe = {
  density: "compact" | "comfortable";
  bulkBar: boolean;
};

export type NotificationCenterRecipe = {
  width: keyof ContainerScale;
  style: "stacked" | "grouped";
};

export type FileUploadFlowRecipe = {
  layout: "steps" | "stack";
  showPreview: boolean;
};

export type SegmentedControlRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type ColorPickerRecipe = {
  radius: keyof RadiusScale;
  showHex: boolean;
};

export type RichTextEditorRecipe = {
  radius: keyof RadiusScale;
  toolbar: "compact" | "full";
};

export type FieldRecipe = {
  gap: keyof SpacingScale;
  tone: "default" | "muted";
};

export type LabelRecipe = {
  scale: keyof TypographyScale;
  requiredMark: "text" | "dot";
};

export type DragDropUploadRecipe = {
  radius: keyof RadiusScale;
  emphasis: "soft" | "strong";
};

export type TertiaryButtonRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "ghost";
};

export type DestructiveButtonRecipe = {
  radius: keyof RadiusScale;
  emphasis: "soft" | "strong";
};

export type FabRecipe = {
  size: keyof SpacingScale;
  tone: "brand" | "neutral";
};

export type CopyActionRecipe = {
  radius: keyof RadiusScale;
  confirmation: "toast" | "inline";
};

export type ShareActionRecipe = {
  radius: keyof RadiusScale;
  style: "button" | "menu";
};

export type MenuRecipe = {
  radius: keyof RadiusScale;
  density: "compact" | "comfortable";
};

export type NavigationMenuRecipe = {
  gap: keyof SpacingScale;
  emphasis: "soft" | "strong";
};

export type AccordionNavRecipe = {
  radius: keyof RadiusScale;
  density: "compact" | "comfortable";
};

export type CircularProgressRecipe = {
  size: keyof SpacingScale;
  tone: "soft" | "strong";
};

export type OfflineStateRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type KeyValuePairRecipe = {
  gap: keyof SpacingScale;
  tone: "default" | "muted";
};

export type EmptyPlaceholderRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type ChartLegendRecipe = {
  tone: "inline" | "panel";
};

export type ChartAxisRecipe = {
  tone: "muted" | "strong";
};

export type LightboxRecipe = {
  tone: "soft" | "strong";
};

export type BottomSheetRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type CommandDialogRecipe = {
  radius: keyof RadiusScale;
  density: "compact" | "comfortable";
};

export type SplitViewRecipe = {
  leftWidth: keyof ContainerScale;
  emphasis: "soft" | "strong";
};

export type MasterDetailRecipe = {
  masterWidth: keyof ContainerScale;
  density: "compact" | "comfortable";
};

export type SearchResultsLayoutRecipe = {
  filters: "sidebar" | "toolbar";
  density: "compact" | "comfortable";
};

export type NotFoundPageRecipe = {
  radius: keyof RadiusScale;
  tone: "soft" | "strong";
};

export type CreateFlowRecipe = {
  layout: "stepper" | "form";
  emphasis: "soft" | "strong";
};

export type EditFlowRecipe = {
  autosave: boolean;
  layout: "inline" | "panel";
};

export type DeleteConfirmationRecipe = {
  style: "dialog" | "inline";
  severity: "warning" | "danger";
};

export type FilterSortPatternRecipe = {
  layout: "toolbar" | "sidebar";
  chips: boolean;
};

export type EmptyToPopulatedRecipe = {
  transition: "instant" | "staged";
};

export type ActivityHistoryRecipe = {
  density: "compact" | "comfortable";
  grouping: "day" | "event";
};

export type SuccessConfirmationRecipe = {
  tone: "soft" | "strong";
  layout: "inline" | "panel";
};

export type BrandThemeVariant = {
  name: string;
  primary: TokenReference;
  surface: TokenReference;
};

export type ScreenPreset = {
  maxWidth: keyof ContainerScale;
  sectionGap: keyof SpacingScale;
  chromePadding: keyof SpacingScale;
  density: Density;
};

export type ScreenPresets = {
  dashboard: ScreenPreset;
  settings: ScreenPreset;
  auth: ScreenPreset;
  marketing: ScreenPreset;
  dataTable: ScreenPreset;
  formPage: ScreenPreset;
};

export type IconColorBehavior = "semantic" | "current" | "muted";

export type IconUsageSemanticTokens = {
  buttons: TokenReference;
  alerts: TokenReference;
  nav: TokenReference;
  tables: TokenReference;
  inputs: TokenReference;
};

export type IconSystem = {
  defaultSize: number;
  strokeWidth: number;
  colorBehavior: IconColorBehavior;
  semanticUsage: IconUsageSemanticTokens;
};

export type ComponentRecipes = {
  button: ButtonRecipe;
  input: InputRecipe;
  searchField: SearchFieldRecipe;
  typedField: TypedFieldRecipe;
  datePicker: DatePickerRecipe;
  dateRangePicker: DateRangePickerRecipe;
  timePicker: TimePickerRecipe;
  fileUpload: FileUploadRecipe;
  slider: SliderRecipe;
  rangeSlider: RangeSliderRecipe;
  table: TableRecipe;
  dataGrid: DataGridRecipe;
  sidebar: SidebarRecipe;
  checkbox: CheckboxRecipe;
  combobox: ComboboxRecipe;
  autocomplete: AutocompleteRecipe;
  radioGroup: RadioGroupRecipe;
  switch: SwitchRecipe;
  descriptionList: DescriptionListRecipe;
  list: ListRecipe;
  badge: BadgeRecipe;
  tag: TagRecipe;
  toast: ToastRecipe;
  banner: BannerRecipe;
  statusDot: StatusDotRecipe;
  progress: ProgressRecipe;
  loader: LoaderRecipe;
  skeleton: SkeletonRecipe;
  state: StateRecipe;
  listbox: ListboxRecipe;
  multiSelect: MultiSelectRecipe;
  pagination: PaginationRecipe;
  breadcrumbs: BreadcrumbsRecipe;
  stepper: StepperRecipe;
  tabs: TabsRecipe;
  dropdown: DropdownRecipe;
  commandPalette: CommandPaletteRecipe;
  popover: PopoverRecipe;
  tooltip: TooltipRecipe;
  alert: AlertRecipe;
  navbar: NavbarRecipe;
  avatar: AvatarRecipe;
  avatarGroup: AvatarGroupRecipe;
  statCard: StatCardRecipe;
  timeline: TimelineRecipe;
  activityFeed: ActivityFeedRecipe;
  divider: DividerRecipe;
  textarea: TextareaRecipe;
  heading: HeadingRecipe;
  text: TextRecipe;
  link: LinkRecipe;
  box: BoxRecipe;
  container: ContainerRecipe;
  stack: StackRecipe;
  inline: InlineRecipe;
  gridPrimitive: GridPrimitiveRecipe;
  iconButton: IconButtonRecipe;
  linkButton: LinkButtonRecipe;
  splitButton: SplitButtonRecipe;
  buttonGroup: ButtonGroupRecipe;
  contextMenu: ContextMenuRecipe;
  skipLink: SkipLinkRecipe;
  anchorNav: AnchorNavRecipe;
  bottomNav: BottomNavRecipe;
  treeView: TreeViewRecipe;
  visuallyHidden: VisuallyHiddenRecipe;
  portal: PortalRecipe;
  scrollArea: ScrollAreaRecipe;
  otpInput: OtpInputRecipe;
  stepperInput: StepperInputRecipe;
  dateTimePicker: DateTimePickerRecipe;
  selectField: SelectFieldRecipe;
  inputGroup: InputGroupRecipe;
  characterCount: CharacterCountRecipe;
  fieldset: FieldsetRecipe;
  dialog: DialogRecipe;
  sidebarLayout: LayoutShellRecipe;
  stackedLayout: LayoutShellRecipe;
  authLayout: AuthLayoutRecipe;
  saveState: SaveStateRecipe;
  pageTemplate: PageTemplateRecipe;
  onboarding: OnboardingRecipe;
  multiStepFlow: MultiStepFlowRecipe;
  permissionState: PermissionStateRecipe;
  hoverCard: HoverCardRecipe;
  codeBlock: CodeBlockRecipe;
  quoteBlock: QuoteBlockRecipe;
  calendarView: CalendarViewRecipe;
  filterBar: FilterBarRecipe;
  chartCard: ChartCardRecipe;
  sheet: SheetRecipe;
  sidePanel: SidePanelRecipe;
  bulkActions: BulkActionsRecipe;
  inlineEdit: InlineEditRecipe;
  tableSelection: TableSelectionRecipe;
  notificationCenter: NotificationCenterRecipe;
  fileUploadFlow: FileUploadFlowRecipe;
  segmentedControl: SegmentedControlRecipe;
  colorPicker: ColorPickerRecipe;
  richTextEditor: RichTextEditorRecipe;
  field: FieldRecipe;
  label: LabelRecipe;
  dragDropUpload: DragDropUploadRecipe;
  tertiaryButton: TertiaryButtonRecipe;
  destructiveButton: DestructiveButtonRecipe;
  fab: FabRecipe;
  copyAction: CopyActionRecipe;
  shareAction: ShareActionRecipe;
  menu: MenuRecipe;
  navigationMenu: NavigationMenuRecipe;
  accordionNav: AccordionNavRecipe;
  circularProgress: CircularProgressRecipe;
  offlineState: OfflineStateRecipe;
  keyValuePair: KeyValuePairRecipe;
  emptyPlaceholder: EmptyPlaceholderRecipe;
  chartLegend: ChartLegendRecipe;
  chartAxis: ChartAxisRecipe;
  lightbox: LightboxRecipe;
  bottomSheet: BottomSheetRecipe;
  commandDialog: CommandDialogRecipe;
  splitView: SplitViewRecipe;
  masterDetail: MasterDetailRecipe;
  searchResultsLayout: SearchResultsLayoutRecipe;
  notFoundPage: NotFoundPageRecipe;
  createFlow: CreateFlowRecipe;
  editFlow: EditFlowRecipe;
  deleteConfirmation: DeleteConfirmationRecipe;
  filterSortPattern: FilterSortPatternRecipe;
  emptyToPopulated: EmptyToPopulatedRecipe;
  activityHistory: ActivityHistoryRecipe;
  successConfirmation: SuccessConfirmationRecipe;
};

export type Density = "compact" | "comfortable" | "airy";

export type BrandInputs = {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  neutralBasePreference: NeutralBasePreference;
  neutralBaseHex: string;
  advancedPaletteInputs: boolean;
  paletteOverrides: PaletteOverrideMap;
  customColors: CustomColorInput[];
  displayFont: string;
  headingFont: string;
  bodyFont: string;
  styleDirection: StyleDirection;
  logoDataUrl: string | null;
};

export type GeneratedSystem = {
  styleDirection: StyleDirection;
  palettes: PaletteCollection;
  customPalettes: CustomPalette[];
  lightTokens: ThemeSemanticTokens;
  darkTokens: ThemeSemanticTokens;
  typography: TypographyTokens;
  icons: IconSystem;
  radius: RadiusScale;
  shadows: ShadowScale;
  foundations: FoundationTokens;
  utilities: UtilitySettings;
  utilityCoverage: UtilityCoverageMatrix;
  components: ComponentRecipes;
  screens: ScreenPresets;
  brandThemes: BrandThemeVariant[];
  density: Density;
};
