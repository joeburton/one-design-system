import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const Checked: Story = {
  args: { label: 'Checked by default', defaultChecked: true },
};

export const WithHint: Story = {
  args: {
    label: 'Subscribe to newsletter',
    hint: 'You can unsubscribe at any time.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue.',
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: { label: 'Cannot change this', disabled: true },
};

export const DisabledChecked: Story = {
  name: 'Disabled (checked)',
  args: { label: 'Already selected', disabled: true, defaultChecked: true },
};

export const AllStates: StoryFn<typeof Checkbox> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Checkbox label="Unchecked" />
    <Checkbox label="Checked" defaultChecked />
    <Checkbox label="Indeterminate" indeterminate />
    <Checkbox label="With hint" hint="Some helpful context." />
    <Checkbox label="With error" error="This field is required." />
    <Checkbox label="Disabled" disabled />
    <Checkbox label="Disabled checked" disabled defaultChecked />
  </div>
);

export const KeyboardToggle: Story = {
  name: 'Keyboard: Space toggles checkbox',
  args: { label: 'Agree to terms' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: /agree to terms/i });

    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await expect(checkbox).not.toBeChecked();

    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();

    await userEvent.keyboard(' ');
    await expect(checkbox).not.toBeChecked();
  },
};
