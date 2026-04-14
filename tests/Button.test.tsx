/**
 * Button.test.tsx
 * Tests for the Button component using Vitest + React Testing Library.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/Button/Button';
import type { ButtonVariant, ButtonSize } from '../components/Button/Button';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Button', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute('type', 'button');
    });

    it('renders children correctly', () => {
      render(<Button>Save changes</Button>);
      expect(screen.getByText('Save changes')).toBeInTheDocument();
    });

    it('applies default type="button" to avoid form submission', () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('allows overriding type to submit', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('variants', () => {
    const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'success'];

    variants.forEach((variant) => {
      it(`renders variant="${variant}" without error`, () => {
        render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('sizes', () => {
    const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    sizes.forEach((size) => {
      it(`renders size="${size}" without error`, () => {
        render(<Button size={size}>{size}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
    });

    it('sets aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not fire onClick when disabled', async () => {
      const onClick = vi.fn();
      const { user } = setup(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('shows aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('is disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders a spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      // Spinner is aria-hidden so we query by DOM
      const btn = screen.getByRole('button');
      expect(btn.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      const { user } = setup(<Button onClick={onClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is focusable via keyboard', async () => {
      const { user } = setup(<Button>Focus me</Button>);
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('triggers click on Enter key', async () => {
      const onClick = vi.fn();
      const { user } = setup(<Button onClick={onClick}>Press Enter</Button>);
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key', async () => {
      const onClick = vi.fn();
      const { user } = setup(<Button onClick={onClick}>Press Space</Button>);
      screen.getByRole('button').focus();
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('icon-only', () => {
    it('visually hides label text when iconOnly is true', () => {
      render(
        <Button iconOnly aria-label="Search">
          Search
        </Button>
      );
      // The button should be accessible via aria-label
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });
  });

  describe('fullWidth', () => {
    it('renders without crashing when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('className forwarding', () => {
    it('merges custom className with component classes', () => {
      render(<Button className="my-custom-class">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('my-custom-class');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the button element', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<Button ref={ref}>Ref Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
