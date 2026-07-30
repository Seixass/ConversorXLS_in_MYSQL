const VARIANTS = {
  brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
  green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full px-2.5 py-0.5
      text-xs font-semibold
      ${VARIANTS[variant] ?? VARIANTS.slate} ${className}
    `}>
      {children}
    </span>
  )
}
