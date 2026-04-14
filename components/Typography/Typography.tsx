import { createElement, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Typography.module.css';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type BodyVariant = 'body' | 'body-sm' | 'body-lg' | 'caption' | 'overline' | 'code';
export type AllVariants = HeadingLevel | BodyVariant;

export type TypographyColor = 'default' | 'subtle' | 'muted' | 'onEmphasis' | 'link' | 'error' | 'success' | 'warning';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: AllVariants;
  color?: TypographyColor;
  truncate?: boolean;
  children: ReactNode;
}

const variantEl: Record<AllVariants, ElementType> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  body: 'p', 'body-sm': 'p', 'body-lg': 'p', caption: 'span', overline: 'span', code: 'code',
};

export function Typography({ as, variant = 'body', color = 'default', truncate = false, className, children, ...rest }: TypographyProps): JSX.Element {
  const el = as ?? variantEl[variant] ?? 'p';
  return createElement(el, {
    className: cx(styles.base, styles[`variant-${variant}`], styles[`color-${color}`], truncate && styles.truncate, className),
    ...rest,
  }, children);
}

type HeadingProps = Omit<TypographyProps, 'variant' | 'as'> & { as?: HeadingLevel };
type TextProps = Omit<TypographyProps, 'variant'>;

export const H1 = (p: HeadingProps) => <Typography variant="h1" {...p} />;
export const H2 = (p: HeadingProps) => <Typography variant="h2" {...p} />;
export const H3 = (p: HeadingProps) => <Typography variant="h3" {...p} />;
export const H4 = (p: HeadingProps) => <Typography variant="h4" {...p} />;
export const H5 = (p: HeadingProps) => <Typography variant="h5" {...p} />;
export const H6 = (p: HeadingProps) => <Typography variant="h6" {...p} />;
export const Text = (p: TextProps) => <Typography variant="body" {...p} />;
export const TextSm = (p: TextProps) => <Typography variant="body-sm" {...p} />;
export const Caption = (p: TextProps) => <Typography variant="caption" {...p} />;
export const Overline = (p: TextProps) => <Typography variant="overline" {...p} />;
export const Code = (p: TextProps) => <Typography as="code" variant="code" {...p} />;

Typography.displayName = 'Typography';
H1.displayName = 'H1'; H2.displayName = 'H2'; H3.displayName = 'H3';
H4.displayName = 'H4'; H5.displayName = 'H5'; H6.displayName = 'H6';
Text.displayName = 'Text'; TextSm.displayName = 'TextSm';
Caption.displayName = 'Caption'; Overline.displayName = 'Overline'; Code.displayName = 'Code';
