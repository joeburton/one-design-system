/**
 * Vitest setup — runs before each test file.
 * Extends expect with jest-dom and jest-axe matchers for DOM assertions.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Automatically unmount and cleanup after each test
afterEach(() => {
  cleanup();
});
