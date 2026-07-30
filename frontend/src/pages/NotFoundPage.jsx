import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="mt-6 text-6xl font-bold text-slate-800 dark:text-white">404</h1>

        <h2 className="mt-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
          Página não encontrada
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          A página que você tentou acessar não existe, foi removida ou está indisponível no momento.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Voltar ao início
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Página anterior
          </button>
        </div>
      </div>
    </div>
  )
}
