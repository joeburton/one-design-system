# One Design System — Claude Context

This file gives Claude full context of the project architecture, conventions, and rules. Read it before making any changes.

---

## What this project is

A production-ready, token-driven React + TypeScript component library. Design tokens are the **single source of truth**. Themes are implemented via CSS variable overrides only — no component-level theme logic exists or should ever be added.

**Stack:** React 18, TypeScript 5 (strict), Vite 6, Vitest 2, Storybook 8, CSS Modules, CSS Custom Properties.

---

## Project structure

```
one-design-system/
├── tokens/
│   ├── primitive.tokens.json        # Raw values — colours, spacing, radii, shadows (W3C spec)
│   ├── semantic.light.tokens.json   # Contextual meaning mapped to primitives — light theme
│   ├── semantic.dark.tokens.json    # Dark theme overrides only (not a full redefinition)
│   └── types/
│       ├── tokens.types.ts          # All TypeScript types for the token system
│       └── token-vars.generated.ts  # AUTO-GENERATED — never edit by hand
│
├── scripts/
│   ├── transform-tokens.ts          # Reads JSON tokens → outputs CSS variables + typed constants
│   └── validate-tokens.ts           # Zod validation of token JSON files
│
├── styles/
│   ├── tokens.css                   # Generated — primitive + light semantic CSS variables
│   ├── themes/dark.css              # Generated — dark theme [data-theme="dark"] overrides
│   └── global.css                   # Reset + base styles (import once at app root)
│
├── components/
│   ├── index.ts                     # Barrel — all public exports
│   ├── Button/                      # Button.tsx + Button.module.css + Button.stories.tsx
│   ├── Input/                       # Input.tsx + Input.module.css + Input.stories.tsx
│   ├── Select/                      # Select.tsx + Select.module.css + Select.stories.tsx
│   ├── Typography/                  # Typography.tsx + Typography.module.css + Typography.stories.tsx
│   ├── Card/                        # Card.tsx + Card.module.css + Card.stories.tsx
│   ├── Alert/                       # Alert.tsx + Alert.module.css + Alert.stories.tsx
│   ├── Stack/                       # Stack.tsx + Stack.module.css + Stack.stories.tsx
│   └── Icon/                        # Icon.tsx + Icon.module.css + Icon.stories.tsx
│
├── hooks/
│   └── useTheme.tsx                 # ThemeProvider + useTheme() hook
│
├── utils/
│   └── token.utils.ts               # token(), tokenStyle(), cx() utilities
│
├── tests/
│   ├── setup.ts                     # Vitest + @testing-library/jest-dom setup
│   ├── Button.test.tsx
│   ├── Input.test.tsx
│   └── token.utils.test.ts
│
├── storybook/stories/
│   └── TokenReference.stories.tsx   # Token visualisation — colours, spacing, elevation
│
├── .storybook/
│   ├── main.ts                      # Storybook config
│   └── preview.tsx                  # Theme decorator + global CSS imports
│
├── vite-env.d.ts                    # CSS module + vite/client type declarations
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## Token system

### Three layers

| Layer | File | Purpose |
|-------|------|---------|
| Primitive | `tokens/primitive.tokens.json` | Raw values. No semantic meaning. Never use directly in components. |
| Semantic light | `tokens/semantic.light.tokens.json` | Intent-mapped values. References primitives via `{color.blue.600}` syntax. |
| Semantic dark | `tokens/semantic.dark.tokens.json` | Dark theme overrides only. Same keys, different values. |

### Naming convention

```
CSS variable:  --ds-{category}-{subcategory}-{variant}-{state}

Examples:
  --ds-color-brand-primary
  --ds-color-brand-primaryHover
  --ds-color-status-errorText
  --ds-spacing-component-md
  --ds-elevation-lg
  --ds-transition-fast
  --ds-borderRadius-button
  --ds-typography-fontFamily-body
  --ds-typography-fontSize-sm
```

All CSS variables are prefixed `--ds-` (design system).

### Token categories

- `color` → background, surface, border, text, brand, status
- `typography` → fontFamily, fontSize, fontWeight, lineHeight
- `spacing` → component (xs/sm/md/lg/xl), layout (xs → 2xl)
- `borderRadius` → button, input, card, badge, tooltip
- `elevation` → none, xs, sm, md, lg, xl (box-shadow values)
- `transition` → fast (100ms), normal (200ms), slow (300ms)

### After editing any token JSON

```bash
npm run tokens:validate   # Zod validation
npm run tokens:build      # Regenerates styles/tokens.css, styles/themes/dark.css, token-vars.generated.ts
```

---

## Rules — read before writing any code

### 1. No hard-coded values in components or CSS
Every colour, spacing value, radius, shadow, and transition **must** come from a CSS variable. No exceptions.

```css
/* ✅ correct */
.button {
  background-color: var(--ds-color-brand-primary);
  padding: var(--ds-spacing-component-md);
  border-radius: var(--ds-borderRadius-button);
}

/* ❌ wrong */
.button {
  background-color: #228be6;
  padding: 16px;
  border-radius: 6px;
}
```

### 2. No component-level theme logic
Themes are handled entirely by `[data-theme="dark"]` CSS overrides. Components must never check the current theme name.

```tsx
// ❌ never do this
const { theme } = useTheme();
const bg = theme === 'dark' ? '#212529' : '#ffffff';

