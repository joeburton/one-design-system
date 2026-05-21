import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Spinner } from '../components/Spinner/Spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('renders with role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders the default label text for screen readers', () => {
      render(<Spinner />);
      expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    it('renders a custom label', () => {
      render(<Spinner label="Saving changes…" />);
      expect(screen.getByText('Saving changes…')).toBeInTheDocument();
    });

    it('forwards className', () => {
      render(<Spinner className="custom" />);
      expect(screen.getByRole('status')).toHaveClass('custom');
    });

    it('forwards arbitrary HTML attributes', () => {
      render(<Spinner data-testid="my-spinner" />);
      expect(screen.getByTestId('my-spinner')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies size-sm class', () => {
      render(<Spinner size="sm" />);
      expect(screen.getByRole('status').className).toMatch(/size-sm/);
    });

    it('applies size-md class by default', () => {
      render(<Spinner />);
      expect(screen.getByRole('status').className).toMatch(/size-md/);
    });

    it('applies size-lg class', () => {
      render(<Spinner size="lg" />);
      expect(screen.getByRole('status').className).toMatch(/size-lg/);
    });
  });

  describe('accessibility', () => {
    it('has no axe violations with default label', async () => {
      const { container } = render(<Spinner />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations with custom label', async () => {
      const { container } = render(<Spinner label="Fetching results…" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
