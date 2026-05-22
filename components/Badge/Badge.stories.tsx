import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'info', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { children: 'Badge', variant: 'default', size: 'md' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Info: Story = { args: { variant: 'info', children: 'Info' } };
export const Success: Story = { args: { variant: 'success', children: 'Success' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Warning' } };
export const Error: Story = { args: { variant: 'error', children: 'Error' } };

export const Small: Story = { args: { size: 'sm', children: 'Small' } };

export const AllVariants: StoryFn = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
    <Badge variant="default">Default</Badge>
    <Badge variant="info">Info</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="error">Error</Badge>
  </div>
);

export const AllSizes: StoryFn = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <Badge size="sm" variant="info">
      Small
    </Badge>
    <Badge size="md" variant="info">
      Medium
    </Badge>
  </div>
);

export const DotVariants: StoryFn = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    {/* Dot badges are decorative; pair with a labelled parent or aria-hidden */}
    <Badge dot variant="default" aria-hidden="true" />
    <Badge dot variant="info" aria-hidden="true" />
    <Badge dot variant="success" aria-hidden="true" />
    <Badge dot variant="warning" aria-hidden="true" />
    <Badge dot variant="error" aria-hidden="true" />
  </div>
);

export const InContext: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14 }}>Pull requests</span>
      <Badge variant="info">12</Badge>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14 }}>Build</span>
      <Badge variant="success">Passing</Badge>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14 }}>Deployment</span>
      <Badge variant="error">Failed</Badge>
    </div>
  </div>
);
