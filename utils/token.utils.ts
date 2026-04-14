import type { SemanticToken, CssVar } from '../tokens/types/tokens.types';

/** Returns a typed `var(--ds-...)` CSS reference */
export function token<T extends SemanticToken>(name: T): CssVar {
  return `var(--ds-${name})` as CssVar;
}

/** Build a style object from a map of CSS prop → semantic token */
export function tokenStyle(map: Partial<Record<string, SemanticToken>>): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [prop, t] of Object.entries(map)) {
    if (t) style[prop] = token(t);
  }
  return style;
}

/** Lightweight conditional className utility */
export function cx(
  ...args: Array<string | undefined | null | false | Record<string, boolean>>
): string {
  const out: string[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') {
      out.push(arg);
      continue;
    }
    for (const [cls, on] of Object.entries(arg)) {
      if (on) out.push(cls);
    }
  }
  return out.join(' ');
}

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const sizeToSpacingToken: Record<ComponentSize, SemanticToken> = {
  xs: 'spacing-component-xs',
  sm: 'spacing-component-sm',
  md: 'spacing-component-md',
  lg: 'spacing-component-lg',
  xl: 'spacing-component-xl',
};
