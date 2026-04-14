import type { Meta, StoryFn } from '@storybook/react';
import { Stack } from './Stack';
import { Text } from '../Typography/Typography';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Stack>;

export default meta;

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

export const Vertical: StoryFn<typeof Stack> = () => (
  <Stack direction="column" gap="sm" style={{ width: 300 }}>
    <Box label="First" />
    <Box label="Second" />
    <Box label="Third" />
  </Stack>
);
Vertical.storyName = 'Column (default)';

export const Horizontal: StoryFn<typeof Stack> = () => (
  <Stack direction="row" gap="sm" align="center">
    <Box label="Alpha" />
    <Box label="Beta" />
    <Box label="Gamma" />
  </Stack>
);
Horizontal.storyName = 'Row';

export const SpaceBetween: StoryFn<typeof Stack> = () => (
  <Stack direction="row" gap="md" justify="between" align="center" fullWidth>
    <Box label="Left" />
    <Box label="Right" />
  </Stack>
);
SpaceBetween.storyName = 'Space Between';

export const Wrapped: StoryFn<typeof Stack> = () => (
  <Stack direction="row" gap="sm" wrap="wrap" style={{ maxWidth: 320 }}>
    {Array.from({ length: 8 }, (_, i) => (
      <Box key={i} label={`Item ${i + 1}`} />
    ))}
  </Stack>
);
Wrapped.storyName = 'Wrap';

export const AllGaps: StoryFn<typeof Stack> = () => (
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
);
AllGaps.storyName = 'All Gap Sizes';
