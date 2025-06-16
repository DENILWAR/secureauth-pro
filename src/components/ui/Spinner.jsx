import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

/**
 * Componente Spinner reutilizable con diferentes variantes y tamaños
 * Incluye múltiples animaciones y estilos
 */

const Spinner = forwardRef(({
  className,
  size = 'md',
  variant = 'default',
  color = 'primary',
  speed = 'normal',
  label,
  showLabel = false,
  center = false,
  overlay = false,
  ...props
}, ref) => {
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-purple-600',
    secondary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white',
    gray: 'text-gray-600',
    current: 'text-current'
  };

  const speedSettings = {
    slow: 2,
    normal: 1,
    fast: 0.5
  };

  const baseClasses = clsx(
    'animate-spin',
    sizeClasses[size],
    colorClasses[color],
    className
  );

  const containerClasses = clsx(
    'inline-flex items-center gap-2',
    {
      'justify-center w-full': center,
      'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center': overlay
    }
  );

  const labelClasses = clsx(
    'text-sm font-medium',
    colorClasses[color]
  );

  // Diferentes variantes de spinners
  const SpinnerVariant = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={clsx('flex space-x-1', sizeClasses[size])}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={clsx(
                  'rounded-full',
                  colorClasses[color],
                  {
                    'w-1 h-1': size === 'xs',
                    'w-1.5 h-1.5': size === 'sm',
                    'w-2 h-2': size === 'md',
                    'w-3 h-3': size === 'lg',
                    'w-4 h-4': size === 'xl',
                    'w-6 h-6': size === '2xl'
                  }
                )}
                style={{ backgroundColor: 'currentColor' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: speedSettings[speed],
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={clsx(
              'rounded-full border-2 border-current',
              sizeClasses[size],
              colorClasses[color]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: speedSettings[speed] * 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        );

      case 'ring':
        return (
          <motion.div
            className={clsx(
              'rounded-full border-2 border-gray-200',
              sizeClasses[size]
            )}
            style={{
              borderTopColor: 'currentColor'
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: speedSettings[speed],
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        );

      case 'bars':
        return (
          <div className={clsx('flex space-x-1', sizeClasses[size])}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={clsx(
                  colorClasses[color],
                  {
                    'w-0.5': size === 'xs',
                    'w-1': size === 'sm' || size === 'md',
                    'w-1.5': size === 'lg',
                    'w-2': size === 'xl',
                    'w-3': size === '2xl'
                  }
                )}
                style={{
                  backgroundColor: 'currentColor',
                  height: '100%'
                }}
                animate={{
                  scaleY: [1, 2, 1]
                }}
                transition={{
                  duration: speedSettings[speed],
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        );

      case 'gradient':
        return (
          <motion.div
            className={clsx(
              'rounded-full bg-gradient-to-r from-purple-500 to-pink-500',
              sizeClasses[size]
            )}
            animate={{ rotate: 360 }}
            transition={{
              duration: speedSettings[speed],
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              background: 'conic-gradient(from 0deg, transparent, currentColor, transparent)'
            }}
          />
        );

      default:
        return (
          <Loader2
            className={baseClasses}
            style={{
              animationDuration: `${speedSettings[speed]}s`
            }}
          />
        );
    }
  };

  const content = (
    <div className={containerClasses}>
      <SpinnerVariant />
      {(showLabel || label) && (
        <span className={labelClasses}>
          {label || 'Loading...'}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return content;
  }

  return (
    <div ref={ref} {...props}>
      {content}
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;