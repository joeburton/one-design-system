import type { Meta, StoryObj } from '@storybook/react';
import { Typography, H1, H2, H3, H4, Text, TextSm, Caption, Overline, Code } from './Typography';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScale: Story = {
  name: 'Type Scale',
  render: () => (
    <Stack direction="column" gap="md">
      <H1>Heading 1 — 40px Bold</H1>
      <H2>Heading 2 — 32px Bold</H2>
      <H3>Heading 3 — 28px Semibold</H3>
      <H4>Heading 4 — 24px Semibold</H4>
      <Typography variant="h5">Heading 5 — 20px Semibold</Typography>
      <Typography variant="h6">Heading 6 — 18px Semibold</Typography>
      <Typography variant="body-lg">Body Large — 18px Regular</Typography>
      <Text>Body — 16px Regular. The quick brown fox jumps over the lazy dog.</Text>
      <TextSm>Body Small — 14px Regular. The quick brown fox jumps over the lazy dog.</TextSm>
      <Caption>Caption — 12px Regular</Caption>
      <Overline>Overline — 12px Semibold Uppercase</Overline>
      <Code>code snippet</Code>
    </Stack>
  ),
};

export const Colours: Story = {
  name: 'Text Colours',
  render: () => (
    <Stack direction="column" gap="sm">
      <Text color="default">default — primary text colour</Text>
      <Text color="subtle">subtle — secondary text colour</Text>
      <Text color="muted">muted — tertiary / placeholder</Text>
      <Text color="link">link — anchor colour</Text>
      <Text color="success">success — positive state</Text>
      <Text color="warning">warning — caution state</Text>
      <Text color="error">error — destructive state</Text>
    </Stack>
  ),
};

export const Truncation: Story = {
  name: 'Truncated Text',
  render: () => (
    <div style={{ width: 240 }}>
      <Text truncate>
        This very long text will be truncated with an ellipsis when it overflows its container.
      </Text>
    </div>
  ),
};
