import type { Meta, StoryFn } from '@storybook/react';
import { Icon, NamedIcon, icons } from './Icon';
import { Stack } from '../Stack/Stack';
import type { IconName } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: [
        'inherit',
        'default',
        'subtle',
        'muted',
        'primary',
        'success',
        'warning',
        'error',
        'info',
      ],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

const Label = ({ children }: { children: string }) => (
  <span
    style={{
      fontSize: 'var(--ds-typography-fontSize-xs)',
      color: 'var(--ds-color-text-subtle)',
      fontFamily: 'var(--ds-typography-fontFamily-body)',
    }}
  >
    {children}
  </span>
);

export const AllIcons: StoryFn<typeof Icon> = () => (
  <Stack direction="row" gap="lg" wrap="wrap" align="center">
    {(Object.keys(icons) as IconName[]).map((name) => (
      <Stack key={name} direction="column" align="center" gap="xs">
        <NamedIcon name={name} size="md" color="default" label={name} />
        <Label>{name}</Label>
      </Stack>
    ))}
  </Stack>
);

AllIcons.storyName = 'Icon Registry';

export const Sizes: StoryFn<typeof Icon> = () => (
  <Stack direction="row" gap="lg" align="center">
    {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
      <Stack key={size} direction="column" align="center" gap="xs">
        <NamedIcon name="check" size={size} color="primary" label={`check icon ${size}`} />
        <Label>{size}</Label>
      </Stack>
    ))}
  </Stack>
);

Sizes.storyName = 'All Sizes';

export const Colours: StoryFn<typeof Icon> = () => (
  <Stack direction="row" gap="lg" align="center" wrap="wrap">
    {(
      ['default', 'subtle', 'muted', 'primary', 'success', 'warning', 'error', 'info'] as const
    ).map((color) => (
      <Stack key={color} direction="column" align="center" gap="xs">
        <NamedIcon name="info" size="lg" color={color} label={`info icon ${color}`} />
        <Label>{color}</Label>
      </Stack>
    ))}
  </Stack>
);

Colours.storyName = 'All Colours';
