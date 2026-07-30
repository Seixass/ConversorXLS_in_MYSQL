export default function SelectField({ label, error, children, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <select
        className="
          w-full rounded-2xl border border-slate-200
          bg-white px-4 py-3 text-sm outline-none
          transition focus:border-brand-500
          focus:ring-2 focus:ring-brand-500/20
          dark:border-slate-800 dark:bg-slate-900
        "
        {...props}
      >
        {children}
      </select>

      {error ? (
        <span className="text-xs text-rose-500">{error}</span>
      ) : null}
    </label>
  )
}
