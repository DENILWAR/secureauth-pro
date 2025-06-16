import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Componente Card reutilizable con variantes, padding y animaciones
 * Incluye header, footer y diferentes estilos
 */

const Card = forwardRef(({
  children,
  className,
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  border = true,
  rounded = 'default',
  hover = false,
  clickable = false,
  onClick,
  ...props
}, ref) => {
  
  const baseClasses = clsx(
    // Base styles
    'bg-white transition-all duration-200',
    
    // Border styles
    {
      'border border-gray-200': border === true,
      'border-2 border-gray-300': border === 'thick',
      'border-0': border === false,
      'border border-purple-200': variant === 'primary',
      'border border-green-200': variant === 'success',
      'border border-red-200': variant === 'danger',
      'border border-yellow-200': variant === 'warning',
      'border border-blue-200': variant === 'info'
    },
    
    // Rounded styles
    {
      'rounded-lg': rounded === 'default',
      'rounded-md': rounded === 'sm',
      'rounded-xl': rounded === 'lg',
      'rounded-2xl': rounded === 'xl',
      'rounded-none': rounded === 'none'
    },
    
    // Shadow styles
    {
      'shadow-sm': shadow === 'sm',
      'shadow-md': shadow === 'default',
      'shadow-lg': shadow === 'lg',
      'shadow-xl': shadow === 'xl',
      'shadow-2xl': shadow === '2xl',
      'shadow-none': shadow === 'none'
    },
    
    // Padding styles
    {
      'p-4': padding === 'sm',
      'p-6': padding === 'default',
      'p-8': padding === 'lg',
      'p-0': padding === 'none'
    },
    
    // Variant styles
    {
      'bg-gradient-to-br from-purple-50 to-blue-50': variant === 'primary',
      'bg-gradient-to-br from-green-50 to-emerald-50': variant === 'success',
      'bg-gradient-to-br from-red-50 to-pink-50': variant === 'danger',
      'bg-gradient-to-br from-yellow-50 to-orange-50': variant === 'warning',
      'bg-gradient-to-br from-blue-50 to-cyan-50': variant === 'info',
      'bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700': variant === 'dark',
      'bg-transparent border-dashed': variant === 'dashed'
    },
    
    // Interactive styles
    {
      'hover:shadow-lg hover:-translate-y-1': hover && !clickable,
      'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:translate-y-0': clickable,
      'hover:border-purple-300': clickable && variant === 'primary',
      'hover:border-green-300': clickable && variant === 'success',
      'hover:border-red-300': clickable && variant === 'danger'
    },
    
    className
  );

  const CardComponent = clickable ? motion.div : 'div';
  const motionProps = clickable ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15 }
  } : {};

  return (
    <CardComponent
      ref={ref}
      className={baseClasses}
      onClick={clickable ? onClick : undefined}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = 'Card';

// Subcomponentes para mejor composición
const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('pb-4 border-b border-gray-200 last:border-b-0', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ children, className, as: Component = 'h3', ...props }, ref) => (
  <Component
    ref={ref}
    className={clsx('text-lg font-semibold text-gray-900 leading-tight', className)}
    {...props}
  >
    {children}
  </Component>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx('text-sm text-gray-600 mt-1', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ children, className, padding = true, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      'flex-1',
      {
        'py-4': padding,
        'py-0': !padding
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('pt-4 border-t border-gray-200 first:border-t-0', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Exportar componente principal y subcomponentes
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };