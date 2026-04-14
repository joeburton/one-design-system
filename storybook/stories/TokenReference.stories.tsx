import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design Tokens/Token Reference',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2
      style={{
        fontFamily: 'var(--ds-typography-fontFamily-body)',
        fontSize: 'var(--ds-typography-fontSize-xs)',
        fontWeight: 'var(--ds-typography-fontWeight-semibold)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--ds-color-text-subtle)',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

const ColorSwatch = ({ name, variable }: { name: string; variable: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--ds-borderRadius-md)',
        background: `var(${variable})`,
        border: '1px solid var(--ds-color-border-subtle)',
        flexShrink: 0,
      }}
    />
    <div>
      <div
        style={{
          fontFamily: 'var(--ds-typography-fontFamily-body)',
          fontSize: 'var(--ds-typography-fontSize-sm)',
          color: 'var(--ds-color-text-default)',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: 'var(--ds-typography-fontFamily-code)',
          fontSize: 'var(--ds-typography-fontSize-xs)',
          color: 'var(--ds-color-text-subtle)',
        }}
      >
        {variable}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export const Colours: Story = {
  name: 'Colours',
  render: () => (
    <div
      style={{
        fontFamily: 'var(--ds-typography-fontFamily-body)',
        color: 'var(--ds-color-text-default)',
        maxWidth: 800,
      }}
    >
      <Section title="Background">
        <ColorSwatch name="background.default" variable="--ds-color-background-default" />
        <ColorSwatch name="background.subtle" variable="--ds-color-background-subtle" />
        <ColorSwatch name="background.muted" variable="--ds-color-background-muted" />
        <ColorSwatch name="background.emphasis" variable="--ds-color-background-emphasis" />
      </Section>
      <Section title="Text">
        <ColorSwatch name="text.default" variable="--ds-color-text-default" />
        <ColorSwatch name="text.subtle" variable="--ds-color-text-subtle" />
        <ColorSwatch name="text.muted" variable="--ds-color-text-muted" />
        <ColorSwatch name="text.link" variable="--ds-color-text-link" />
        <ColorSwatch name="text.disabled" variable="--ds-color-text-disabled" />
      </Section>
      <Section title="Brand">
        <ColorSwatch name="brand.primary" variable="--ds-color-brand-primary" />
        <ColorSwatch name="brand.primaryHover" variable="--ds-color-brand-primaryHover" />
        <ColorSwatch name="brand.primaryActive" variable="--ds-color-brand-primaryActive" />
        <ColorSwatch name="brand.primaryMuted" variable="--ds-color-brand-primaryMuted" />
      </Section>
      <Section title="Status">
        <ColorSwatch name="status.success" variable="--ds-color-status-success" />
        <ColorSwatch name="status.warning" variable="--ds-color-status-warning" />
        <ColorSwatch name="status.error" variable="--ds-color-status-error" />
        <ColorSwatch name="status.info" variable="--ds-color-status-info" />
      </Section>
    </div>
  ),
};

export const Spacing: Story = {
  name: 'Spacing',
  render: () => (
    <div
      style={{
        fontFamily: 'var(--ds-typography-fontFamily-body)',
        color: 'var(--ds-color-text-default)',
      }}
    >
      <Section title="Component Spacing">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <div
            key={size}
            style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}
          >
            <div
              style={{
                width: `var(--ds-spacing-component-${size})`,
                height: `var(--ds-spacing-component-${size})`,
                background: 'var(--ds-color-brand-primary)',
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--ds-typography-fontFamily-body)',
                fontSize: 'var(--ds-typography-fontSize-sm)',
                color: 'var(--ds-color-text-default)',
              }}
            >
              component-{size}
            </span>
            <span
              style={{
                fontFamily: 'var(--ds-typography-fontFamily-code)',
                fontSize: 'var(--ds-typography-fontSize-xs)',
                color: 'var(--ds-color-text-subtle)',
              }}
            >
              --ds-spacing-component-{size}
            </span>
          </div>
        ))}
      </Section>
    </div>
  ),
};

export const Elevation: Story = {
  name: 'Elevation',
  render: () => (
    <div
      style={{
        fontFamily: 'var(--ds-typography-fontFamily-body)',
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        padding: 24,
      }}
    >
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((level) => (
        <div
          key={level}
          style={{
            width: 120,
            height: 80,
            borderRadius: 'var(--ds-borderRadius-lg)',
            background: 'var(--ds-color-surface-default)',
            boxShadow: `var(--ds-elevation-${level})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--ds-color-border-subtle)',
            fontFamily: 'var(--ds-typography-fontFamily-body)',
            fontSize: 'var(--ds-typography-fontSize-sm)',
            color: 'var(--ds-color-text-subtle)',
          }}
        >
          {level}
        </div>
      ))}
    </div>
  ),
};
