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
      A design system is a collection of reusable components, guided by clear standards, that can be
      assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to
      maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute.
      No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const DefaultOpenItem: StoryFn<typeof Accordion> = () => (
  <Accordion defaultOpen="item-2">
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be
      assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to
      maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute.
      No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const AllowMultiple: StoryFn<typeof Accordion> = () => (
  <Accordion allowMultiple defaultOpen={['item-1', 'item-3']}>
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be
      assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to
      maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute.
      No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const Outlined: StoryFn<typeof Accordion> = () => (
  <Accordion variant="outlined">
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be
      assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to
      maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute.
      No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const Flush: StoryFn<typeof Accordion> = () => (
  <Accordion variant="flush">
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be
      assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Why use design tokens?">
      Design tokens are the single source of truth for your design decisions. They allow you to
      maintain consistency across platforms and make global changes easily.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute.
      No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

export const WithDisabledItem: StoryFn<typeof Accordion> = () => (
  <Accordion>
    <Accordion.Item id="item-1" title="What is a design system?">
      A design system is a collection of reusable components, guided by clear standards, that can be
      assembled to build any number of applications.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="This item is disabled" disabled>
      This content is not accessible when the item is disabled.
    </Accordion.Item>
    <Accordion.Item id="item-3" title="How do themes work?">
      Themes are implemented via CSS variable overrides using the <code>data-theme</code> attribute.
      No component-level theme logic is needed.
    </Accordion.Item>
  </Accordion>
);

/**
 * Verifies that a long unbreakable title wraps correctly inside the trigger
 * rather than overflowing. Reproduces the `min-width: 0` flex bug on `.triggerLabel`.
 */
export const LongTitleText: StoryFn<typeof Accordion> = () => (
  <Accordion>
    <Accordion.Item
      id="item-1"
      title="https://github.com/joeburton/one-design-system/issues/19?tab=comments&sort=asc&direction=desc"
    >
      This item has a trigger title containing a long URL with no natural break points — it should
      wrap inside the trigger without overflowing or pushing the chevron off-screen.
    </Accordion.Item>
    <Accordion.Item
      id="item-2"
      title="AnExtremelyLongCamelCaseWordThatHasNoSpacesOrHyphensAndShouldStillWrapCorrectlyInsideTheTriggerButton"
    >
      This item has a long compound word as its title — it should wrap rather than overflow.
    </Accordion.Item>
  </Accordion>
);

/**
 * Verifies that the trigger label handles `ReactNode` titles correctly —
 * inline elements such as `<code>` or `<strong>` should wrap and not overflow.
 */
export const RichTitleContent: StoryFn<typeof Accordion> = () => (
  <Accordion>
    <Accordion.Item
      id="item-1"
      title={
        <>
          Configure the <code>data-theme</code> attribute — <strong>required</strong>
        </>
      }
    >
      The trigger supports ReactNode titles, including inline code and emphasis elements.
    </Accordion.Item>
    <Accordion.Item
      id="item-2"
      title={
        <>
          Using <code>tokens:build</code> and <code>tokens:validate</code> in your workflow
        </>
      }
    >
      Multiple inline code elements in a title should still wrap gracefully at narrow widths.
    </Accordion.Item>
  </Accordion>
);

/**
 * Verifies that long unbreakable strings in panel body content wrap correctly
 * and do not overflow the panel container.
 */
export const LongPanelContent: StoryFn<typeof Accordion> = () => (
  <Accordion defaultOpen="item-1">
    <Accordion.Item id="item-1" title="Installation">
      Install the package by running:{' '}
      <code>
        https://registry.npmjs.org/@joeburton/one-design-system/-/one-design-system-1.0.0.tgz
      </code>
      <br />
      <br />
      This is a very long paragraph designed to test general text wrapping inside the panel. It
      contains multiple sentences of varying length to ensure that the font, line-height, and
      overflow settings all combine correctly at different viewport widths without any text being
      clipped or obscured by the panel container boundaries.
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Long URL in body">
      See the full discussion at{' '}
      <a href="#">
        https://github.com/joeburton/one-design-system/pull/42/files/diff/components/Accordion/Accordion.module.css
      </a>
    </Accordion.Item>
  </Accordion>
);

/**
 * Verifies that interactive elements (links, buttons) inside a panel have their
 * focus rings fully visible and are not clipped by `overflow: hidden` on `.panelContent`.
 */
export const WithInteractiveContent: StoryFn<typeof Accordion> = () => (
  <Accordion defaultOpen="item-1">
    <Accordion.Item id="item-1" title="Panel with interactive elements">
      <p style={{ marginBottom: '12px' }}>
        Tab through the elements below and confirm focus rings are fully visible and not clipped at
        the top edge of the panel.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a href="#">Read the documentation →</a>
        <a href="#">View the changelog →</a>
        <button type="button">Trigger an action</button>
      </div>
    </Accordion.Item>
    <Accordion.Item id="item-2" title="Second panel">
      A normal panel for comparison.
    </Accordion.Item>
  </Accordion>
);
