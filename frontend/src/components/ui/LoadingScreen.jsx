export default function LoadingScreen({ label = 'Carregando...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-panel flex items-center gap-3 rounded-2xl px-5 py-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>
    </div>
  )
}
