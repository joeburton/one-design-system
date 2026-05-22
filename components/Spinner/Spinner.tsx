import { type HTMLAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading…', className, ...rest }: SpinnerProps) {
  return (
    <span role="status" className={cx(styles.root, styles[`size-${size}`], className)} {...rest}>
      <span className={styles.wheel} aria-hidden="true" />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}

Spinner.displayName = 'Spinner';
