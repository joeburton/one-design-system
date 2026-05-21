import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Radio, RadioGroup } from '../components/Radio/Radio';

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

describe('Radio', () => {
  describe('rendering', () => {
    it('renders a radio button', () => {
      render(<Radio value="a" name="test" />);
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('renders with a label', () => {
      render(<Radio value="a" name="test" label="Option A" />);
      expect(screen.getByLabelText(/option a/i)).toBeInTheDocument();
    });

    it('renders hint text', () => {
      render(<Radio value="a" name="test" hint="Best for most users." />);
      expect(screen.getByText('Best for most users.')).toBeInTheDocument();
    });

    it('renders error message and suppresses hint', () => {
      render(<Radio value="a" name="test" hint="Normal hint" error="Please select an option." />);
      expect(screen.getByText('Please select an option.')).toBeInTheDocument();
      expect(screen.queryByText('Normal hint')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('sets aria-invalid when error is present', () => {
      render(<Radio value="a" name="test" error="Required" />);
      expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid without an error', () => {
      render(<Radio value="a" name="test" />);
      expect(screen.getByRole('radio')).not.toHaveAttribute('aria-invalid');
    });

    it('links error message via aria-describedby', () => {
      render(<Radio id="r" value="a" name="test" error="This is an error." />);
      const radio = screen.getByRole('radio');
      const describedById = radio.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();
      expect(document.getElementById(describedById!)).toHaveTextContent('This is an error.');
    });

    it('has no axe violations', async () => {
      const { container } = render(<Radio value="a" name="test" label="Option A" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('is disabled when disabled prop is set', () => {
      render(<Radio value="a" name="test" disabled />);
      expect(screen.getByRole('radio')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onChange when selected', async () => {
      const onChange = vi.fn();
      const { user } = setup(<Radio value="a" name="test" label="Option A" onChange={onChange} />);
      await user.click(screen.getByRole('radio'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('does not call onChange when disabled', async () => {
      const onChange = vi.fn();
      const { user } = setup(
        <Radio value="a" name="test" label="Option A" disabled onChange={onChange} />
      );
      await user.click(screen.getByRole('radio'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

describe('RadioGroup', () => {
  describe('rendering', () => {
    it('renders with role="radiogroup"', () => {
      render(
        <RadioGroup name="g">
          <Radio value="a" label="A" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders a label linked via aria-labelledby', () => {
      render(
        <RadioGroup name="g" label="Choose one">
          <Radio value="a" label="A" />
        </RadioGroup>
      );
      const group = screen.getByRole('radiogroup');
      const labelledById = group.getAttribute('aria-labelledby');
      expect(labelledById).toBeTruthy();
      expect(document.getElementById(labelledById!)).toHaveTextContent('Choose one');
    });

    it('does not set aria-labelledby without a label', () => {
      render(
        <RadioGroup name="g">
          <Radio value="a" label="A" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-labelledby');
    });

    it('renders all child radios', () => {
      render(
        <RadioGroup name="g">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
          <Radio value="c" label="C" />
        </RadioGroup>
      );
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });
  });

  describe('controlled selection', () => {
    it('reflects controlled value', () => {
      render(
        <RadioGroup name="g" value="b">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
          <Radio value="c" label="C" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it('calls onChange with the selected value', async () => {
      const onChange = vi.fn();
      const { user } = setup(
        <RadioGroup name="g" value="a" onChange={onChange}>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      );
      await user.click(screen.getByLabelText('B'));
      expect(onChange).toHaveBeenCalledWith('b');
    });
  });

  describe('disabled group', () => {
    it('disables all child radios when group is disabled', () => {
      render(
        <RadioGroup name="g" disabled>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      );
      screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus with arrow keys and selects within a group', async () => {
      const { user } = setup(
        <RadioGroup name="g">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
          <Radio value="c" label="C" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');

      await user.tab();
      expect(radios[0]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(radios[1]).toHaveFocus();
      expect(radios[1]).toBeChecked();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <RadioGroup name="g" label="Choose a plan">
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
