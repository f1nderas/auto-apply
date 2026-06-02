import { useEffect, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import './modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  // #region EFFECT
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);
  // #endregion

  if (!isOpen) return null;

  // #region STYLES
  const contentClass = cx('modal__content', className);
  // #endregion

  return (
    <div className="modal" onClick={onClose}>
      <div className={contentClass} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal__header">
            <span className="modal__title">{title}</span>
            <button className="modal__close" onClick={onClose}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export { Modal };
export type { ModalProps };
