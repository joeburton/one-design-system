import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/token.utils';
import styles from './Toast.module.css';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface ToastOptions {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  /** Auto-dismiss delay in ms. Set to 0 to disable. Default: 5000 */
  duration?: number;
  onDismiss?: () => void;
}

interface ToastItemState {
  id: string;
  variant: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
  onDismiss?: () => void;
  exiting: boolean;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
}

const ANIMATION_DURATION = 200;
const DEFAULT_DURATION = 5000;

let idCounter = 0;
function genId(): string {
  return `toast-${++idCounter}-${Date.now()}`;
}

const ICONS: Record<ToastVariant, JSX.Element> = {
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

interface ToastSingleProps {
  item: ToastItemState;
  onDismiss: (id: string) => void;
}

function ToastSingle({ item, onDismiss }: ToastSingleProps) {
  const duration = item.duration ?? DEFAULT_DURATION;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(item.id), duration);
    }
  }, [duration, item.id, onDismiss, clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  // Stop the timer when the exit animation begins (e.g. dismissed externally).
  useEffect(() => {
    if (item.exiting) clearTimer();
  }, [item.exiting, clearTimer]);

  return (
    <div
      role={item.variant === 'error' || item.variant === 'warning' ? 'alert' : 'status'}
      aria-live={item.variant === 'error' || item.variant === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={cx(
        styles.toast,
        styles[`variant-${item.variant}`],
        item.exiting && styles.exiting,
      )}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <span className={styles.icon} aria-hidden="true">
        {ICONS[item.variant]}
      </span>
      <div className={styles.content}>
        {item.title && <p className={styles.title}>{item.title}</p>}
        {item.description && <p className={styles.description}>{item.description}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(item.id)}
        className={styles.dismiss}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children, position = 'bottom-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemState[]>([]);
  // Ref so dismiss() can read onDismiss callbacks without stale closure issues.
  const toastsRef = useRef<ToastItemState[]>([]);
  toastsRef.current = toasts;

  const dismiss = useCallback((id: string) => {
    toastsRef.current.find(t => t.id === id)?.onDismiss?.();
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, ANIMATION_DURATION);
  }, []);

  const dismissAll = useCallback(() => {
    toastsRef.current.forEach(t => t.onDismiss?.());
    setToasts(prev => prev.map(t => ({ ...t, exiting: true })));
    setTimeout(() => setToasts([]), ANIMATION_DURATION);
  }, []);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = genId();
    setToasts(prev => [
      ...prev,
      {
        id,
        variant: options.variant ?? 'info',
        title: options.title,
        description: options.description,
        duration: options.duration,
        onDismiss: options.onDismiss,
        exiting: false,
      },
    ]);
    return id;
  }, []);

  // For top positions, newest toast appears first (closest to corner).
  const renderedToasts = position.startsWith('top') ? [...toasts].reverse() : toasts;

  return (
    <ToastContext.Provider value={{ toast: addToast, dismiss, dismissAll }}>
      {children}
      {createPortal(
        <div
          role="region"
          aria-label="Notifications"
          className={cx(styles.container, styles[`position-${position}`])}
        >
          {renderedToasts.map(item => (
            <ToastSingle key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';
