import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Tabs.module.css';

export type TabsOrientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (v: string) => void;
  orientation: TabsOrientation;
  baseId: string;
  lazy: boolean;
  registeredTabs: React.MutableRefObject<string[]>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab/TabPanel must be used inside <Tabs>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  orientation?: TabsOrientation;
  /** Only render the active panel's content */
  lazy?: boolean;
  children: ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onChange,
  orientation = 'horizontal',
  lazy = false,
  className,
  children,
  ...rest
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const baseId = useId();
  const registeredTabs = useRef<string[]>([]);

  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const setActiveValue = useCallback(
    (v: string) => {
      if (controlledValue === undefined) setInternalValue(v);
      onChange?.(v);
    },
    [controlledValue, onChange]
  );

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue, orientation, baseId, lazy, registeredTabs }}>
      <div
        className={cx(styles.root, styles[`orientation-${orientation}`], className)}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// TabList
// ---------------------------------------------------------------------------

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabList({ className, children, ...rest }: TabListProps) {
  const { orientation } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cx(styles.tabList, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab
// ---------------------------------------------------------------------------

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export function Tab({ value, disabled = false, className, children, onKeyDown, ...rest }: TabProps) {
  const { activeValue, setActiveValue, orientation, baseId, registeredTabs } = useTabsContext();
  const isActive = activeValue === value;

  if (!registeredTabs.current.includes(value)) {
    registeredTabs.current.push(value);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const tabs = registeredTabs.current;
    const currentIndex = tabs.indexOf(value);
    if (currentIndex === -1) return;

    const isHorizontal = orientation === 'horizontal';
    const prev = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    let target = -1;
    if (e.key === prev) {
      e.preventDefault();
      target = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    } else if (e.key === next) {
      e.preventDefault();
      target = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      target = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      target = tabs.length - 1;
    }

    if (target !== -1) {
      document.getElementById(`${baseId}-tab-${tabs[target]}`)?.focus();
      setActiveValue(tabs[target]);
    }

    onKeyDown?.(e);
  };

  return (
    <button
      id={`${baseId}-tab-${value}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cx(styles.tab, isActive && styles.tabActive, disabled && styles.tabDisabled, className)}
      onClick={() => !disabled && setActiveValue(value)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// TabPanel
// ---------------------------------------------------------------------------

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function TabPanel({ value, className, children, ...rest }: TabPanelProps) {
  const { activeValue, baseId, lazy } = useTabsContext();
  const isActive = activeValue === value;

  if (lazy && !isActive) return null;

  return (
    <div
      id={`${baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={cx(styles.tabPanel, isActive && styles.tabPanelActive, className)}
      {...rest}
    >
      {children}
    </div>
  );
}
