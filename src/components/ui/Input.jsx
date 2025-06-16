import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

/**
 * Componente Input reutilizable con validación, iconos y estados
 * Soporte para diferentes tipos y estilos
 */

const Input = forwardRef(({
  className,
  type = 'text',
  size = 'md',
  variant = 'default',
  label,
  placeholder,
  error,
  success,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled = false,
  required = false,
  fullWidth = false,
  showPasswordToggle = false,
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasSuccess = !!success;
  const hasLeftIcon = !!LeftIcon;
  const hasRightIcon = !!RightIcon || showPasswordToggle || hasError || hasSuccess;

  const containerClasses = clsx(
    'relative',
    {
      'w-full': fullWidth,
      'w-auto': !fullWidth
    }
  );

  const labelClasses = clsx(
    'block text-sm font-medium mb-2 transition-colors duration-200',
    {
      'text-gray-700': !hasError && !hasSuccess,
      'text-red-600': hasError,
      'text-green-600': hasSuccess,
      'opacity-50': disabled
    }
  );

  const inputClasses = clsx(
    // Base styles
    'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
    'placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    
    // Size styles
    {
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-2.5 text-base': size === 'md',
      'px-5 py-3 text-lg': size === 'lg'
    },
    
    // Icon padding
    {
      'pl-10': hasLeftIcon && size === 'sm',
      'pl-11': hasLeftIcon && size === 'md',
      'pl-12': hasLeftIcon && size === 'lg',
      'pr-10': hasRightIcon && size === 'sm',
      'pr-11': hasRightIcon && size === 'md',
      'pr-12': hasRightIcon && size === 'lg'
    },
    
    // Variant and state styles
    {
      // Default variant
      'border-gray-300 bg-white text-gray-900 focus:border-purple-500 focus:ring-purple-500': 
        variant === 'default' && !hasError && !hasSuccess,
      
      // Outline variant
      'border-2 border-gray-300 bg-transparent text-gray-900 focus:border-purple-500 focus:ring-purple-500': 
        variant === 'outline' && !hasError && !hasSuccess,
      
      // Filled variant
      'border-0 bg-gray-100 text-gray-900 focus:bg-white focus:ring-purple-500 focus:shadow-md': 
        variant === 'filled' && !hasError && !hasSuccess,
      
      // Error state
      'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500': hasError,
      'bg-red-50': hasError && variant === 'filled',
      
      // Success state
      'border-green-300 text-green-900 focus:border-green-500 focus:ring-green-500': hasSuccess,
      'bg-green-50': hasSuccess && variant === 'filled',
      
      // Focused state
      'ring-2': isFocused
    },
    
    className
  );

  const iconClasses = clsx(
    'absolute top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200',
    {
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md',
      'w-6 h-6': size === 'lg',
      'text-red-500': hasError,
      'text-green-500': hasSuccess && !RightIcon,
      'text-purple-500': isFocused && !hasError && !hasSuccess
    }
  );

  const leftIconClasses = clsx(iconClasses, {
    'left-3': size === 'sm',
    'left-3.5': size === 'md',
    'left-4': size === 'lg'
  });

  const rightIconClasses = clsx(iconClasses, {
    'right-3': size === 'sm',
    'right-3.5': size === 'md',
    'right-4': size === 'lg'
  });

  const helperTextClasses = clsx(
    'mt-2 text-sm transition-colors duration-200',
    {
      'text-gray-600': !hasError && !hasSuccess,
      'text-red-600': hasError,
      'text-green-600': hasSuccess
    }
  );

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <LeftIcon className={leftIconClasses} />
        )}
        
        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {/* Right Icon/Status */}
        <div className={rightIconClasses}>
          {hasError && !RightIcon ? (
            <AlertCircle className="w-full h-full" />
          ) : hasSuccess && !RightIcon ? (
            <Check className="w-full h-full" />
          ) : type === 'password' && showPasswordToggle ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-full h-full" />
              ) : (
                <Eye className="w-full h-full" />
              )}
            </button>
          ) : RightIcon ? (
            <RightIcon className="w-full h-full" />
          ) : null}
        </div>
      </div>
      
      {/* Helper Text */}
      {(helperText || error || success) && (
        <p className={helperTextClasses}>
          {error || success || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;