import type { ReactElement, ReactNode } from 'react';
import MuiTooltip from '@mui/material/Tooltip';
import './tooltip.scss';

interface TooltipProps {
  /** Содержимое тултипа. Если null/undefined — тултип не показывается. */
  content: ReactNode;
  children: ReactElement;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  if (!content) return children;

  return (
    <MuiTooltip
      title={content}
      arrow
      classes={{ tooltip: 'tooltip', arrow: 'tooltip__arrow' }}
    >
      {/* span нужен чтобы тултип работал на disabled-кнопке */}
      <span className="tooltip__trigger">{children}</span>
    </MuiTooltip>
  );
};

export { Tooltip };
