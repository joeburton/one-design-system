import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  args: {
    content: 'This is a tooltip',
    placement: 'top',
    delay: 0,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Button>Hover me</Button> },
};

export const AllPlacements: StoryFn<typeof Tooltip> = () => (
  <div style={{ display: 'flex', gap: 32, padding: 64 }}>
    <Tooltip content="Above" placement="top">
      <Button variant="secondary">Top</Button>
    </Tooltip>
    <Tooltip content="Below" placement="bottom">
      <Button variant="secondary">Bottom</Button>
    </Tooltip>
    <Tooltip content="To the left" placement="left">
      <Button variant="secondary">Left</Button>
    </Tooltip>
    <Tooltip content="To the right" placement="right">
      <Button variant="secondary">Right</Button>
    </Tooltip>
  </div>
);

export const WithDelay: Story = {
  name: 'With Delay (300ms)',
  args: {
    content: 'Appeared after 300ms',
    delay: 300,
    children: <Button variant="secondary">Hover (delayed)</Button>,
  },
};

export const OnIcon: StoryFn<typeof Tooltip> = () => (
  <Tooltip content="Delete this item" placement="top">
    <button aria-label="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
      🗑️
    </button>
  </Tooltip>
);

export const KeyboardFocus: Story = {
  name: 'Keyboard: Focus shows tooltip',
  args: { content: 'Shown on focus', children: <Button>Focus me</Button> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /focus me/i });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute('aria-describedby');
  },
};
