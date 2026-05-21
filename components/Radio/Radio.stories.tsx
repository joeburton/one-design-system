import { useState } from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 'option', label: 'Option A', name: 'standalone' },
};

export const WithHint: Story = {
  args: { value: 'option', label: 'Option A', hint: 'Recommended for most users.', name: 'hint' },
};

export const WithError: Story = {
  args: { value: 'option', label: 'Option A', error: 'Please select an option.', name: 'error' },
};

export const Disabled: Story = {
  args: { value: 'option', label: 'Cannot select', disabled: true, name: 'disabled' },
};

export const GroupVertical: StoryFn = () => (
  <RadioGroup name="plan" label="Choose a plan" defaultValue="pro">
    <Radio value="free" label="Free" hint="Up to 3 projects." />
    <Radio value="pro" label="Pro" hint="Unlimited projects." />
    <Radio value="enterprise" label="Enterprise" hint="Custom pricing." />
  </RadioGroup>
);

export const GroupHorizontal: StoryFn = () => (
  <RadioGroup name="size" label="T-shirt size" orientation="horizontal">
    <Radio value="xs" label="XS" />
    <Radio value="sm" label="SM" />
    <Radio value="md" label="MD" />
    <Radio value="lg" label="LG" />
    <Radio value="xl" label="XL" />
  </RadioGroup>
);

export const GroupDisabled: StoryFn = () => (
  <RadioGroup name="locked" label="Locked options" disabled>
    <Radio value="a" label="Option A" />
    <Radio value="b" label="Option B" />
    <Radio value="c" label="Option C" />
  </RadioGroup>
);

export const GroupControlled: StoryFn = () => {
  const [value, setValue] = useState('monthly');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioGroup name="billing" label="Billing cycle" value={value} onChange={setValue}>
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" hint="Save 20%." />
      </RadioGroup>
      <p style={{ fontSize: 13 }}>Selected: {value}</p>
    </div>
  );
};

export const KeyboardNavigation: StoryFn = () => (
  <RadioGroup name="nav-test" label="Pick one">
    <Radio value="a" label="Option A" />
    <Radio value="b" label="Option B" />
    <Radio value="c" label="Option C" />
  </RadioGroup>
);
KeyboardNavigation.storyName = 'Keyboard: Arrow keys navigate group';
KeyboardNavigation.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  const radios = canvas.getAllByRole('radio');

  await userEvent.tab();
  await expect(radios[0]).toHaveFocus();

  await userEvent.keyboard('{ArrowDown}');
  await expect(radios[1]).toHaveFocus();
  await expect(radios[1]).toBeChecked();

  await userEvent.keyboard('{ArrowDown}');
  await expect(radios[2]).toHaveFocus();
  await expect(radios[2]).toBeChecked();
};
