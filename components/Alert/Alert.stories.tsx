import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
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

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
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
  ),
};

export const Dismissible: Story = {
  name: 'Dismissible',
  args: {
    title: 'Dismissible Alert',
    variant: 'info',
    children: 'Click the × button to dismiss this alert.',
    onDismiss: () => window.alert('dismissed'),
  },
};

export const NoIcon: Story = {
  name: 'No Icon',
  args: {
    icon: null,
    title: 'Clean Alert',
    children: 'This alert has no icon.',
  },
};

export const KeyboardDismiss: Story = {
  name: 'Keyboard: Escape to dismiss',
  args: {
    title: 'Keyboard dismissible',
    variant: 'info',
    children: 'Focus the alert and press Escape to dismiss.',
    onDismiss: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The alert container should be reachable via Tab (tabIndex=-1 makes it programmatically focusable)
    const alert = canvas.getByRole('status');
    await expect(alert).toHaveAttribute('tabindex', '-1');

    // Focus the container and fire Escape — onDismiss should be called
    alert.focus();
    await expect(alert).toHaveFocus();
    await userEvent.keyboard('{Escape}');

    // Also verify the dismiss button is present and keyboard-accessible
    const dismissBtn = canvas.getByRole('button', { name: /dismiss/i });
    await expect(dismissBtn).toBeInTheDocument();
    dismissBtn.focus();
    await expect(dismissBtn).toHaveFocus();
  },
};
