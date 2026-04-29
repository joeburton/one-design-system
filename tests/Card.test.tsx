/**
 * Card.test.tsx
 * Tests for the Card component and its sub-components.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card/Card';
import type { CardElevation, CardPadding } from '../components/Card/Card';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  describe('elevation variants', () => {
    const elevations: CardElevation[] = ['none', 'xs', 'sm', 'md', 'lg'];
    elevations.forEach((elevation) => {
      it(`renders elevation="${elevation}" without error`, () => {
        render(<Card elevation={elevation}>Content</Card>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('padding variants', () => {
    const paddings: CardPadding[] = ['none', 'sm', 'md', 'lg', 'xl'];
    paddings.forEach((padding) => {
      it(`renders padding="${padding}" without error`, () => {
        render(<Card padding={padding}>Content</Card>);
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('bordered', () => {
    it('renders without error when bordered is true', () => {
      render(<Card bordered>Content</Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('interactive', () => {
    it('is keyboard-focusable when interactive is true', () => {
      const { container } = render(<Card interactive>Interactive card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('is not keyboard-focusable when interactive is false', () => {
      const { container } = render(<Card>Static card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute('tabindex');
    });

    it('can receive focus via keyboard when interactive', async () => {
      const user = userEvent.setup();
      const { container } = render(<Card interactive>Interactive card</Card>);
      const card = container.firstChild as HTMLElement;
      await user.tab();
      expect(card).toHaveFocus();
    });

    it('allows tabIndex override via props', () => {
      const { container } = render(<Card interactive tabIndex={-1}>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('className forwarding', () => {
    it('merges custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>);
      expect(container.firstChild).toHaveClass('custom-card');
    });
  });

  describe('sub-components via static properties', () => {
    it('Card.Header renders children', () => {
      render(<Card><Card.Header>Header</Card.Header></Card>);
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('Card.Body renders children', () => {
      render(<Card><Card.Body>Body</Card.Body></Card>);
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('Card.Footer renders children', () => {
      render(<Card><Card.Footer>Footer</Card.Footer></Card>);
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('renders a full card with Header, Body, Footer', () => {
      render(
        <Card>
          <Card.Header>Title</Card.Header>
          <Card.Body>Main content</Card.Body>
          <Card.Footer>Actions</Card.Footer>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('named sub-component exports', () => {
    it('CardHeader renders independently', () => {
      render(<CardHeader>Header</CardHeader>);
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('CardBody renders independently', () => {
      render(<CardBody>Body</CardBody>);
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('CardFooter renders independently', () => {
      render(<CardFooter>Footer</CardFooter>);
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations for a basic card', async () => {
      const { container } = render(<Card>Card content</Card>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for an interactive card', async () => {
      const { container } = render(<Card interactive aria-label="View profile">Card content</Card>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for a structured card', async () => {
      const { container } = render(
        <Card>
          <Card.Header>Card title</Card.Header>
          <Card.Body>Card body content goes here.</Card.Body>
          <Card.Footer>Footer actions</Card.Footer>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
