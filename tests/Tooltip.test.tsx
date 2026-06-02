import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../components/Tooltip/Tooltip';

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup({ delay: null }),
  ...render(jsx),
});

describe('Tooltip', () => {
  describe('rendering', () => {
    it('renders the trigger child', () => {
      render(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      expect(screen.getByRole('button', { name: /trigger/i })).toBeInTheDocument();
    });

    it('renders tooltip with role="tooltip"', () => {
      render(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    });

    it('tooltip is hidden by default', () => {
      render(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('hover interactions', () => {
    it('shows tooltip on mouse enter', async () => {
      const { user } = setup(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');
      await user.hover(trigger);
      expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
    });

    it('hides tooltip on mouse leave', async () => {
      const { user } = setup(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');
      await user.hover(trigger);
      await user.unhover(trigger);
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('keyboard interactions', () => {
    it('shows tooltip on focus', async () => {
      const { user } = setup(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      await user.tab();
      expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
    });

    it('hides tooltip on blur', async () => {
      const { user } = setup(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      await user.tab();
      await user.tab();
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });

    it('sets aria-describedby on trigger when visible', async () => {
      const { user } = setup(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      await user.tab();
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-describedby');
      const id = trigger.getAttribute('aria-describedby')!;
      expect(document.getElementById(id)).toHaveTextContent('Help text');
    });

    it('removes aria-describedby from trigger when hidden', () => {
      render(
        <Tooltip content="Help text">
          <button>Trigger</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');
      expect(trigger).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('delay', () => {
    it('does not show tooltip immediately when delay is set', () => {
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip content="Delayed" delay={300}>
          <button>Trigger</button>
        </Tooltip>
      );
      const wrapper = container.firstChild as HTMLElement;
      act(() => { fireEvent.mouseEnter(wrapper); });
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
      vi.useRealTimers();
    });

    it('shows tooltip after delay elapses', () => {
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip content="Delayed" delay={300}>
          <button>Trigger</button>
        </Tooltip>
      );
      const wrapper = container.firstChild as HTMLElement;
      act(() => { fireEvent.mouseEnter(wrapper); });
      act(() => { vi.advanceTimersByTime(300); });
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'false');
      vi.useRealTimers();
    });
  });
});
