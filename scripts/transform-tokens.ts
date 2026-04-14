#!/usr/bin/env tsx
/**
 * Token Transformation Script
 * Reads primitive + semantic token JSON files and outputs:
 *   - styles/tokens.css
 *   - styles/themes/dark.css
 *   - tokens/types/token-vars.generated.ts
 *
 * Usage: npx tsx scripts/transform-tokens.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RawToken {
  $value: string | number;
  $type?: string;
  $description?: string;
}

type RawTokenTree = { [key: string]: RawToken | RawTokenTree | string };
type FlatMap = Record<string, string>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isToken(v: unknown): v is RawToken {
  return typeof v === 'object' && v !== null && '$value' in v;
}

function resolveRef(ref: string, flat: FlatMap): string {
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref;
  const key = match[1].replace(/\./g, '-');
  const val = flat[key];
  if (!val) { console.warn(`⚠️  Unresolved: ${ref}`); return ref; }
  return /^\{.+\}$/.test(val) ? resolveRef(val, flat) : val;
}

function flattenTokens(tree: RawTokenTree, prefix = '', out: FlatMap = {}): FlatMap {
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const seg = prefix ? `${prefix}-${key}` : key;
    if (isToken(value)) {
      out[seg] = String(value.$value);
    } else if (typeof value === 'object' && value !== null) {
      flattenTokens(value as RawTokenTree, seg, out);
    }
  }
  return out;
}

function buildCssVars(tree: RawTokenTree, flat: FlatMap, prefix = '--ds'): FlatMap {
  const vars: FlatMap = {};
  function walk(t: RawTokenTree, path: string): void {
    for (const [key, value] of Object.entries(t)) {
      if (key.startsWith('$')) continue;
      const seg = `${path}-${key}`;
      if (isToken(value)) {
        const raw = String(value.$value);
        vars[seg] = /^\{.+\}$/.test(raw) ? resolveRef(raw, flat) : raw;
      } else if (typeof value === 'object' && value !== null) {
        walk(value as RawTokenTree, seg);
      }
    }
  }
  walk(tree, prefix);
  return vars;
}

function renderBlock(vars: FlatMap, selector: string): string {
  const decls = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${selector} {\n${decls}\n}`;
}

function renderTypedVars(vars: FlatMap): string {
  const toConst = (name: string) =>
    name.replace(/^--ds-/, '').replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
      .replace(/^./, (c) => c.toUpperCase());

  const consts = Object.keys(vars).map(name => `export const ${toConst(name)} = '${name}' as const;`).join('\n');
  const map = Object.keys(vars).map(name => `  '${name}': \`var(${name})\``).join(',\n');

  return `/**\n * AUTO-GENERATED — do not edit.\n * Run: npm run tokens:build\n */\n\n${consts}\n\nexport const tokenVars = {\n${map}\n} as const;\n\nexport type TokenVarKey = keyof typeof tokenVars;\nexport type TokenVarValue = (typeof tokenVars)[TokenVarKey];\n`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function transform(): Promise<void> {
  console.log('🔄 One Design System — Token Transform\n');

  const primitiveTokens = (await import('../tokens/primitive.tokens.json', { assert: { type: 'json' } })).default as RawTokenTree;
  const semanticLight   = (await import('../tokens/semantic.light.tokens.json', { assert: { type: 'json' } })).default as RawTokenTree;
  const semanticDark    = (await import('../tokens/semantic.dark.tokens.json',  { assert: { type: 'json' } })).default as RawTokenTree;

  const flat = flattenTokens(primitiveTokens);
  console.log(`✅ Flattened ${Object.keys(flat).length} primitive tokens`);

  const primVars  = Object.fromEntries(Object.entries(flat).map(([k, v]) => [`--ds-${k}`, v]));
  const lightVars = buildCssVars(semanticLight, flat);
  const darkVars  = buildCssVars(semanticDark, flat);

  console.log(`✅ Resolved ${Object.keys(lightVars).length} light semantic tokens`);
  console.log(`✅ Resolved ${Object.keys(darkVars).length} dark semantic overrides`);

  const lightCss = [
    '/* ONE DESIGN SYSTEM — Generated CSS Variables */',
    '/* DO NOT EDIT — run: npm run tokens:build */',
    '',
    '/* ── Primitive Tokens ── */',
    renderBlock(primVars, ':root'),
    '',
    '/* ── Semantic Tokens: Light (default) ── */',
    renderBlock(lightVars, ':root, [data-theme="light"]'),
    '',
  ].join('\n');

  const darkCss = [
    '/* ONE DESIGN SYSTEM — Dark Theme Overrides */',
    '/* DO NOT EDIT — run: npm run tokens:build */',
    '',
    renderBlock(darkVars, '[data-theme="dark"]'),
    '',
  ].join('\n');

  mkdirSync(resolve(root, 'styles/themes'), { recursive: true });
  writeFileSync(resolve(root, 'styles/tokens.css'), lightCss, 'utf-8');
  writeFileSync(resolve(root, 'styles/themes/dark.css'), darkCss, 'utf-8');
  console.log('✅ Written: styles/tokens.css');
  console.log('✅ Written: styles/themes/dark.css');

  mkdirSync(resolve(root, 'tokens/types'), { recursive: true });
  writeFileSync(resolve(root, 'tokens/types/token-vars.generated.ts'), renderTypedVars(lightVars), 'utf-8');
  console.log('✅ Written: tokens/types/token-vars.generated.ts');
  console.log('\n✨ Transform complete!\n');
}

transform().catch((err: unknown) => { console.error('❌ Failed:', err); process.exit(1); });
