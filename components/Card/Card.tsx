import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Card.module.css';

export type CardElevation = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padding?: CardPadding;
  bordered?: boolean;
  interactive?: boolean;
  children: ReactNode;
}
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }

export function CardHeader({ children, className, ...rest }: CardHeaderProps): JSX.Element {
  return <div className={cx(styles.header, className)} {...rest}>{children}</div>;
}
export function CardBody({ children, className, ...rest }: CardBodyProps): JSX.Element {
  return <div className={cx(styles.body, className)} {...rest}>{children}</div>;
}
export function CardFooter({ children, className, ...rest }: CardFooterProps): JSX.Element {
  return <div className={cx(styles.footer, className)} {...rest}>{children}</div>;
}

export function Card({ elevation = 'sm', padding = 'md', bordered = false, interactive = false, className, children, ...rest }: CardProps): JSX.Element {
  return (
    <div className={cx(styles.card, styles[`elevation-${elevation}`], styles[`padding-${padding}`], bordered && styles.bordered, interactive && styles.interactive, className)} {...rest}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body   = CardBody;
Card.Footer = CardFooter;
Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName   = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
