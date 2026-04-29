/**
 * Typography.test.tsx
 * Tests for the Typography component and its convenience exports.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  Typography,
  H1, H2, H3, H4, H5, H6,
  Text, TextSm, Caption, Overline, Code,
} from '../components/Typography/Typography';
import type { AllVariants, TypographyColor } from '../components/Typography/Typography';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Typography', () => {
  describe('default rendering', () => {
    it('renders a <p> element by default', () => {
      render(<Typography>Hello</Typography>);
      expect(screen.getByText('Hello').tagName).toBe('P');
    });

    it('renders children correctly', () => {
      render(<Typography>Design system</Typography>);
      expect(screen.getByText('Design system')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    const headingVariants: AllVariants[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    headingVariants.forEach((variant) => {
      it(`renders variant="${variant}" as the correct heading element`, () => {
        render(<Typography variant={variant}>{variant}</Typography>);
        expect(screen.getByRole('heading', { level: parseInt(variant[1]) })).toBeInTheDocument();
      });
    });

    it('renders variant="body" as <p>', () => {
      render(<Typography variant="body">Body text</Typography>);
      expect(screen.getByText('Body text').tagName).toBe('P');
    });

    it('renders variant="body-sm" as <p>', () => {
      render(<Typography variant="body-sm">Small body</Typography>);
      expect(screen.getByText('Small body').tagName).toBe('P');
    });

    it('renders variant="body-lg" as <p>', () => {
      render(<Typography variant="body-lg">Large body</Typography>);
      expect(screen.getByText('Large body').tagName).toBe('P');
    });

    it('renders variant="caption" as <span>', () => {
      render(<Typography variant="caption">Caption</Typography>);
      expect(screen.getByText('Caption').tagName).toBe('SPAN');
    });

    it('renders variant="overline" as <span>', () => {
      render(<Typography variant="overline">Overline</Typography>);
      expect(screen.getByText('Overline').tagName).toBe('SPAN');
    });

    it('renders variant="code" as <code>', () => {
      render(<Typography variant="code">const x = 1;</Typography>);
      expect(screen.getByText('const x = 1;').tagName).toBe('CODE');
    });
  });

  describe('as prop', () => {
    it('renders as a custom element when `as` is provided', () => {
      render(<Typography as="article">Content</Typography>);
      expect(screen.getByText('Content').tagName).toBe('ARTICLE');
    });

    it('overrides the default element for a heading variant', () => {
      render(<Typography variant="h2" as="h3">Title</Typography>);
      expect(screen.getByText('Title').tagName).toBe('H3');
    });
  });

  describe('colors', () => {
    const colors: TypographyColor[] = [
      'default', 'subtle', 'muted', 'onEmphasis', 'link', 'error', 'success', 'warning',
    ];
    colors.forEach((color) => {
      it(`renders color="${color}" without error`, () => {
        render(<Typography color={color}>Text</Typography>);
        expect(screen.getByText('Text')).toBeInTheDocument();
      });
    });
  });

  describe('truncate', () => {
    it('renders without error when truncate is true', () => {
      render(<Typography truncate>Very long text</Typography>);
      expect(screen.getByText('Very long text')).toBeInTheDocument();
    });
  });

  describe('className forwarding', () => {
    it('merges custom className', () => {
      render(<Typography className="my-text">Text</Typography>);
      expect(screen.getByText('Text')).toHaveClass('my-text');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations for body text', async () => {
      const { container } = render(<Typography>Simple paragraph</Typography>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for heading', async () => {
      const { container } = render(<Typography variant="h1">Page title</Typography>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('convenience components', () => {
    it('H1 renders an h1', () => {
      render(<H1>Heading 1</H1>);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
    });

    it('H2 renders an h2', () => {
      render(<H2>Heading 2</H2>);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
    });

    it('H3 renders an h3', () => {
      render(<H3>Heading 3</H3>);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3');
    });

    it('H4 renders an h4', () => {
      render(<H4>Heading 4</H4>);
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Heading 4');
    });

    it('H5 renders an h5', () => {
      render(<H5>Heading 5</H5>);
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('Heading 5');
    });

    it('H6 renders an h6', () => {
      render(<H6>Heading 6</H6>);
      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Heading 6');
    });

    it('Text renders a paragraph', () => {
      render(<Text>Paragraph text</Text>);
      expect(screen.getByText('Paragraph text').tagName).toBe('P');
    });

    it('TextSm renders a paragraph', () => {
      render(<TextSm>Small text</TextSm>);
      expect(screen.getByText('Small text').tagName).toBe('P');
    });

    it('Caption renders a span', () => {
      render(<Caption>Caption text</Caption>);
      expect(screen.getByText('Caption text').tagName).toBe('SPAN');
    });

    it('Overline renders a span', () => {
      render(<Overline>Overline text</Overline>);
      expect(screen.getByText('Overline text').tagName).toBe('SPAN');
    });

    it('Code renders a code element', () => {
      render(<Code>npm install</Code>);
      expect(screen.getByText('npm install').tagName).toBe('CODE');
    });
  });
});
