import type { Meta, StoryFn } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import type { ToastPosition, ToastVariant } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Transient notifications triggered programmatically via `useToast()`. Wrap your app once with `ToastProvider` and call `toast()` from anywhere in the tree.',
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;

// ── Helpers ────────────────────────────────────────────────────────────────

const VARIANTS: ToastVariant[] = ['info', 'success', 'warning', 'error'];
const POSITIONS: ToastPosition[] = ['top-right', 'bottom-right', 'top-center', 'bottom-center'];

const MESSAGES: Record<ToastVariant, { title: string; description: string }> = {
  info: { title: 'Heads up', description: 'Your session will expire in 5 minutes.' },
  success: { title: 'Changes saved', description: 'Your profile has been updated successfully.' },
  warning: { title: 'Low storage', description: 'You are approaching your storage limit.' },
  error: { title: 'Upload failed', description: 'The file could not be uploaded. Please try again.' },
};

// ── Trigger component used in every story ──────────────────────────────────

function ToastTrigger({
  variant = 'info',
  label,
  duration,
}: {
  variant?: ToastVariant;
  label?: string;
  duration?: number;
}) {
  const { toast } = useToast();
  const msg = MESSAGES[variant];
  return (
    <button
      type="button"
      onClick={() => toast({ variant, ...msg, duration })}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid var(--ds-color-border-default)',
        background: 'var(--ds-color-surface-default)',
        color: 'var(--ds-color-text-default)',
        cursor: 'pointer',
        fontFamily: 'var(--ds-typography-fontFamily-body)',
        fontSize: 'var(--ds-typography-fontSize-sm)',
      }}
    >
      {label ?? `Show ${variant} toast`}
    </button>
  );
}

function DismissAllTrigger() {
  const { dismissAll } = useToast();
  return (
    <button
      type="button"
      onClick={dismissAll}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid var(--ds-color-border-default)',
        background: 'var(--ds-color-surface-default)',
        color: 'var(--ds-color-text-default)',
        cursor: 'pointer',
        fontFamily: 'var(--ds-typography-fontFamily-body)',
        fontSize: 'var(--ds-typography-fontSize-sm)',
      }}
    >
      Dismiss all
    </button>
  );
}

// ── Stories ────────────────────────────────────────────────────────────────

export const AllVariants: StoryFn = () => (
  <ToastProvider position="bottom-right">
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {VARIANTS.map(v => (
        <ToastTrigger key={v} variant={v} />
      ))}
    </div>
  </ToastProvider>
);
AllVariants.storyName = 'All variants';

export const AllPositions: StoryFn = () => {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {POSITIONS.map(pos => (
        <ToastProvider key={pos} position={pos}>
          <ToastTrigger variant="success" label={pos} />
        </ToastProvider>
      ))}
    </div>
  );
};
AllPositions.storyName = 'All positions';

export const Stacking: StoryFn = () => (
  <ToastProvider position="bottom-right">
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {VARIANTS.map(v => (
        <ToastTrigger key={v} variant={v} />
      ))}
      <DismissAllTrigger />
    </div>
  </ToastProvider>
);
Stacking.storyName = 'Stacking + dismiss all';

export const NoDismiss: StoryFn = () => (
  <ToastProvider position="bottom-right">
    <ToastTrigger variant="info" label="Show persistent toast (duration=0)" duration={0} />
  </ToastProvider>
);
NoDismiss.storyName = 'Persistent (no auto-dismiss)';

export const QuickDismiss: StoryFn = () => (
  <ToastProvider position="bottom-right">
    <ToastTrigger variant="success" label="Show toast (1.5 s)" duration={1500} />
  </ToastProvider>
);
QuickDismiss.storyName = 'Short duration (1.5 s)';
