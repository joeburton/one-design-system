/**
 * Vitest setup — runs before each test file.
 * Extends expect with jest-dom matchers for DOM assertions.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically unmount and cleanup after each test
afterEach(() => {
  cleanup();
});
