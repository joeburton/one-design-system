import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../components/Textarea/Textarea';

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

describe('Textarea', () => {
  describe('rendering', () => {
    it('renders a textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with a label when provided', () => {
      render(<Textarea label="Description" />);
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('associates label with textarea via htmlFor', () => {
      render(<Textarea label="Bio" id="bio" />);
      const label = screen.getByText('Bio');
      const textarea = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'bio');
      expect(textarea).toHaveAttribute('id', 'bio');
    });

    it('renders hint text', () => {
      render(<Textarea hint="Up to 500 characters" />);
      expect(screen.getByText('Up to 500 characters')).toBeInTheDocument();
    });

    it('renders error message and suppresses hint', () => {
      render(<Textarea hint="Normal hint" errorMessage="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.queryByText('Normal hint')).not.toBeInTheDocument();
    });

    it('shows required indicator when required prop is set', () => {
      render(<Textarea label="Name" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('sets aria-invalid when errorMessage is present', () => {
      render(<Textarea errorMessage="Required" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid without an error', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('links error message to textarea via aria-describedby', () => {
      render(<Textarea id="test-ta" errorMessage="This is an error" />);
      const textarea = screen.getByRole('textbox');
      const errorId = textarea.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      const errorEl = document.getElementById(errorId!);
      expect(errorEl).toHaveTextContent('This is an error');
    });

    it('links hint to textarea via aria-describedby', () => {
      render(<Textarea id="test-ta" hint="Helpful hint" />);
      const textarea = screen.getByRole('textbox');
      const hintId = textarea.getAttribute('aria-describedby');
      expect(hintId).toBeTruthy();
      const hintEl = document.getElementById(hintId!);
      expect(hintEl).toHaveTextContent('Helpful hint');
    });
  });

  describe('interactions', () => {
    it('accepts typed input', async () => {
      const { user } = setup(<Textarea />);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'hello world');
      expect(textarea).toHaveValue('hello world');
    });

    it('is disabled when disabled prop is true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('is read-only when readOnly prop is true', () => {
      render(<Textarea readOnly defaultValue="read only" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('calls onInput handler when content changes', () => {
      const onInput = vi.fn();
      render(<Textarea onInput={onInput} />);
      fireEvent.input(screen.getByRole('textbox'), { target: { value: 'new text' } });
      expect(onInput).toHaveBeenCalledTimes(1);
    });
  });

  describe('auto-resize', () => {
    it('sets resize to none on the textarea when autoResize is enabled', () => {
      render(<Textarea autoResize />);
      const textarea = screen.getByRole('textbox');
      const wrapper = textarea.parentElement!;
      // The wrapper should have a class that sets resize: none
      expect(wrapper.className).toMatch(/resize-none/);
    });
  });
});
