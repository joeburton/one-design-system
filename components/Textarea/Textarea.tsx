import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaStatus = 'default' | 'error' | 'success' | 'warning';
export type TextareaResize = 'none' | 'vertical' | 'both';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  hint?: string;
  errorMessage?: string;
  status?: TextareaStatus;
  size?: TextareaSize;
  resize?: TextareaResize;
  autoResize?: boolean;
  fullWidth?: boolean;
}

function adjustHeight(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    errorMessage,
    status = 'default',
    size = 'md',
    resize = 'vertical',
    autoResize = false,
    fullWidth = false,
    disabled,
    readOnly,
    id: providedId,
    className,
    onInput,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref
) {
  const genId = useId();
  const id = providedId ?? genId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const effectiveStatus = errorMessage ? 'error' : status;
  const effectiveResize = autoResize ? 'none' : resize;
  const describedBy =
    [errorMessage ? errorId : null, hint ? hintId : null, ariaDescribedBy ?? null]
      .filter(Boolean)
      .join(' ') || undefined;

  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const callbackRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    },
    [ref]
  );

  useEffect(() => {
    if (autoResize && internalRef.current) {
      adjustHeight(internalRef.current);
    }
  }, [autoResize]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (autoResize) adjustHeight(e.currentTarget);
    onInput?.(e);
  };

  return (
    <div className={cx(styles.root, fullWidth && styles.fullWidth, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {rest.required && (
            <span className={styles.required} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div
        className={cx(
          styles.wrapper,
          styles[`size-${size}`],
          styles[`status-${effectiveStatus}`],
          styles[`resize-${effectiveResize}`],
          disabled && styles.disabled,
          readOnly && styles.readOnly
        )}
      >
        <textarea
          ref={callbackRef}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={effectiveStatus === 'error' ? true : undefined}
          aria-describedby={describedBy}
          className={styles.textarea}
          onInput={handleInput}
          {...rest}
        />
      </div>
      {errorMessage && (
        <p id={errorId} className={cx(styles.hint, styles.hintError)} role="alert">
          {errorMessage}
        </p>
      )}
      {!errorMessage && hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
