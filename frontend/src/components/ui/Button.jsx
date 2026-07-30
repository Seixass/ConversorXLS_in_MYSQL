const VARIANTS = {
  primary: 'bg-brand-500 text-white shadow-soft hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed',
}

export default function Button({ children, variant = 'primary', type = 'button', disabled, onClick, className = '' }) {
  const base = VARIANTS[variant] ?? VARIANTS.primary

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${base} ${className}`}
    >
      {children}
    </button>
  )
}
