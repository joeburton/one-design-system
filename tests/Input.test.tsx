/**
 * Input.test.tsx
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../components/Input/Input';

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

describe('Input', () => {
  describe('rendering', () => {
    it('renders an input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with a label when provided', () => {
      render(<Input label="Email address" />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('associates label with input via htmlFor', () => {
      render(<Input label="Username" id="username" />);
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('renders hint text', () => {
      render(<Input hint="Must be at least 8 characters" />);
      expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    });

    it('renders error message and suppresses hint', () => {
      render(
        <Input
          hint="Normal hint"
          errorMessage="This field is required"
        />
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.queryByText('Normal hint')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('sets aria-invalid when errorMessage is present', () => {
      render(<Input errorMessage="Required" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid without an error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('links error message to input via aria-describedby', () => {
      render(<Input id="test-input" errorMessage="This is an error" />);
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      const errorEl = document.getElementById(errorId!);
      expect(errorEl).toHaveTextContent('This is an error');
    });

    it('shows required indicator when required prop is set', () => {
      render(<Input label="Name" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('accepts typed input', async () => {
      const { user } = setup(<Input />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'hello world');
      expect(input).toHaveValue('hello world');
    });

    it('is disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });
});
