import { forwardRef, useCallback, useEffect, useId, useRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    hint,
    error,
    indeterminate = false,
    disabled,
    id: providedId,
    className,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  forwardedRef
) {
  const genId = useId();
  const id = providedId ?? genId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const internalRef = useRef<HTMLInputElement>(null);

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  useEffect(() => {
    const el = internalRef.current;
    if (el) el.indeterminate = indeterminate;
  }, [indeterminate]);

  const describedBy =
    [error ? errorId : null, hint ? hintId : null, ariaDescribedBy ?? null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={cx(styles.root, disabled && styles.disabled, className)}>
      <label className={styles.label} htmlFor={id}>
        <input
          ref={setRef}
          type="checkbox"
          id={id}
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : undefined}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={styles.input}
          {...rest}
        />
        <span
          className={cx(
            styles.control,
            indeterminate && styles.indeterminate,
            error && styles.controlError
          )}
          aria-hidden="true"
        />
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
      {error && (
        <p id={errorId} className={cx(styles.hint, styles.hintError)} role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
