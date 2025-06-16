import { useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

/**
 * Componente Modal reutilizable con animaciones y diferentes tamaños
 * Incluye overlay, backdrop blur y gestión de foco
 */

const Modal = forwardRef(({
  isOpen = false,
  onClose,
  children,
  className,
  size = 'md',
  centered = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  backdrop = 'blur',
  animation = 'scale',
  ...props
}, ref) => {
  
  // Manejar tecla Escape
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const overlayClasses = clsx(
    'fixed inset-0 z-50 flex items-center justify-center p-4',
    {
      'items-center': centered,
      'items-start pt-20': !centered,
      'bg-black/50': backdrop === 'dark',
      'bg-white/20 backdrop-blur-sm': backdrop === 'blur',
      'bg-black/80 backdrop-blur-md': backdrop === 'dark-blur'
    }
  );

  const modalClasses = clsx(
    'relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden',
    'focus:outline-none',
    {
      'w-full max-w-sm': size === 'xs',
      'w-full max-w-md': size === 'sm',
      'w-full max-w-lg': size === 'md',
      'w-full max-w-2xl': size === 'lg',
      'w-full max-w-4xl': size === 'xl',
      'w-full max-w-6xl': size === '2xl',
      'w-full max-w-screen-lg': size === 'full'
    },
    className
  );

  const closeButtonClasses = clsx(
    'absolute top-4 right-4 z-10 p-2 rounded-full',
    'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500'
  );

  // Variantes de animación
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    },
    slideUp: {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 }
    },
    slideDown: {
      hidden: { y: -50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 }
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    }
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleCloseClick = () => {
    onClose?.();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={overlayClasses}
          onClick={handleOverlayClick}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={ref}
            className={modalClasses}
            variants={modalVariants[animation]}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                type="button"
                className={closeButtonClasses}
                onClick={handleCloseClick}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

Modal.displayName = 'Modal';

// Subcomponentes para mejor composición
const ModalHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4 border-b border-gray-200', className)}
    {...props}
  >
    {children}
  </div>
));

ModalHeader.displayName = 'ModalHeader';

const ModalTitle = forwardRef(({ children, className, as: Component = 'h2', ...props }, ref) => (
  <Component
    ref={ref}
    className={clsx('text-lg font-semibold text-gray-900 leading-6', className)}
    {...props}
  >
    {children}
  </Component>
));

ModalTitle.displayName = 'ModalTitle';

const ModalDescription = forwardRef(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx('text-sm text-gray-600 mt-1', className)}
    {...props}
  >
    {children}
  </p>
));

ModalDescription.displayName = 'ModalDescription';

const ModalBody = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
));

ModalBody.displayName = 'ModalBody';

const ModalFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3', className)}
    {...props}
  >
    {children}
  </div>
));

ModalFooter.displayName = 'ModalFooter';

// Exportar componente principal y subcomponentes
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
export { ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };