/**
 * token.utils.test.ts
 * Tests for the token utility functions.
 */

import { describe, it, expect } from 'vitest';
import { token, tokenStyle, cx } from '../utils/token.utils';
import type { SemanticToken } from '../tokens/types/tokens.types';

describe('token()', () => {
  it('returns a CSS var() reference for a valid semantic token', () => {
    const result = token('color-brand-primary');
    expect(result).toBe('var(--ds-color-brand-primary)');
  });

  it('returns correctly formatted var() for spacing tokens', () => {
    const result = token('spacing-component-md');
    expect(result).toBe('var(--ds-spacing-component-md)');
  });

  it('returns correctly formatted var() for elevation tokens', () => {
    const result = token('elevation-sm');
    expect(result).toBe('var(--ds-elevation-sm)');
  });

  it('returns correctly formatted var() for border-radius tokens', () => {
    const result = token('borderRadius-button');
    expect(result).toBe('var(--ds-borderRadius-button)');
  });

  it('returns correctly formatted var() for transition tokens', () => {
    const result = token('transition-normal');
    expect(result).toBe('var(--ds-transition-normal)');
  });

  // Type-level test: TypeScript should reject invalid token names
  // This is enforced at compile time — here we just validate runtime
  it('produces consistent prefix --ds-', () => {
    const tokens: SemanticToken[] = [
      'color-text-default',
      'color-status-error',
      'spacing-layout-lg',
    ];
    for (const t of tokens) {
      expect(token(t)).toMatch(/^var\(--ds-/);
      expect(token(t)).toMatch(/\)$/);
    }
  });
});

describe('tokenStyle()', () => {
  it('converts a map of CSS prop → token into a style object', () => {
    const style = tokenStyle({
      color: 'color-text-default',
      backgroundColor: 'color-surface-default',
    });

    expect(style).toEqual({
      color: 'var(--ds-color-text-default)',
      backgroundColor: 'var(--ds-color-surface-default)',
    });
  });

  it('skips undefined/null token values', () => {
    const style = tokenStyle({
      color: 'color-text-default',
      backgroundColor: undefined,
    });

    expect(style).toEqual({
      color: 'var(--ds-color-text-default)',
    });
    expect(style).not.toHaveProperty('backgroundColor');
  });

  it('returns an empty object for an empty map', () => {
    const style = tokenStyle({});
    expect(style).toEqual({});
  });
});

describe('cx()', () => {
  it('joins string class names', () => {
    expect(cx('foo', 'bar')).toBe('foo bar');
  });

  it('filters falsy values', () => {
    expect(cx('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('handles conditional object syntax', () => {
    expect(cx('base', { active: true, hidden: false })).toBe('base active');
  });

  it('handles mixed strings and objects', () => {
    const isLarge = true;
    const isDisabled = false;
    expect(cx('button', { large: isLarge, disabled: isDisabled }, 'extra')).toBe(
      'button large extra'
    );
  });

  it('returns empty string for all falsy args', () => {
    expect(cx(false, null, undefined)).toBe('');
  });

  it('handles single class', () => {
    expect(cx('only')).toBe('only');
  });
});
