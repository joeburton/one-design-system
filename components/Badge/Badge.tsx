import { type HTMLAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx(
        styles.badge,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        dot && styles.dot,
        className
      )}
      {...rest}
    >
      {!dot && children}
    </span>
  );
}

Badge.displayName = 'Badge';
