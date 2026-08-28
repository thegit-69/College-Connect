import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-black hover:bg-gray-800 text-white shadow-xs border border-black',
  secondary:
    'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200',
  outline:
    'border border-gray-200 hover:border-gray-400 text-gray-800 bg-white hover:bg-gray-50 shadow-xs',
  ghost:
    'hover:bg-gray-100 text-gray-700 bg-transparent',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-xs',
  blue:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-xs border border-primary-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        inline-flex items-center justify-center gap-1.5
        font-semibold rounded-lg transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}
      `}
      {...props}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </motion.button>
  )
}
