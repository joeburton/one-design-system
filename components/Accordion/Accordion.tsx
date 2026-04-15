import { type HTMLAttributes, type ReactNode, createContext, useContext, useState, useId } from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Accordion.module.css';

export type AccordionVariant = 'default' | 'outlined' | 'flush';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AccordionVariant;
  allowMultiple?: boolean;
  defaultOpen?: string | string[];
  children: ReactNode;
}

export interface AccordionItemProps {
  id?: string;
  title: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion.Item must be used within Accordion');
  return ctx;
}

export function AccordionItem({
  id: idProp,
  title,
  disabled = false,
  children,
  className,
}: AccordionItemProps): JSX.Element {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const { openItems, toggle } = useAccordionContext();
  const isOpen = openItems.has(id);
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <div className={cx(styles.item, disabled && styles.itemDisabled, className)}>
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={disabled}
        className={styles.trigger}
        onClick={() => toggle(id)}
      >
        <span className={styles.triggerLabel}>{title}</span>
        <span className={cx(styles.chevron, isOpen && styles.chevronOpen)} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cx(styles.panel, isOpen && styles.panelOpen)}
      >
        <div className={styles.panelContent}>{children}</div>
      </div>
    </div>
  );
}

export function Accordion({
  variant = 'default',
  allowMultiple = false,
  defaultOpen,
  className,
  children,
  ...rest
}: AccordionProps): JSX.Element {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (!defaultOpen) return new Set();
    return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]);
  });

  function toggle(id: string) {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cx(styles.root, styles[`variant-${variant}`], className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'Accordion.Item';
