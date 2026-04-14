import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Card } from './Card';
import { H3, Text } from '../Typography/Typography';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    elevation:   { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg'] },
    padding:     { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    bordered:    { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
  args: {
    children: 'Card content',
    elevation: 'sm',
    padding: 'md',
    bordered: false,
    interactive: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <Text>This is a basic card with some content inside it.</Text>
    </Card>
  ),
};

export const WithSubComponents: StoryFn<typeof Card> = () => (
  <Card style={{ width: 360 }}>
    <Card.Header><H3>Card Title</H3></Card.Header>
    <Card.Body>
      <Stack direction="column" gap="sm">
        <Text>This card uses Header, Body, and Footer sub-components.</Text>
        <Text color="subtle">Each section has its own padding and separator.</Text>
      </Stack>
    </Card.Body>
    <Card.Footer>
      <Stack direction="row" gap="sm" justify="end">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </Stack>
    </Card.Footer>
  </Card>
);
WithSubComponents.storyName = 'With Header, Body & Footer';

export const Interactive: StoryFn<typeof Card> = () => (
  <Stack direction="row" gap="md">
    {(['none', 'xs', 'sm', 'md', 'lg'] as const).map((elevation) => (
      <Card key={elevation} elevation={elevation} interactive padding="md" style={{ width: 160 }}>
        <Stack direction="column" gap="xs">
          <Text color="subtle" style={{ fontSize: '0.75rem' }}>elevation</Text>
          <Text>{elevation}</Text>
        </Stack>
      </Card>
    ))}
  </Stack>
);
Interactive.storyName = 'Interactive (Hoverable)';

export const Elevations: StoryFn<typeof Card> = () => (
  <Stack direction="row" gap="lg" align="center">
    {(['none', 'xs', 'sm', 'md', 'lg'] as const).map((elevation) => (
      <Card key={elevation} elevation={elevation} padding="md" bordered style={{ width: 140 }}>
        <Text style={{ textAlign: 'center' }}>{elevation}</Text>
      </Card>
    ))}
  </Stack>
);
Elevations.storyName = 'All Elevations';
