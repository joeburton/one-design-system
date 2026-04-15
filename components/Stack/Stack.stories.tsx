import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Text } from '../Typography/Typography';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => (
  <div
    style={{
      background: 'var(--ds-color-brand-primaryMuted)',
      border: '1px solid var(--ds-color-brand-primaryBorder)',
      borderRadius: 'var(--ds-borderRadius-md)',
      padding: '8px 16px',
      color: 'var(--ds-color-brand-primaryText)',
      fontSize: 'var(--ds-typography-fontSize-sm)',
      fontFamily: 'var(--ds-typography-fontFamily-body)',
      fontWeight: 'var(--ds-typography-fontWeight-medium)',
      whiteSpace: 'nowrap' as const,
    }}
  >
    {label}
  </div>
);

export const Vertical: Story = {
  name: 'Column (default)',
  render: () => (
    <Stack direction="column" gap="sm" style={{ width: 300 }}>
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
  ),
};

export const Horizontal: Story = {
  name: 'Row',
  render: () => (
    <Stack direction="row" gap="sm" align="center">
      <Box label="Alpha" />
      <Box label="Beta" />
      <Box label="Gamma" />
    </Stack>
  ),
};

export const SpaceBetween: Story = {
  name: 'Space Between',
  render: () => (
    <Stack direction="row" gap="md" justify="between" align="center" fullWidth>
      <Box label="Left" />
      <Box label="Right" />
    </Stack>
  ),
};

export const Wrapped: Story = {
  name: 'Wrap',
  render: () => (
    <Stack direction="row" gap="sm" wrap="wrap" style={{ maxWidth: 320 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i} label={`Item ${i + 1}`} />
      ))}
    </Stack>
  ),
};

export const AllGaps: Story = {
  name: 'All Gap Sizes',
  render: () => (
    <Stack direction="column" gap="xl">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <div key={gap}>
          <Text
            style={{
              marginBottom: 4,
              fontSize: 'var(--ds-typography-fontSize-xs)',
              color: 'var(--ds-color-text-subtle)',
            }}
          >
            gap=&quot;{gap}&quot;
          </Text>
          <Stack direction="row" gap={gap} align="center">
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};
