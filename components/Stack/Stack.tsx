import { createElement, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Stack.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Flex direction */
  direction?: StackDirection;
  /** align-items */
  align?: StackAlign;
  /** justify-content */
  justify?: StackJustify;
  /** gap using spacing tokens */
  gap?: StackGap;
  /** flex-wrap */
  wrap?: StackWrap;
  /** Render as a different HTML element */
  as?: ElementType;
  /** Makes the stack fill its container */
  fullWidth?: boolean;
  fullHeight?: boolean;
  /** Inline flex instead of block flex */
  inline?: boolean;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Stack({
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = 'nowrap',
  as: Tag = 'div',
  fullWidth = false,
  fullHeight = false,
  inline = false,
  className,
  children,
  ...rest
}: StackProps): JSX.Element {
  return createElement(
    Tag,
    {
      className: cx(
        styles.stack,
        styles[`direction-${direction}`],
        styles[`align-${align}`],
        styles[`justify-${justify}`],
        styles[`gap-${gap}`],
        styles[`wrap-${wrap}`],
        fullWidth && styles.fullWidth,
        fullHeight && styles.fullHeight,
        inline && styles.inline,
        className
      ),
      ...rest,
    },
    children
  );
}

Stack.displayName = 'Stack';
