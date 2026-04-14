import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    onDismiss: { action: 'dismissed' },
  },
  args: {
    variant: 'info',
    children: 'This is an alert message with some useful information.',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: StoryFn<typeof Alert> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Alert variant="info" title="Information">
      Your account settings have been updated successfully.
    </Alert>
    <Alert variant="success" title="Success">
      Payment processed. Your order is confirmed.
    </Alert>
    <Alert variant="warning" title="Warning">
      Your session will expire in 5 minutes. Save your work.
    </Alert>
    <Alert variant="error" title="Error">
      Failed to save changes. Please try again or contact support.
    </Alert>
  </div>
);
AllVariants.storyName = 'All Variants';

export const Dismissible: Story = {
  storyName: 'Dismissible',
  args: {
    title: 'Dismissible Alert',
    variant: 'info',
    children: 'Click the × button to dismiss this alert.',
    onDismiss: () => alert('dismissed'),
  },
};

export const NoIcon: Story = {
  storyName: 'No Icon',
  args: {
    icon: null,
    title: 'Clean Alert',
    children: 'This alert has no icon.',
  },
};
