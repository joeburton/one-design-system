# One Design System

[![CI](https://github.com/joeburton/one-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/joeburton/one-design-system/actions/workflows/ci.yml)

A production-ready, token-driven React + TypeScript component library. Tokens are the single source of truth. Themes are applied via CSS variable overrides — zero component-level logic.

---

## Architecture Overview

```
JSON Tokens → Transform Script → CSS Variables → Components
     ↓               ↓                ↓               ↓
W3C spec      TypeScript types    :root / [data-theme]   CSS Modules
```

### Token layers

| Layer                | File                                | Purpose                                                    |
| -------------------- | ----------------------------------- | ---------------------------------------------------------- |
| **Primitive**        | `tokens/primitive.tokens.json`      | Raw values — colours, spacing, radii, shadows              |
| **Semantic (light)** | `tokens/semantic.light.tokens.json` | Contextual meaning — `color-brand-primary`, `elevation-md` |
| **Semantic (dark)**  | `tokens/semantic.dark.tokens.json`  | Dark theme overrides only — references same primitives     |
| **Generated CSS**    | `styles/tokens.css`                 | Output of transform script — consumed by browser           |

### Where TypeScript enforces safety

- **`SemanticToken`** — union type of every valid token key; used by `token()` utility so invalid token names are caught at compile time
- **Inferred JSON types** — `typeof primitiveTokensJson` gives exact literal types for all token values
- **Strict component props** — `ButtonVariant`, `AlertVariant`, etc. are string literal unions derived from the token system
- **`tokenVar<T>`** — generic utility returns `var(--ds-${T})` typed as `TokenVar<T>` for use in inline styles

---

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Build tokens

```bash
npm run tokens:build
```

This runs `scripts/transform-tokens.ts` which:

- Flattens primitive tokens into a lookup map
- Resolves all `{reference}` values in semantic tokens
- Outputs `styles/tokens.css` and `styles/themes/dark.css`
- Generates `tokens/types/token-vars.generated.ts` with typed constants

### 3. Validate tokens

```bash
npm run tokens:validate
```

Uses Zod to validate all token JSON files against the W3C spec shape.

### 4. Storybook

```bash
npm run storybook
```

Storybook runs on `http://localhost:6006`. Use the **Theme** toolbar toggle to switch between light and dark.

### 5. Tests

```bash
npm run test           # run all tests
npm run test:coverage  # with coverage report
npm run test:watch     # watch mode
```

### 6. Typecheck

```bash
npm run typecheck
```

---

## Project Structure

```
one-design-system/
├── tokens/
│   ├── primitive.tokens.json        # Raw values (W3C spec)
│   ├── semantic.light.tokens.json   # Semantic tokens — light theme
│   ├── semantic.dark.tokens.json    # Semantic overrides — dark theme
│   └── types/
│       ├── tokens.types.ts          # TypeScript type system
│       └── token-vars.generated.ts  # AUTO-GENERATED — do not edit
│
├── scripts/
│   ├── transform-tokens.ts          # JSON → CSS variables transform
│   └── validate-tokens.ts           # Zod schema validation
│
├── styles/
│   ├── tokens.css                   # Generated CSS variables (light + primitives)
│   ├── themes/
│   │   └── dark.css                 # Generated dark theme overrides
│   └── global.css                   # Reset + base styles
│
├── components/
│   ├── index.ts                     # Barrel export
│   ├── Button/
│   ├── Input/
│   ├── Select/
│   ├── Typography/
│   ├── Card/
│   ├── Alert/
│   ├── Stack/
│   └── Icon/
│
├── hooks/
│   └── useTheme.tsx                 # ThemeProvider + useTheme()
│
├── utils/
│   └── token.utils.ts               # token(), tokenStyle(), cx()
│
├── tests/
│   ├── setup.ts                     # Vitest + jest-dom setup
│   ├── Button.test.tsx
│   ├── Input.test.tsx
│   └── token.utils.test.ts
│
├── storybook/
│   └── stories/
│       └── TokenReference.stories.tsx
│
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
│
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## Consuming Tokens in Components

### In CSS Modules (preferred)

```css
/* MyComponent.module.css */
.button {
  background-color: var(--ds-color-brand-primary);
  padding: var(--ds-spacing-component-md);
  border-radius: var(--ds-borderRadius-button);
  transition: background-color var(--ds-transition-fast);
}
```

### In TypeScript (type-safe inline styles)

```tsx
import { token } from '../utils/token.utils';

// Type-safe — invalid token names are a compile error
const style = {
  color: token('color-text-default'),
  background: token('color-surface-raised'),
};
```

### Using the `tokenStyle()` helper

```tsx
import { tokenStyle } from '../utils/token.utils';

const style = tokenStyle({
  backgroundColor: 'color-brand-primaryMuted',
  borderColor: 'color-brand-primaryBorder',
});
```

---

## Theming

Themes work by applying a `data-theme` attribute to `<html>`. No component code changes.

```tsx
// Wrap your app
import { ThemeProvider } from './hooks/useTheme';

<ThemeProvider>
  <App />
</ThemeProvider>;

// Inside any component
import { useTheme } from './hooks/useTheme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}
```

The `ThemeProvider`:

- Reads `localStorage` on mount (persists preference)
- Falls back to `prefers-color-scheme` media query
- Applies `data-theme="light"` or `data-theme="dark"` to `<html>`

---

## Adding a New Token

1. Add the value to `tokens/primitive.tokens.json`
2. Add a semantic reference to `tokens/semantic.light.tokens.json` (and override in `semantic.dark.tokens.json` if it needs a dark value)
3. Add the key to the relevant union type in `tokens/types/tokens.types.ts`
4. Run `npm run tokens:build` to regenerate CSS and typed constants

---

## Adding a New Component

Use the generator script to scaffold all required files automatically:

```bash
npm run generate:component -- MyComponent
```

This creates the following files in one step:

- `components/MyComponent/MyComponent.tsx` — component with `variant` prop and `cx()` classnames
- `components/MyComponent/MyComponent.module.css` — CSS Module using only design tokens
- `components/MyComponent/MyComponent.stories.tsx` — Storybook stories with `Default` and `Outlined` variants

It also appends the barrel export to `components/index.ts` automatically.

The component name must be PascalCase (e.g. `MyComponent`, not `my-component`). Edit the generated files to implement your component's full API.

---

## Token Naming Convention

```
[category]-[subcategory]-[variant]-[state]

Examples:
  color-brand-primary
  color-brand-primaryHover
  color-status-errorText
  spacing-component-md
  elevation-lg
  transition-fast
  borderRadius-button
```

CSS variable prefix: `--ds-` (design system)

---

## Scripts Reference

| Script                    | Description                  |
| ------------------------- | ---------------------------- |
| `npm run dev`             | Vite dev server              |
| `npm run build`           | Production build             |
| `npm run tokens:validate` | Validate token JSON with Zod |
| `npm run tokens:build`    | Transform tokens → CSS + TS  |
| `npm run storybook`       | Storybook dev server         |
| `npm run build-storybook` | Build Storybook static site  |
| `npm run test`            | Run all tests                |
| `npm run test:coverage`   | Tests with coverage report   |
| `npm run typecheck`            | TypeScript type checking               |
| `npm run generate:component`   | Scaffold a new component with all files|
| `npm run lint`                 | ESLint                                 |
| `npm run format`               | Prettier                               |
