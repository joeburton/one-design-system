import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Checkbox } from '../components/Checkbox/Checkbox';

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders a checkbox', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with a label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText(/accept terms/i)).toBeInTheDocument();
    });

    it('renders hint text', () => {
      render(<Checkbox hint="You can change this later." />);
      expect(screen.getByText('You can change this later.')).toBeInTheDocument();
    });

    it('renders error message and suppresses hint', () => {
      render(<Checkbox hint="Normal hint" error="This is required." />);
      expect(screen.getByText('This is required.')).toBeInTheDocument();
      expect(screen.queryByText('Normal hint')).not.toBeInTheDocument();
    });

    it('renders as checked when defaultChecked is set', () => {
      render(<Checkbox defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('indeterminate', () => {
    it('sets aria-checked="mixed" when indeterminate', () => {
      render(<Checkbox indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });

    it('does not set aria-checked when not indeterminate', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-checked');
    });
  });

  describe('accessibility', () => {
    it('sets aria-invalid when error is present', () => {
      render(<Checkbox error="Required" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid without an error', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
    });

    it('links error message via aria-describedby', () => {
      render(<Checkbox id="cb" error="This is an error." />);
      const cb = screen.getByRole('checkbox');
      const describedById = cb.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();
      expect(document.getElementById(describedById!)).toHaveTextContent('This is an error.');
    });

    it('has no axe violations', async () => {
      const { container } = render(<Checkbox label="Accept terms" hint="Required to proceed." />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations in error state', async () => {
      const { container } = render(
        <Checkbox label="Accept terms" error="You must accept to continue." />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('interactions', () => {
    it('toggles on click', async () => {
      const { user } = setup(<Checkbox label="Toggle me" />);
      const cb = screen.getByRole('checkbox');
      expect(cb).not.toBeChecked();
      await user.click(screen.getByText('Toggle me'));
      expect(cb).toBeChecked();
    });

    it('toggles with Space key', async () => {
      const { user } = setup(<Checkbox label="Toggle me" />);
      const cb = screen.getByRole('checkbox');
      await user.tab();
      expect(cb).toHaveFocus();
      await user.keyboard(' ');
      expect(cb).toBeChecked();
    });

    it('calls onChange when toggled', async () => {
      const onChange = vi.fn();
      const { user } = setup(<Checkbox label="Toggle" onChange={onChange} />);
      await user.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is set', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not toggle when disabled', async () => {
      const onChange = vi.fn();
      const { user } = setup(<Checkbox disabled onChange={onChange} />);
      await user.click(screen.getByRole('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
