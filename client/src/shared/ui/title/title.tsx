import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import './title.scss';

interface TitleProps {
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  children: ReactNode;
}

const Title = ({ as: Tag = 'h1', className, children }: TitleProps) => (
  <Tag className={cx('title', className)}>{children}</Tag>
);

export { Title };
export type { TitleProps };
