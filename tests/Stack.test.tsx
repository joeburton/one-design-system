/**
 * Stack.test.tsx
 * Tests for the Stack layout component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Stack } from '../components/Stack/Stack';
import type {
  StackDirection,
  StackAlign,
  StackJustify,
  StackGap,
  StackWrap,
} from '../components/Stack/Stack';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Stack', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Stack>Content</Stack>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders as a div by default', () => {
      const { container } = render(<Stack>Child</Stack>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('renders multiple children', () => {
      render(
        <Stack>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </Stack>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('as prop', () => {
    it('renders as a <ul> when as="ul"', () => {
      const { container } = render(
        <Stack as="ul">
          <li>Item</li>
        </Stack>
      );
      expect(container.firstChild?.nodeName).toBe('UL');
    });

    it('renders as a <nav> when as="nav"', () => {
      const { container } = render(<Stack as="nav">Nav content</Stack>);
      expect(container.firstChild?.nodeName).toBe('NAV');
    });

    it('renders as a <section> when as="section"', () => {
      const { container } = render(<Stack as="section">Section</Stack>);
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });
  });

  describe('direction', () => {
    const directions: StackDirection[] = ['row', 'column', 'row-reverse', 'column-reverse'];
    directions.forEach((direction) => {
      it(`renders direction="${direction}" without error`, () => {
        render(<Stack direction={direction}>Content</Stack>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('align', () => {
    const alignments: StackAlign[] = ['start', 'center', 'end', 'stretch', 'baseline'];
    alignments.forEach((align) => {
      it(`renders align="${align}" without error`, () => {
        render(<Stack align={align}>Content</Stack>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('justify', () => {
    const justifications: StackJustify[] = [
      'start',
      'center',
      'end',
      'between',
      'around',
      'evenly',
    ];
    justifications.forEach((justify) => {
      it(`renders justify="${justify}" without error`, () => {
        render(<Stack justify={justify}>Content</Stack>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('gap', () => {
    const gaps: StackGap[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    gaps.forEach((gap) => {
      it(`renders gap="${gap}" without error`, () => {
        render(<Stack gap={gap}>Content</Stack>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('wrap', () => {
    const wraps: StackWrap[] = ['nowrap', 'wrap', 'wrap-reverse'];
    wraps.forEach((wrap) => {
      it(`renders wrap="${wrap}" without error`, () => {
        render(<Stack wrap={wrap}>Content</Stack>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('sizing flags', () => {
    it('renders without error when fullWidth is true', () => {
      render(<Stack fullWidth>Content</Stack>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders without error when fullHeight is true', () => {
      render(<Stack fullHeight>Content</Stack>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders without error when inline is true', () => {
      render(<Stack inline>Content</Stack>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('className forwarding', () => {
    it('merges custom className', () => {
      const { container } = render(<Stack className="my-stack">Content</Stack>);
      expect(container.firstChild).toHaveClass('my-stack');
    });
  });

  describe('HTML attribute forwarding', () => {
    it('forwards arbitrary HTML attributes', () => {
      const { container } = render(<Stack data-testid="stack-root">Content</Stack>);
      expect(container.firstChild).toHaveAttribute('data-testid', 'stack-root');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Stack direction="row" gap="md">
          <span>Item 1</span>
          <span>Item 2</span>
        </Stack>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when rendered as a list', async () => {
      const { container } = render(
        <Stack as="ul" role="list" gap="sm">
          <li>Item A</li>
          <li>Item B</li>
        </Stack>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
