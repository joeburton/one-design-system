import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md', label: 'Loading…' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const CustomLabel: Story = {
  name: 'Custom screen-reader label',
  args: { label: 'Saving your changes…' },
};

export const AllSizes: StoryFn = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </div>
);

export const InContext: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
      <Spinner size="sm" label="Loading comments…" />
      <span>Loading comments…</span>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      }}
    >
      <Spinner size="lg" label="Loading page content…" />
    </div>
  </div>
);
