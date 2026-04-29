/**
 * Icon.test.tsx
 * Tests for the Icon component and NamedIcon convenience component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Icon, NamedIcon, icons } from '../components/Icon/Icon';
import type { IconSize, IconColor, IconName } from '../components/Icon/Icon';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CheckPath = () => (
  <path
    fillRule="evenodd"
    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
    clipRule="evenodd"
  />
);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Icon', () => {
  describe('decorative (no label)', () => {
    it('renders an SVG element', () => {
      const { container } = render(
        <Icon>
          <CheckPath />
        </Icon>
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('is aria-hidden when no label is provided', () => {
      const { container } = render(
        <Icon>
          <CheckPath />
        </Icon>
      );
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not have role="img" when decorative', () => {
      const { container } = render(
        <Icon>
          <CheckPath />
        </Icon>
      );
      expect(container.querySelector('svg')).not.toHaveAttribute('role');
    });

    it('is not focusable (focusable="false")', () => {
      const { container } = render(
        <Icon>
          <CheckPath />
        </Icon>
      );
      expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
    });
  });

  describe('semantic (with label)', () => {
    it('has role="img" when a label is provided', () => {
      render(
        <Icon label="Checkmark">
          <CheckPath />
        </Icon>
      );
      expect(screen.getByRole('img', { name: 'Checkmark' })).toBeInTheDocument();
    });

    it('sets aria-label to the provided label', () => {
      render(
        <Icon label="Success">
          <CheckPath />
        </Icon>
      );
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Success');
    });

    it('is not aria-hidden when a label is provided', () => {
      render(
        <Icon label="Success">
          <CheckPath />
        </Icon>
      );
      expect(screen.getByRole('img')).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('sizes', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    sizes.forEach((size) => {
      it(`renders size="${size}" without error`, () => {
        const { container } = render(
          <Icon size={size}>
            <CheckPath />
          </Icon>
        );
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('colors', () => {
    const colors: IconColor[] = [
      'inherit',
      'default',
      'subtle',
      'muted',
      'primary',
      'success',
      'warning',
      'error',
      'info',
    ];
    colors.forEach((color) => {
      it(`renders color="${color}" without error`, () => {
        const { container } = render(
          <Icon color={color}>
            <CheckPath />
          </Icon>
        );
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('className forwarding', () => {
    it('merges custom className', () => {
      const { container } = render(
        <Icon className="my-icon">
          <CheckPath />
        </Icon>
      );
      expect(container.querySelector('svg')).toHaveClass('my-icon');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations for a decorative icon', async () => {
      const { container } = render(
        <span>
          <Icon aria-hidden="true">
            <CheckPath />
          </Icon>
          Completed
        </span>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for a semantic icon', async () => {
      const { container } = render(
        <Icon label="Checkmark">
          <CheckPath />
        </Icon>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('NamedIcon', () => {
  const iconNames = Object.keys(icons) as IconName[];

  describe('rendering', () => {
    iconNames.forEach((name) => {
      it(`renders icon "${name}" without error`, () => {
        const { container } = render(<NamedIcon name={name} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  it('passes label through to Icon', () => {
    render(<NamedIcon name="check" label="Completed" />);
    expect(screen.getByRole('img', { name: 'Completed' })).toBeInTheDocument();
  });

  it('passes size through to Icon', () => {
    const { container } = render(<NamedIcon name="search" size="lg" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<NamedIcon name="info" label="Information" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
