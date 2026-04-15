import type { Meta, StoryFn } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Accordion>;

export default meta;

export const Default: StoryFn<typeof Accordion> = () => (
  <Accordion>
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute. No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const DefaultOpenItem: StoryFn<typeof Accordion> = () => (
  <Accordion defaultOpen="item-2">
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute. No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const AllowMultiple: StoryFn<typeof Accordion> = () => (
  <Accordion allowMultiple defaultOpen={['item-1', 'item-3']}>
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute. No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const Outlined: StoryFn<typeof Accordion> = () => (
  <Accordion variant="outlined">
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute. No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const Flush: StoryFn<typeof Accordion> = () => (
  <Accordion variant="flush">
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute. No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const WithDisabledItem: StoryFn<typeof Accordion> = () => (
  <Accordion>
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="This item is disabled" disabled>
      This content is not accessible when the item is disabled.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute. No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);
