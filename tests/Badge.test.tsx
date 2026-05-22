import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from '../components/Badge/Badge';
import type { BadgeVariant } from '../components/Badge/Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders as a span element', () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstChild?.nodeName).toBe('SPAN');
    });

    it('forwards className', () => {
      const { container } = render(<Badge className="custom">Label</Badge>);
      expect(container.firstChild).toHaveClass('custom');
    });

    it('forwards arbitrary HTML attributes', () => {
      render(<Badge data-testid="my-badge">Label</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    const variants: BadgeVariant[] = ['default', 'info', 'success', 'warning', 'error'];

    variants.forEach((variant) => {
      it(`renders variant="${variant}" without error`, () => {
        render(<Badge variant={variant}>{variant}</Badge>);
        expect(screen.getByText(variant)).toBeInTheDocument();
      });

      it(`applies variant class for "${variant}"`, () => {
        const { container } = render(<Badge variant={variant}>Label</Badge>);
        expect((container.firstChild as HTMLElement).className).toMatch(
          new RegExp(`variant-${variant}`)
        );
      });
    });
  });

  describe('sizes', () => {
    it('applies size-sm class', () => {
      const { container } = render(<Badge size="sm">Small</Badge>);
      expect((container.firstChild as HTMLElement).className).toMatch(/size-sm/);
    });

    it('applies size-md class by default', () => {
      const { container } = render(<Badge>Medium</Badge>);
      expect((container.firstChild as HTMLElement).className).toMatch(/size-md/);
    });
  });

  describe('dot mode', () => {
    it('does not render children when dot is true', () => {
      render(<Badge dot>Should not appear</Badge>);
      expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
    });

    it('applies dot class', () => {
      const { container } = render(<Badge dot />);
      expect((container.firstChild as HTMLElement).className).toMatch(/dot/);
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Badge variant="success">Passing</Badge>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations for a decorative dot badge', async () => {
      // Dot badges are decorative; mark aria-hidden and let the surrounding context carry meaning
      const { container } = render(<Badge dot variant="error" aria-hidden="true" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
