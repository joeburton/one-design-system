import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import type { SelectItem } from './Select';

const flatOptions: SelectItem[] = [
  { value: 'react',   label: 'React' },
  { value: 'vue',     label: 'Vue' },
  { value: 'svelte',  label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
];

const groupedOptions: SelectItem[] = [
  {
    label: 'Frontend',
    options: [
      { value: 'react',  label: 'React' },
      { value: 'vue',    label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
    ],
  },
  {
    label: 'Backend',
    options: [
      { value: 'node',   label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'go',     label: 'Go' },
    ],
  },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Framework',
    options: flatOptions,
    placeholder: 'Choose a framework…',
    size: 'md',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithGroups: Story = {
  name: 'Grouped Options',
  args: {
    options: groupedOptions,
    label: 'Technology',
    placeholder: 'Choose a technology…',
  },
};

export const WithError: Story = {
  name: 'Error State',
  args: { errorMessage: 'Please select a framework.' },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
      <Select size="sm" label="Small" options={flatOptions} placeholder="Small…" />
      <Select size="md" label="Medium" options={flatOptions} placeholder="Medium…" />
      <Select size="lg" label="Large" options={flatOptions} placeholder="Large…" />
    </div>
  ),
};
