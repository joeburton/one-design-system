/**
 * Token type system for One Design System.
 * Strategy: explicit union types for semantic token keys give autocomplete
 * and compile-time safety. JSON imports give inferred literal types for raw values.
 */

export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'gradient'
  | 'typography'
  | 'border'
  | 'transition'
  | 'strokeStyle';

export interface DesignToken<T = string | number> {
  $value: T;
  $type: TokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export type ThemeName = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  systemPrefersDark: boolean;
}

/** CSS variable reference string */
export type CssVar = `var(--ds-${string})`;
export type CssVarName = `--ds-${string}`;
export type CssVariableMap = Record<CssVarName, string>;

export interface TransformResult {
  variables: CssVariableMap;
  cssString: string;
  selector: string;
}

// ---------------------------------------------------------------------------
// Semantic token key unions
// ---------------------------------------------------------------------------

export type ColorBackgroundToken =
  | 'color-background-default'
  | 'color-background-subtle'
  | 'color-background-muted'
  | 'color-background-emphasis';

export type ColorSurfaceToken =
  | 'color-surface-default'
  | 'color-surface-raised'
  | 'color-surface-overlay'
  | 'color-surface-sunken';

export type ColorBorderToken =
  | 'color-border-default'
  | 'color-border-subtle'
  | 'color-border-strong'
  | 'color-border-focus';

export type ColorTextToken =
  | 'color-text-default'
  | 'color-text-subtle'
  | 'color-text-muted'
  | 'color-text-onEmphasis'
  | 'color-text-link'
  | 'color-text-linkHover'
  | 'color-text-disabled';

export type ColorBrandToken =
  | 'color-brand-primary'
  | 'color-brand-primaryHover'
  | 'color-brand-primaryActive'
  | 'color-brand-primaryMuted'
  | 'color-brand-primaryBorder'
  | 'color-brand-primaryText';

export type ColorStatusToken =
  | 'color-status-success'
  | 'color-status-successHover'
  | 'color-status-successMuted'
  | 'color-status-successBorder'
  | 'color-status-successText'
  | 'color-status-warning'
  | 'color-status-warningHover'
  | 'color-status-warningMuted'
  | 'color-status-warningBorder'
  | 'color-status-warningText'
  | 'color-status-error'
  | 'color-status-errorHover'
  | 'color-status-errorMuted'
  | 'color-status-errorBorder'
  | 'color-status-errorText'
  | 'color-status-info'
  | 'color-status-infoHover'
  | 'color-status-infoMuted'
  | 'color-status-infoBorder'
  | 'color-status-infoText';

export type SpacingToken =
  | 'spacing-component-xs'
  | 'spacing-component-sm'
  | 'spacing-component-md'
  | 'spacing-component-lg'
  | 'spacing-component-xl'
  | 'spacing-layout-xs'
  | 'spacing-layout-sm'
  | 'spacing-layout-md'
  | 'spacing-layout-lg'
  | 'spacing-layout-xl'
  | 'spacing-layout-2xl';

export type BorderRadiusToken =
  | 'borderRadius-button'
  | 'borderRadius-input'
  | 'borderRadius-card'
  | 'borderRadius-badge'
  | 'borderRadius-tooltip';

export type ElevationToken =
  | 'elevation-none'
  | 'elevation-xs'
  | 'elevation-sm'
  | 'elevation-md'
  | 'elevation-lg'
  | 'elevation-xl';

export type TransitionToken = 'transition-fast' | 'transition-normal' | 'transition-slow';

export type SemanticToken =
  | ColorBackgroundToken
  | ColorSurfaceToken
  | ColorBorderToken
  | ColorTextToken
  | ColorBrandToken
  | ColorStatusToken
  | SpacingToken
  | BorderRadiusToken
  | ElevationToken
  | TransitionToken;

/** Build a typed CSS var() string from a semantic token */
export type TokenVar<T extends SemanticToken> = `var(--ds-${T})`;

export function tokenVar<T extends SemanticToken>(token: T): TokenVar<T> {
  return `var(--ds-${token})` as TokenVar<T>;
}

// Component-level type constraints
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ComponentStatus = 'success' | 'warning' | 'error' | 'info';
