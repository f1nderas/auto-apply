import { cx } from '../../lib/cx';
import './textarea.scss';

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cx('textarea', className)} {...props} />
);

export { Textarea };
