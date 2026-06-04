import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from '../components/Modal/Modal';

function ControlledModal(props: Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Test dialog"
        {...props}
      >
        <button>First</button>
        <button>Second</button>
        <button>Last</button>
      </Modal>
    </>
  );
}

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

describe('Modal', () => {
  describe('rendering', () => {
    it('does not render dialog when closed', () => {
      render(<Modal open={false} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when open', () => {
      render(<Modal open={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders the title', () => {
      render(<Modal open={true} onClose={vi.fn()} title="My Dialog"><p>Body</p></Modal>);
      expect(screen.getByText('My Dialog')).toBeInTheDocument();
    });

    it('renders children in the body', () => {
      render(<Modal open={true} onClose={vi.fn()} title="Test"><p>Dialog content</p></Modal>);
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });

    it('renders into document.body as a portal, not inside the render container', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>
      );
      // The render container div should be empty — dialog is portalled to document.body
      expect(container.querySelector('[role="dialog"]')).toBeNull();
      expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    it('unmounts from DOM when closed after being open', async () => {
      const { user } = setup(<ControlledModal />);
      await user.click(screen.getByRole('button', { name: /open/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /close dialog/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });
  });

  describe('ARIA attributes', () => {
    it('has role="dialog"', () => {
      render(<Modal open={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      render(<Modal open={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby pointing to the title', () => {
      render(<Modal open={true} onClose={vi.fn()} title="My Dialog"><p>Body</p></Modal>);
      const dialog = screen.getByRole('dialog');
      const labelId = dialog.getAttribute('aria-labelledby')!;
      expect(document.getElementById(labelId)).toHaveTextContent('My Dialog');
    });

    it('has a close button with accessible label', () => {
      render(<Modal open={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });
  });

  describe('close behaviour', () => {
    it('calls onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      const { user } = setup(
        <Modal open={true} onClose={onClose} title="Test"><p>Body</p></Modal>
      );
      await user.click(screen.getByRole('button', { name: /close dialog/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape is pressed', async () => {
      const onClose = vi.fn();
      const { user } = setup(
        <Modal open={true} onClose={onClose} title="Test"><p>Body</p></Modal>
      );
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on Escape when closeOnEscape=false', async () => {
      const onClose = vi.fn();
      const { user } = setup(
        <Modal open={true} onClose={onClose} title="Test" closeOnEscape={false}>
          <p>Body</p>
        </Modal>
      );
      await user.keyboard('{Escape}');
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', async () => {
      const onClose = vi.fn();
      render(<Modal open={true} onClose={onClose} title="Test"><p>Body</p></Modal>);
      const overlay = document.body.querySelector('[class*="overlay"]') as HTMLElement;
      overlay.click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on backdrop click when closeOnBackdropClick=false', async () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose} title="Test" closeOnBackdropClick={false}>
          <p>Body</p>
        </Modal>
      );
      const overlay = document.body.querySelector('[class*="overlay"]') as HTMLElement;
      overlay.click();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('focus management', () => {
    it('focuses the first focusable element on open', async () => {
      const { user } = setup(<ControlledModal />);
      await user.click(screen.getByRole('button', { name: /open/i }));
      // First focusable element inside the dialog is the close button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close dialog/i })).toHaveFocus();
      });
    });

    it('returns focus to trigger element on close', async () => {
      const { user } = setup(<ControlledModal />);
      const trigger = screen.getByRole('button', { name: /open/i });
      await user.click(trigger);
      await user.click(screen.getByRole('button', { name: /close dialog/i }));
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      }, { timeout: 500 });
    });

    it('traps focus: Tab wraps from last to first element', async () => {
      const { user } = setup(<ControlledModal />);
      await user.click(screen.getByRole('button', { name: /open/i }));

      // Tab through all focusable elements to reach the last one
      const closeBtn = screen.getByRole('button', { name: /close dialog/i });
      await waitFor(() => expect(closeBtn).toHaveFocus());

      // Tab past First, Second, Last buttons
      await user.tab(); // → First
      await user.tab(); // → Second
      await user.tab(); // → Last
      // Tab again should wrap back to close button (first focusable)
      await user.tab();
      expect(closeBtn).toHaveFocus();
    });

    it('traps focus: Shift+Tab wraps from first to last element', async () => {
      const { user } = setup(<ControlledModal />);
      await user.click(screen.getByRole('button', { name: /open/i }));

      const closeBtn = screen.getByRole('button', { name: /close dialog/i });
      await waitFor(() => expect(closeBtn).toHaveFocus());

      // Shift+Tab from first element should wrap to last
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: /last/i })).toHaveFocus();
    });
  });

  describe('scroll lock', () => {
    it('sets overflow:hidden on body when open', () => {
      render(<Modal open={true} onClose={vi.fn()} title="Test"><p>Body</p></Modal>);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body overflow when closed', async () => {
      const { user } = setup(<ControlledModal />);
      await user.click(screen.getByRole('button', { name: /open/i }));
      expect(document.body.style.overflow).toBe('hidden');
      await user.click(screen.getByRole('button', { name: /close dialog/i }));
      await waitFor(() => {
        expect(document.body.style.overflow).not.toBe('hidden');
      }, { timeout: 500 });
    });
  });
});
