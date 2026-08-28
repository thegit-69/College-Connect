const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-amber-50 text-amber-800 border-amber-200',
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  black: 'bg-black text-white border-black',
}

const statusColorMap = {
  OPEN: 'green',
  UPCOMING: 'blue',
  CLOSED: 'red',
  COMPLETED: 'gray',
  OFFLINE: 'gray',
  ONLINE: 'purple',
  HYBRID: 'teal',
  APPROVED: 'green',
  PENDING: 'yellow',
  REJECTED: 'red',
}

export default function Badge({ children, color, variant = 'status', className = '', size = 'md' }) {
  const resolvedColor = color || statusColorMap[children] || 'gray'
  const colorClasses = colorMap[resolvedColor] || colorMap.gray
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-md
        border tracking-wide uppercase
        ${sizeClass} ${colorClasses} ${className}
      `}
    >
      {children}
    </span>
  )
}
