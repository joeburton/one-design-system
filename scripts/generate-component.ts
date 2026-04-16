#!/usr/bin/env tsx
/**
 * Component Generator
 * Creates a new component with all associated files and barrel export.
 *
 * Usage: npm run generate:component -- MyComponent
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Arg parsing + validation
// ---------------------------------------------------------------------------

const name = process.argv[2]?.trim();

if (!name) {
  console.error('Error: component name is required.');
  console.error('  Usage: npm run generate:component -- MyComponent');
  process.exit(1);
}

if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error(`Error: "${name}" is not valid PascalCase.`);
  console.error(
    '  Component names must start with an uppercase letter and contain only letters and digits.'
  );
  process.exit(1);
}

const componentDir = resolve(root, 'components', name);

if (existsSync(componentDir)) {
  console.error(`Error: component "${name}" already exists at components/${name}/`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

const tsx = `\
import { type HTMLAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './${name}.module.css';

export interface ${name}Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

export function ${name}({
  variant = 'default',
  className,
  children,
  ...rest
}: ${name}Props) {
  return (
    <div className={cx(styles.root, styles[\`variant-\${variant}\`], className)} {...rest}>
      {children}
    </div>
  );
}
`;

const css = `\
.root {
  background-color: var(--ds-color-surface-default);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-borderRadius-card);
  padding: var(--ds-spacing-component-md);
  color: var(--ds-color-text-default);
}

.variant-outlined {
  background-color: transparent;
  border-color: var(--ds-color-border-strong);
}
`;

const stories = `\
import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: '${name} content',
    variant: 'default',
  },
} satisfies Meta<typeof ${name}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};
`;

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

mkdirSync(componentDir, { recursive: true });

writeFileSync(resolve(componentDir, `${name}.tsx`), tsx);
writeFileSync(resolve(componentDir, `${name}.module.css`), css);
writeFileSync(resolve(componentDir, `${name}.stories.tsx`), stories);

console.log(`Created components/${name}/${name}.tsx`);
console.log(`Created components/${name}/${name}.module.css`);
console.log(`Created components/${name}/${name}.stories.tsx`);

// ---------------------------------------------------------------------------
// Append barrel export
// ---------------------------------------------------------------------------

const barrelPath = resolve(root, 'components', 'index.ts');
const barrel = readFileSync(barrelPath, 'utf8');
const exportLine = `\n// ${name}\nexport { ${name} } from './${name}/${name}';\nexport type { ${name}Props } from './${name}/${name}';\n`;

writeFileSync(barrelPath, barrel + exportLine);

console.log(`Updated components/index.ts`);
console.log(`\nDone! Edit the generated files to implement your component.`);
