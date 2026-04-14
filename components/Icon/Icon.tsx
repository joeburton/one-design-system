import { type SVGAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Icon.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor =
  | 'inherit'
  | 'default'
  | 'subtle'
  | 'muted'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** The SVG path(s) or content — keep icons in a separate icon registry */
  children: React.ReactNode;
  /** Accessible label — required unless aria-hidden is set */
  label?: string;
  size?: IconSize;
  color?: IconColor;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Icon wrapper component.
 *
 * Pattern: keep raw SVG paths in a separate icon registry (e.g. /components/Icon/icons/)
 * and compose with this wrapper for consistent sizing, colour, and accessibility.
 *
 * @example
 * import { CheckIcon } from '../Icon/icons/CheckIcon';
 * <Icon label="Success" size="sm" color="success"><CheckIcon /></Icon>
 */
export function Icon({
  children,
  label,
  size = 'md',
  color = 'inherit',
  className,
  ...rest
}: IconProps): JSX.Element {
  const isDecorative = !label;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      role={isDecorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={isDecorative ? true : undefined}
      focusable="false"
      className={cx(styles.icon, styles[`size-${size}`], styles[`color-${color}`], className)}
      {...rest}
    >
      {children}
    </svg>
  );
}

Icon.displayName = 'Icon';

// ---------------------------------------------------------------------------
// Built-in icon shapes (kept minimal — extend in your icon registry)
// ---------------------------------------------------------------------------

export const icons = {
  check: (
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  ),
  close: (
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  ),
  info: (
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  ),
  warning: (
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  ),
  search: (
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  ),
  chevronDown: (
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  ),
  plus: (
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  ),
  moon: <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />,
  sun: (
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  ),
} as const;

export type IconName = keyof typeof icons;

/** Convenience component — renders a named icon from the built-in registry */
export function NamedIcon({
  name,
  ...props
}: { name: IconName } & Omit<IconProps, 'children'>): JSX.Element {
  return <Icon {...props}>{icons[name]}</Icon>;
}

NamedIcon.displayName = 'NamedIcon';
