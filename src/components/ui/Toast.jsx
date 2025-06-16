import { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Componente Toast reutilizable con diferentes tipos y posiciones
 * Incluye auto-dismiss, acciones y animaciones
 */

const Toast = forwardRef(({
  isVisible = false,
  type = 'info',
  title,
  message,
  duration = 5000,
  position = 'top-right',
  dismissible = true,
  onDismiss,
  action,
  actionLabel,
  onAction,
  className,
  ...props
}, ref) => {
  
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (!isShowing || duration === 0) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isShowing, duration]);

  const handleDismiss = () => {
    setIsShowing(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300); // Wait for exit animation
  };

  const handleAction = () => {
    onAction?.();
    handleDismiss();
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-white',
      borderColor: 'border-green-200',
      accentColor: 'border-l-green-500'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-white',
      borderColor: 'border-red-200',
      accentColor: 'border-l-red-500'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-white',
      borderColor: 'border-yellow-200',
      accentColor: 'border-l-yellow-500'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200',
      accentColor: 'border-l-blue-500'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const toastClasses = clsx(
    // Base styles
    'fixed z-50 max-w-md w-full pointer-events-auto',
    'rounded-lg border border-l-4 shadow-lg',
    'backdrop-blur-sm',
    
    // Position
    positionClasses[position],
    
    // Type-specific styles
    config.bgColor,
    config.borderColor,
    config.accentColor,
    
    className
  );

  const contentClasses = clsx(
    'p-4 flex items-start gap-3'
  );

  const iconClasses = clsx(
    'w-5 h-5 flex-shrink-0 mt-0.5',
    config.iconColor
  );

  const textClasses = clsx(
    'flex-1 min-w-0'
  );

  const titleClasses = clsx(
    'text-sm font-medium text-gray-900 leading-5'
  );

  const messageClasses = clsx(
    'text-sm text-gray-600 mt-1 leading-5'
  );

  const actionsClasses = clsx(
    'flex items-center gap-2 mt-3'
  );

  const actionButtonClasses = clsx(
    'text-sm font-medium text-purple-600 hover:text-purple-700',
    'transition-colors duration-200'
  );

  const dismissButtonClasses = clsx(
    'flex-shrink-0 p-1 rounded-md',
    'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500'
  );

  // Animation variants
  const variants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: position.includes('top') ? -20 : 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: position.includes('top') ? -20 : 20
    }
  };

  if (!isShowing) return null;

  return createPortal(
    <AnimatePresence>
      {isShowing && (
        <motion.div
          ref={ref}
          className={toastClasses}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.3,
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          {...props}
        >
          <div className={contentClasses}>
            {/* Icon */}
            <IconComponent className={iconClasses} />
            
            {/* Content */}
            <div className={textClasses}>
              {title && (
                <div className={titleClasses}>
                  {title}
                </div>
              )}
              
              {message && (
                <div className={messageClasses}>
                  {message}
                </div>
              )}
              
              {/* Actions */}
              {(action || actionLabel) && (
                <div className={actionsClasses}>
                  <button
                    type="button"
                    className={actionButtonClasses}
                    onClick={handleAction}
                  >
                    {actionLabel || 'Action'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Dismiss Button */}
            {dismissible && (
              <button
                type="button"
                className={dismissButtonClasses}
                onClick={handleDismiss}
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

Toast.displayName = 'Toast';

export default Toast;