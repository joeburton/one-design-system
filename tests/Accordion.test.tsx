/**
 * Accordion.test.tsx
 * Tests for the Accordion component using Vitest + React Testing Library.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Accordion, AccordionItem } from '../components/Accordion/Accordion';
import type { AccordionVariant } from '../components/Accordion/Accordion';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

function BasicAccordion({
  allowMultiple = false,
  defaultOpen,
}: {
  allowMultiple?: boolean;
  defaultOpen?: string | string[];
}) {
  return (
    <Accordion allowMultiple={allowMultiple} defaultOpen={defaultOpen}>
      <Accordion.Item id="item-1" title="Section 1">Content 1</Accordion.Item>
      <Accordion.Item id="item-2" title="Section 2">Content 2</Accordion.Item>
      <Accordion.Item id="item-3" title="Section 3" disabled>Content 3</Accordion.Item>
    </Accordion>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Accordion', () => {
  describe('rendering', () => {
    it('renders accordion items', () => {
      render(<BasicAccordion />);
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Section 3')).toBeInTheDocument();
    });

    it('panel content is in the DOM but collapsed by default', () => {
      render(<BasicAccordion />);
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    const variants: AccordionVariant[] = ['default', 'outlined', 'flush'];
    variants.forEach((variant) => {
      it(`renders variant="${variant}" without error`, () => {
        render(
          <Accordion variant={variant}>
            <Accordion.Item title="Item">Content</Accordion.Item>
          </Accordion>
        );
        expect(screen.getByText('Item')).toBeInTheDocument();
      });
    });
  });

  describe('toggle behaviour', () => {
    it('expands an item when its trigger is clicked', async () => {
      const { user } = setup(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses an open item when clicked again', async () => {
      const { user } = setup(<BasicAccordion defaultOpen="item-1" />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes others when allowMultiple is false', async () => {
      const { user } = setup(<BasicAccordion defaultOpen="item-1" />);
      const trigger1 = screen.getByRole('button', { name: /section 1/i });
      const trigger2 = screen.getByRole('button', { name: /section 2/i });

      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      await user.click(trigger2);
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });

    it('keeps others open when allowMultiple is true', async () => {
      const { user } = setup(<BasicAccordion allowMultiple defaultOpen="item-1" />);
      const trigger1 = screen.getByRole('button', { name: /section 1/i });
      const trigger2 = screen.getByRole('button', { name: /section 2/i });

      await user.click(trigger2);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('defaultOpen', () => {
    it('opens a single item by id', () => {
      render(<BasicAccordion defaultOpen="item-2" />);
      expect(screen.getByRole('button', { name: /section 2/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('opens multiple items by id array when allowMultiple', () => {
      render(<BasicAccordion allowMultiple defaultOpen={['item-1', 'item-2']} />);
      expect(screen.getByRole('button', { name: /section 1/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      expect(screen.getByRole('button', { name: /section 2/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });
  });

  describe('disabled item', () => {
    it('renders a disabled trigger', () => {
      render(<BasicAccordion />);
      expect(screen.getByRole('button', { name: /section 3/i })).toBeDisabled();
    });

    it('does not toggle when disabled trigger is clicked', async () => {
      const { user } = setup(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 3/i });
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('keyboard interaction', () => {
    it('trigger is focusable via tab', async () => {
      const { user } = setup(<BasicAccordion />);
      await user.tab();
      expect(screen.getByRole('button', { name: /section 1/i })).toHaveFocus();
    });

    it('activates trigger on Enter key', async () => {
      const { user } = setup(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      trigger.focus();
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('activates trigger on Space key', async () => {
      const { user } = setup(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      trigger.focus();
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('ARIA attributes', () => {
    it('trigger has aria-controls pointing to its panel', () => {
      render(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      const panelId = trigger.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      const panel = document.getElementById(panelId!);
      expect(panel).toBeInTheDocument();
    });

    it('panel has role="region"', () => {
      render(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId!);
      expect(panel).toHaveAttribute('role', 'region');
    });

    it('panel is labelled by its trigger', () => {
      render(<BasicAccordion />);
      const trigger = screen.getByRole('button', { name: /section 1/i });
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId!);
      expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    });
  });

  describe('AccordionItem standalone usage', () => {
    it('throws when used outside Accordion', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        render(<AccordionItem title="Item">Content</AccordionItem>)
      ).toThrow('Accordion.Item must be used within Accordion');
      spy.mockRestore();
    });
  });

  describe('className forwarding', () => {
    it('merges custom className on root', () => {
      const { container } = render(
        <Accordion className="custom-accordion">
          <Accordion.Item title="Item">Content</Accordion.Item>
        </Accordion>
      );
      expect(container.firstChild).toHaveClass('custom-accordion');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations in collapsed state', async () => {
      const { container } = render(<BasicAccordion />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when items are open', async () => {
      const { container } = render(<BasicAccordion defaultOpen={['item-1', 'item-2']} allowMultiple />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
