import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  hint?: string;
  errorMessage?: string;
  status?: InputStatus;
  size?: InputSize;
  /** Icon or text rendered before the input */
  startAdornment?: ReactNode;
  /** Icon or text rendered after the input */
  endAdornment?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    errorMessage,
    status = 'default',
    size = 'md',
    startAdornment,
    endAdornment,
    fullWidth = false,
    disabled,
    id: providedId,
    className,
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
  const describedBy =
    [errorMessage ? errorId : null, hint ? hintId : null, ariaDescribedBy ?? null]
      .filter(Boolean)
      .join(' ') || undefined;

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
          styles.inputWrapper,
          styles[`size-${size}`],
          styles[`status-${effectiveStatus}`],
          disabled && styles.disabled
        )}
      >
        {startAdornment && (
          <span className={styles.prefix} aria-hidden="true">
            {startAdornment}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={effectiveStatus === 'error' ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            styles.input,
            Boolean(startAdornment) && styles.hasPrefix,
            Boolean(endAdornment) && styles.hasSuffix
          )}
          {...rest}
        />
        {endAdornment && (
          <span className={styles.suffix} aria-hidden="true">
            {endAdornment}
          </span>
        )}
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

Input.displayName = 'Input';
