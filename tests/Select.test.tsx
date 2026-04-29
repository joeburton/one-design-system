/**
 * Select.test.tsx
 * Tests for the Select component using Vitest + React Testing Library.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Select } from '../components/Select/Select';
import type { SelectItem } from '../components/Select/Select';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

const flatOptions: SelectItem[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

const groupedOptions: SelectItem[] = [
  {
    label: 'Group 1',
    options: [
      { value: 'g1a', label: 'G1 Option A' },
      { value: 'g1b', label: 'G1 Option B' },
    ],
  },
  {
    label: 'Group 2',
    options: [{ value: 'g2a', label: 'G2 Option A' }],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Select', () => {
  describe('rendering', () => {
    it('renders a select element', () => {
      render(<Select />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with a label when provided', () => {
      render(<Select label="Country" />);
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    });

    it('associates label with select via htmlFor', () => {
      render(<Select label="Country" id="country-select" />);
      const label = screen.getByText('Country');
      const select = screen.getByRole('combobox');
      expect(label).toHaveAttribute('for', 'country-select');
      expect(select).toHaveAttribute('id', 'country-select');
    });

    it('renders flat options', () => {
      render(<Select options={flatOptions} />);
      expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
    });

    it('renders a disabled option', () => {
      render(<Select options={flatOptions} />);
      expect(screen.getByRole('option', { name: 'Option C' })).toBeDisabled();
    });

    it('renders grouped options with optgroup labels', () => {
      render(<Select options={groupedOptions} />);
      expect(screen.getByRole('option', { name: 'G1 Option A' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'G2 Option A' })).toBeInTheDocument();
    });

    it('renders a placeholder option', () => {
      render(<Select placeholder="Choose…" />);
      expect(screen.getByRole('option', { name: 'Choose…' })).toBeDisabled();
    });

    it('renders children when no options prop is provided', () => {
      render(
        <Select>
          <option value="x">Child Option</option>
        </Select>
      );
      expect(screen.getByRole('option', { name: 'Child Option' })).toBeInTheDocument();
    });

    it('renders hint text', () => {
      render(<Select hint="Pick one from the list" />);
      expect(screen.getByText('Pick one from the list')).toBeInTheDocument();
    });

    it('renders error message and suppresses hint', () => {
      render(<Select hint="Normal hint" errorMessage="Selection is required" />);
      expect(screen.getByText('Selection is required')).toBeInTheDocument();
      expect(screen.queryByText('Normal hint')).not.toBeInTheDocument();
    });

    it('renders required indicator when required prop is set', () => {
      render(<Select label="Role" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('sets aria-invalid when errorMessage is present', () => {
      render(<Select errorMessage="Required" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid without an error', () => {
      render(<Select />);
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
    });

    it('links error message to select via aria-describedby', () => {
      render(<Select id="sel" errorMessage="This field is required" />);
      const select = screen.getByRole('combobox');
      const describedBy = select.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      const errorEl = document.getElementById(describedBy!.split(' ')[0]);
      expect(errorEl).toHaveTextContent('This field is required');
    });

    it('links hint text to select via aria-describedby', () => {
      render(<Select id="sel" hint="Helpful hint" />);
      const select = screen.getByRole('combobox');
      const describedBy = select.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      const hintEl = document.getElementById(describedBy!);
      expect(hintEl).toHaveTextContent('Helpful hint');
    });

    it('has no axe violations with label', async () => {
      const { container } = render(
        <Select label="Country" options={flatOptions} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with error state', async () => {
      const { container } = render(
        <Select label="Country" errorMessage="Required" options={flatOptions} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Select disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('renders size="%s" without error', (size) => {
      render(<Select size={size} options={flatOptions} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('className forwarding', () => {
    it('merges custom className with root element', () => {
      const { container } = render(<Select className="my-class" />);
      expect(container.firstChild).toHaveClass('my-class');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the select element', () => {
      const ref = { current: null as HTMLSelectElement | null };
      render(<Select ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  describe('interactions', () => {
    it('fires onChange when selection changes', async () => {
      const onChange = vi.fn();
      const { user } = setup(
        <Select options={flatOptions} onChange={onChange} />
      );
      await user.selectOptions(screen.getByRole('combobox'), 'a');
      expect(onChange).toHaveBeenCalled();
    });
  });
});
