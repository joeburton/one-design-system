import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Select.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectStatus = 'default' | 'error' | 'success' | 'warning';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export type SelectItem = SelectOption | SelectGroup;

function isSelectGroup(item: SelectItem): item is SelectGroup {
  return 'options' in item;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  errorMessage?: string;
  status?: SelectStatus;
  size?: SelectSize;
  /** Flat options or grouped options */
  options?: SelectItem[];
  placeholder?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      errorMessage,
      status = 'default',
      size = 'md',
      options,
      placeholder,
      fullWidth = false,
      disabled,
      id: providedId,
      className,
      children,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref
  ) {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    const effectiveStatus = errorMessage ? 'error' : status;
    const describedBy = [
      errorMessage ? errorId : null,
      hint ? hintId : null,
      ariaDescribedBy ?? null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cx(styles.root, fullWidth && styles.fullWidth, className)}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
            {rest.required && (
              <span className={styles.required} aria-hidden="true"> *</span>
            )}
          </label>
        )}

        <div
          className={cx(
            styles.wrapper,
            styles[`size-${size}`],
            styles[`status-${effectiveStatus}`],
            disabled && styles.disabled
          )}
        >
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={effectiveStatus === 'error' ? true : undefined}
            aria-describedby={describedBy}
            className={styles.select}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options
              ? options.map((item, i) =>
                  isSelectGroup(item) ? (
                    <optgroup key={i} label={item.label}>
                      {item.options.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    <option key={item.value} value={item.value} disabled={item.disabled}>
                      {item.label}
                    </option>
                  )
                )
              : children}
          </select>

          {/* Chevron icon */}
          <span className={styles.chevron} aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
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
  }
);

Select.displayName = 'Select';
