import { type HTMLAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Accordion.module.css';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

export function Accordion({
  variant = 'default',
  className,
  children,
  ...rest
}: AccordionProps) {
  return (
    <div className={cx(styles.root, styles[`variant-${variant}`], className)} {...rest}>
      {children}
    </div>
  );
}
