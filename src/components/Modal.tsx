import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import type { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    className="rounded-full p-2 hover:cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600"
    aria-label="Close details"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const rootModal = document.getElementById('root-modal');

  if (!rootModal) {
    throw new Error('#root-modal not found in DOM');
  }

  if (!isOpen) return null;

  return createPortal(
    <RemoveScroll>
      <div
        className="fixed inset-0 z-50 grid place-items-center bg-black/40"
        aria-modal="true"
        role="dialog"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        <FocusLock returnFocus={true} className="h-lvh py-6">
          <div
            className="max-h-full w-full max-w-xl overflow-hidden rounded-2xl bg-white p-10 shadow-lg outline-none"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <CloseButton onClose={onClose} />
            </div>
            {children}
          </div>
        </FocusLock>
      </div>
    </RemoveScroll>,
    rootModal,
  );
}

export default Modal;
