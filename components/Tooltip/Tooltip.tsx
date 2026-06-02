import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/token.utils';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  placement?: TooltipPlacement;
  /** Delay in ms before the tooltip appears */
  delay?: number;
  children: ReactElement;
}

export function Tooltip({ content, placement = 'top', delay = 0, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (delay > 0) {
      timerRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  const child = Children.only(children);
  if (!isValidElement(child)) return child;

  const trigger = cloneElement(child as ReactElement<Record<string, unknown>>, {
    'aria-describedby': visible ? tooltipId : undefined,
  });

  return (
    <span
      className={styles.root}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        className={cx(styles.tooltip, styles[`placement-${placement}`], visible && styles.visible)}
      >
        {content}
      </span>
    </span>
  );
}
