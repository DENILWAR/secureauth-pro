import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

/**
 * Componente Button reutilizable con variantes, tamaños y estados
 * Incluye animaciones y soporte para iconos
 */

const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  
  const baseClasses = clsx(
    // Base styles
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    
    // Variant styles
    {
      // Primary variant
      'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500': 
        variant === 'primary',
      
      // Secondary variant
      'bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500': 
        variant === 'secondary',
      
      // Outline variant
      'border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white focus:ring-purple-500': 
        variant === 'outline',
      
      // Ghost variant
      'text-gray-600 bg-transparent hover:bg-gray-100 focus:ring-gray-500': 
        variant === 'ghost',
      
      // Danger variant
      'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 focus:ring-red-500': 
        variant === 'danger',
      
      // Success variant
      'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 focus:ring-green-500': 
        variant === 'success',
      
      // Gradient variant
      'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-purple-500': 
        variant === 'gradient'
    },
    
    // Size styles
    {
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-2.5 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
      'px-8 py-4 text-xl': size === 'xl'
    },
    
    // Full width
    { 'w-full': fullWidth },
    
    className
  );

  const iconClasses = clsx(
    'flex-shrink-0',
    {
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md',
      'w-6 h-6': size === 'lg',
      'w-7 h-7': size === 'xl'
    }
  );

  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {/* Loading state */}
      {loading && (
        <Loader2 className={clsx(iconClasses, 'animate-spin')} />
      )}
      
      {/* Icon left */}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={iconClasses} />
      )}
      
      {/* Content */}
      {children}
      
      {/* Icon right */}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={iconClasses} />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;