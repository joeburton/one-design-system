import type { Meta, StoryObj, StoryFn } from '@storybook/react';
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
  storyName: 'Error State',
  args: {
    label: 'Password',
    type: 'password',
    errorMessage: 'Password must be at least 8 characters.',
    defaultValue: 'short',
  },
};

export const WithSuccess: Story = {
  storyName: 'Success State',
  args: {
    label: 'Username',
    status: 'success',
    hint: 'Username is available!',
    defaultValue: 'joeburton',
  },
};

export const WithStartAdornment: Story = {
  storyName: 'With Start Adornment',
  args: {
    label: 'Search',
    startAdornment: <NamedIcon name="search" size="sm" color="muted" />,
    placeholder: 'Search anything…',
  },
};

export const AllSizes: StoryFn<typeof Input> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
    <Input size="sm" label="Small" placeholder="Small input" />
    <Input size="md" label="Medium" placeholder="Medium input" />
    <Input size="lg" label="Large" placeholder="Large input" />
  </div>
);
AllSizes.storyName = 'All Sizes';

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    defaultValue: 'Cannot edit this',
  },
};
