import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Radio.module.css';

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  children: ReactNode;
}

export function RadioGroup({
  name,
  value,
  onChange,
  label,
  orientation = 'vertical',
  disabled,
  children,
  className,
  ...rest
}: RadioGroupProps) {
  const labelId = useId();

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        className={cx(styles.group, styles[`orientation-${orientation}`], className)}
        {...rest}
      >
        {label && (
          <span id={labelId} className={styles.groupLabel}>
            {label}
          </span>
        )}
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

RadioGroup.displayName = 'RadioGroup';

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  value: string;
  label?: string;
  hint?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    label,
    hint,
    error,
    disabled,
    id: providedId,
    className,
    onChange,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref
) {
  const group = useContext(RadioGroupContext);
  const genId = useId();
  const id = providedId ?? genId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const isDisabled = group?.disabled ?? disabled;

  const describedBy =
    [error ? errorId : null, hint ? hintId : null, ariaDescribedBy ?? null]
      .filter(Boolean)
      .join(' ') || undefined;

  // When group is controlled, override name and checked
  const groupProps = group
    ? {
        name: group.name,
        ...(group.value !== undefined && { checked: group.value === value }),
      }
    : {};

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) group?.onChange?.(value);
      onChange?.(e);
    },
    [group, onChange, value]
  );

  return (
    <div className={cx(styles.root, isDisabled && styles.disabled, className)}>
      <label className={styles.label} htmlFor={id}>
        <input
          ref={ref}
          type="radio"
          id={id}
          value={value}
          disabled={isDisabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={styles.input}
          onChange={handleChange}
          {...rest}
          {...groupProps}
        />
        <span className={cx(styles.control, error && styles.controlError)} aria-hidden="true" />
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

Radio.displayName = 'Radio';
