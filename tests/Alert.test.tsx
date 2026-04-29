/**
 * Alert.test.tsx
 * Tests for the Alert component using Vitest + React Testing Library.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Alert } from '../components/Alert/Alert';
import type { AlertVariant } from '../components/Alert/Alert';

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

describe('Alert', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.getByText('Alert message')).toBeInTheDocument();
    });

    it('renders with a title', () => {
      render(<Alert title="Heads up">Some information</Alert>);
      expect(screen.getByText('Heads up')).toBeInTheDocument();
      expect(screen.getByText('Some information')).toBeInTheDocument();
    });

    it('renders default icon for each variant', () => {
      const { container } = render(<Alert variant="info">Info</Alert>);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders a custom icon when provided', () => {
      render(<Alert icon={<span data-testid="custom-icon" />}>Info</Alert>);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders no icon when icon={null}', () => {
      const { container } = render(<Alert icon={null}>Info</Alert>);
      // Only the dismiss area could have an svg; with no dismiss and no icon there should be none
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders dismiss button when onDismiss is provided', () => {
      render(<Alert onDismiss={vi.fn()}>Alert</Alert>);
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });

    it('does not render a dismiss button without onDismiss', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
    });
  });

  describe('variants', () => {
    const variants: AlertVariant[] = ['info', 'success', 'warning', 'error'];
    variants.forEach((variant) => {
      it(`renders variant="${variant}" without error`, () => {
        render(<Alert variant={variant}>Message</Alert>);
        expect(screen.getByText('Message')).toBeInTheDocument();
      });
    });
  });

  describe('ARIA roles and live regions', () => {
    it('uses role="alert" for error variant', () => {
      render(<Alert variant="error">Error message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('uses role="alert" for warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('uses role="status" for info variant', () => {
      render(<Alert variant="info">Info message</Alert>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('uses role="status" for success variant', () => {
      render(<Alert variant="success">Success message</Alert>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('sets aria-live="assertive" for error variant', () => {
      render(<Alert variant="error">Error</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    });

    it('sets aria-live="polite" for info variant', () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('dismiss interaction', () => {
    it('calls onDismiss when dismiss button is clicked', async () => {
      const onDismiss = vi.fn();
      const { user } = setup(<Alert onDismiss={onDismiss}>Alert</Alert>);
      await user.click(screen.getByRole('button', { name: /dismiss/i }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('dismiss button is keyboard-accessible', async () => {
      const onDismiss = vi.fn();
      const { user } = setup(<Alert onDismiss={onDismiss}>Alert</Alert>);
      const btn = screen.getByRole('button', { name: /dismiss/i });
      btn.focus();
      await user.keyboard('{Enter}');
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('className forwarding', () => {
    it('merges custom className', () => {
      render(<Alert className="custom-alert">Alert</Alert>);
      expect(screen.getByRole('status')).toHaveClass('custom-alert');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations for info alert', async () => {
      const { container } = render(<Alert variant="info">Information message</Alert>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for error alert with title', async () => {
      const { container } = render(
        <Alert variant="error" title="Error occurred">Something went wrong</Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for dismissible alert', async () => {
      const { container } = render(
        <Alert variant="warning" onDismiss={vi.fn()}>Warning message</Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