// ✅ correct — CSS variables handle it automatically
// just use var(--ds-color-surface-default) in CSS
```

### 3. Use semantic tokens, not primitives
Components consume semantic tokens. Primitive tokens exist only as a reference layer for the transform script.

```css
/* ✅ correct — semantic */
color: var(--ds-color-text-default);

/* ❌ wrong — primitive */
color: var(--ds-color-neutral-900);
```

### 4. TypeScript — strict mode, no `any`
`tsconfig.json` has `"strict": true`. Do not add `any` types. Do not disable strict checks. `exactOptionalPropertyTypes` is intentionally omitted (breaks Vite/Rollup/Vitest interop).

### 5. CSS Modules only
All component styles live in `ComponentName.module.css`. No inline styles except where CSS variables are dynamically constructed. No global CSS in component files.

### 6. `InputProps` uses `startAdornment` / `endAdornment`
`prefix` is reserved by `HTMLInputElement`. Use `startAdornment` and `endAdornment` for icon slots.

---

## Adding a new component

Follow this exact pattern:

**1. Create the component file**
```tsx
// components/MyComponent/MyComponent.tsx
import { type HTMLAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './MyComponent.module.css';

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

export function MyComponent({ variant = 'default', className, children, ...rest }: MyComponentProps) {
  return (
    <div className={cx(styles.root, styles[`variant-${variant}`], className)} {...rest}>
      {children}
    </div>
  );
}
```

**2. Create the CSS Module — only CSS variables**
```css
/* components/MyComponent/MyComponent.module.css */
.root {
  background-color: var(--ds-color-surface-default);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-borderRadius-card);
  padding: var(--ds-spacing-component-md);
}
```

**3. Create Storybook stories**

Use `StoryFn` (not `StoryObj`) for stories that use a `render()` function without `args`, especially when the component has required `children`. Use `StoryObj` when you're passing `args` directly.

```tsx
// components/MyComponent/MyComponent.stories.tsx
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  args: { children: 'Content' },  // required if children is required
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Use StoryObj when args are sufficient
export const Default: Story = {};

// Use StoryFn when you need full render control (no args needed)
export const CustomLayout: StoryFn<typeof MyComponent> = () => (
  <MyComponent variant="outlined">Custom layout</MyComponent>
);
```

**4. Export from the barrel**
```ts
// components/index.ts — add:
export { MyComponent } from './MyComponent/MyComponent';
export type { MyComponentProps } from './MyComponent/MyComponent';
```

---

## Adding a new token

1. Add the raw value to `tokens/primitive.tokens.json`
2. Add a semantic reference to `tokens/semantic.light.tokens.json`
3. Add a dark override (if needed) to `tokens/semantic.dark.tokens.json`
4. Add the key to the relevant union type in `tokens/types/tokens.types.ts`
5. Run `npm run tokens:build`

---

## Theming

The `ThemeProvider` in `hooks/useTheme.tsx`:
- Reads `localStorage` on mount to persist preference
- Falls back to `prefers-color-scheme` media query
- Sets `data-theme="light"` or `data-theme="dark"` on `<html>`

```tsx
// Wrap your app once
import { ThemeProvider } from './hooks/useTheme';
import './styles/tokens.css';
import './styles/themes/dark.css';
import './styles/global.css';

<ThemeProvider><App /></ThemeProvider>

// Consume anywhere
import { useTheme } from './hooks/useTheme';
const { theme, toggleTheme } = useTheme();
```

---

## Utilities

### `token()` — type-safe CSS variable reference
```ts
import { token } from '../utils/token.utils';

// Returns 'var(--ds-color-brand-primary)' — type-checked against SemanticToken union
const color = token('color-brand-primary');
```

### `cx()` — conditional classNames
```ts
import { cx } from '../utils/token.utils';

cx('base', isActive && 'active', { disabled: isDisabled })
// → 'base active' or 'base disabled' etc.
```

### `tokenStyle()` — inline style object from tokens
```ts
import { tokenStyle } from '../utils/token.utils';

const style = tokenStyle({
  backgroundColor: 'color-brand-primaryMuted',
  borderColor: 'color-brand-primaryBorder',
});
```

---

## Scripts

```bash
npm run tokens:validate     # Validate token JSON files with Zod
npm run tokens:build        # Transform tokens → CSS + typed constants
npm run storybook           # Storybook dev server at localhost:6006
npm run test                # Vitest (single run)
npm run test:watch          # Vitest watch mode
npm run test:coverage       # Coverage report
npm run typecheck           # tsc --noEmit
npm run build               # Vite production build
```

---

## Known constraints / decisions

| Decision | Reason |
|----------|--------|
| `exactOptionalPropertyTypes` omitted from tsconfig | Causes deep type incompatibilities in Vite, Rollup, and Vitest's own `.d.ts` files |
| `InputProps` uses `startAdornment`/`endAdornment` not `prefix`/`suffix` | `prefix` is reserved on `HTMLInputElement` |
| `StoryFn` used for render-only stories | `StoryObj` requires `args` to satisfy required props like `children` |
| `node:` prefix on Node imports in scripts | Required for ESM + `moduleResolution: bundler` |
| `vite-env.d.ts` at root | Provides `*.module.css` type declarations without a separate `@types` package |
| No `prepare` script | Prevents `npm install` from failing when tokens haven't been built yet |
| React + react-dom in `devDependencies` | This is a component library; consumers provide their own React |
