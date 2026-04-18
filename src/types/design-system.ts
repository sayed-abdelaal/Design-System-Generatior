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

export type EasingScale = {
  standard: string;
  emphasized: string;
  entrance: string;
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

export type FoundationTokens = {
  spacing: SpacingScale;
  fontWeights: FontWeightScale;
  tracking: TrackingScale;
  leading: LeadingScale;
  breakpoints: BreakpointScale;
  containers: ContainerScale;
  insetShadows: InsetShadowScale;
  dropShadows: DropShadowScale;
  blur: BlurScale;
  easing: EasingScale;
  animations: AnimationScale;
  aspectRatios: AspectRatioScale;
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

export type ButtonRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  primaryShadow: keyof ShadowScale;
  secondaryStyle: "outline" | "soft";
  ghostStyle: "subtle" | "minimal";
  hoverLift: "none" | "sm" | "md";
};

export type InputRecipe = {
  radius: keyof RadiusScale;
  paddingX: keyof SpacingScale;
  paddingY: keyof SpacingScale;
  borderStyle: "soft" | "strong";
  validationStyle: "soft" | "strong";
  showHelperText: boolean;
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
};

export type AlertRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  emphasis: "soft" | "strong";
  variantStyle: "tinted" | "outlined";
};

export type TableRecipe = {
  radius: keyof RadiusScale;
  cellPaddingX: keyof SpacingScale;
  cellPaddingY: keyof SpacingScale;
  headerStyle: "muted" | "elevated";
  density: "compact" | "comfortable";
  zebraStripes: boolean;
};

export type DialogRecipe = {
  radius: keyof RadiusScale;
  width: keyof ContainerScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
  overlayBlur: keyof BlurScale;
  overlayTone: "soft" | "strong";
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

export type ListboxRecipe = {
  radius: keyof RadiusScale;
  optionPadding: keyof SpacingScale;
  maxHeight: keyof ContainerScale;
};

export type PaginationRecipe = {
  radius: keyof RadiusScale;
  gap: keyof SpacingScale;
};

export type DropdownRecipe = {
  radius: keyof RadiusScale;
  padding: keyof SpacingScale;
  shadow: keyof ShadowScale;
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

export type ComponentRecipes = {
  button: ButtonRecipe;
  input: InputRecipe;
  table: TableRecipe;
  sidebar: SidebarRecipe;
  checkbox: CheckboxRecipe;
  combobox: ComboboxRecipe;
  radioGroup: RadioGroupRecipe;
  switch: SwitchRecipe;
  descriptionList: DescriptionListRecipe;
  badge: BadgeRecipe;
  listbox: ListboxRecipe;
  pagination: PaginationRecipe;
  dropdown: DropdownRecipe;
  alert: AlertRecipe;
  navbar: NavbarRecipe;
  avatar: AvatarRecipe;
  divider: DividerRecipe;
  textarea: TextareaRecipe;
  heading: HeadingRecipe;
  text: TextRecipe;
  fieldset: FieldsetRecipe;
  dialog: DialogRecipe;
  sidebarLayout: LayoutShellRecipe;
  stackedLayout: LayoutShellRecipe;
  authLayout: AuthLayoutRecipe;
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
  foundations: FoundationTokens;
  utilities: UtilitySettings;
  components: ComponentRecipes;
  density: Density;
};
