import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { Input } from './Input';
import { NamedIcon } from '../Icon/Icon';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
  args: {
    size: 'md',
    status: 'default',
    placeholder: 'Placeholder text',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Email address', hint: 'We will never share your email.' },
};

export const WithError: Story = {
  name: 'Error State',
  args: {
    label: 'Password',
    type: 'password',
    errorMessage: 'Password must be at least 8 characters.',
    defaultValue: 'short',
  },
};

export const WithSuccess: Story = {
  name: 'Success State',
  args: {
    label: 'Username',
    status: 'success',
    hint: 'Username is available!',
    defaultValue: 'joeburton',
  },
};

export const WithStartAdornment: Story = {
  name: 'With Start Adornment',
  args: {
    label: 'Search',
    startAdornment: <NamedIcon name="search" size="sm" color="muted" />,
    placeholder: 'Search anything…',
  },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    defaultValue: 'Cannot edit this',
  },
};

export const KeyboardFocus: Story = {
  name: 'Keyboard: Tab reaches field and accepts input',
  args: { label: 'Email address', placeholder: 'you@example.com' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /email address/i });

    // Tab to focus the input
    await userEvent.tab();
    await expect(input).toHaveFocus();

    // Type into the focused input
    await userEvent.keyboard('hello@example.com');
    await expect(input).toHaveValue('hello@example.com');
  },
};
