import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    resize: { control: 'select', options: ['none', 'vertical', 'both'] },
  },
  args: {
    size: 'md',
    status: 'default',
    resize: 'vertical',
    placeholder: 'Enter your text here…',
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Description', hint: 'Up to 500 characters.' },
};

export const WithError: Story = {
  name: 'Error State',
  args: {
    label: 'Bio',
    errorMessage: 'Bio must be at least 20 characters.',
    defaultValue: 'Too short.',
  },
};

export const WithSuccess: Story = {
  name: 'Success State',
  args: {
    label: 'Bio',
    status: 'success',
    hint: 'Looks great!',
    defaultValue: 'I build design systems and love clean component APIs.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Notes',
    disabled: true,
    defaultValue: 'This field cannot be edited.',
  },
};

export const ReadOnly: Story = {
  name: 'Read Only',
  args: {
    label: 'Terms',
    readOnly: true,
    resize: 'none',
    defaultValue:
      'These terms and conditions govern your use of this service. By proceeding you agree to them.',
  },
};

export const NoResize: Story = {
  name: 'Resize: None',
  args: { label: 'Fixed size', resize: 'none', rows: 3 },
};

export const ResizeBoth: Story = {
  name: 'Resize: Both',
  args: { label: 'Freeform', resize: 'both' },
};

export const AutoResize: Story = {
  name: 'Auto Resize',
  args: {
    label: 'Auto-expanding',
    autoResize: true,
    rows: 2,
    hint: 'Grows as you type.',
    placeholder: 'Start typing to see the textarea expand…',
  },
};

export const AllSizes: StoryFn<typeof Textarea> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
    <Textarea size="sm" label="Small" placeholder="Small textarea" rows={2} />
    <Textarea size="md" label="Medium" placeholder="Medium textarea" rows={3} />
    <Textarea size="lg" label="Large" placeholder="Large textarea" rows={4} />
  </div>
);

export const KeyboardFocus: Story = {
  name: 'Keyboard: Tab reaches field and accepts input',
  args: { label: 'Message', placeholder: 'Type something…', rows: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox', { name: /message/i });

    await userEvent.tab();
    await expect(textarea).toHaveFocus();

    await userEvent.keyboard('Hello from keyboard!');
    await expect(textarea).toHaveValue('Hello from keyboard!');
  },
};
