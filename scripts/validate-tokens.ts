#!/usr/bin/env tsx
/**
 * Token Validation — validates all token JSON against W3C spec shape via Zod.
 * Usage: npx tsx scripts/validate-tokens.ts
 */

import { z } from 'zod';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const TokenTypeSchema = z.enum([
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'shadow',
  'gradient',
  'typography',
  'border',
  'transition',
  'strokeStyle',
]);

const DesignTokenSchema = z.object({
  $value: z.union([z.string(), z.number()]),
  $type: TokenTypeSchema.optional(),
  $description: z.string().optional(),
  $extensions: z.record(z.unknown()).optional(),
});

const TokenGroupSchema: z.ZodType<Record<string, unknown>> = z.lazy(() =>
  z.record(z.union([DesignTokenSchema, TokenGroupSchema, z.string()]))
);

const TokenFileSchema = z
  .object({
    $schema: z.string().optional(),
    $description: z.string().optional(),
  })
  .catchall(z.union([DesignTokenSchema, TokenGroupSchema]));

function countTokens(obj: Record<string, unknown>, n = 0): number {
  for (const v of Object.values(obj)) {
    if (typeof v === 'object' && v !== null && '$value' in v) n++;
    else if (typeof v === 'object' && v !== null) n = countTokens(v as Record<string, unknown>, n);
  }
  return n;
}

async function validate(): Promise<void> {
  console.log('🔍 One Design System — Token Validation\n');

  const files = [
    'tokens/primitive.tokens.json',
    'tokens/semantic.light.tokens.json',
    'tokens/semantic.dark.tokens.json',
  ];

  let allValid = true;

  for (const file of files) {
    const fullPath = resolve(root, file);
    let data: Record<string, unknown>;

    try {
      data = JSON.parse(readFileSync(fullPath, 'utf-8')) as Record<string, unknown>;
    } catch {
      console.log(`❌ ${file} — could not read file`);
      allValid = false;
      continue;
    }

    const result = TokenFileSchema.safeParse(data);
    if (result.success) {
      const count = countTokens(data);
      console.log(`✅ ${file} — ${count} tokens valid`);
    } else {
      allValid = false;
      console.log(`❌ ${file}`);
      result.error.errors.forEach((e) => console.log(`   • ${e.path.join('.')}: ${e.message}`));
    }
  }

  if (allValid) {
    console.log('\n✨ All token files valid!\n');
  } else {
    console.error('\n❌ Validation failed.\n');
    process.exit(1);
  }
}

validate().catch((err: unknown) => {
  console.error('Fatal:', err);
  process.exit(1);
});
