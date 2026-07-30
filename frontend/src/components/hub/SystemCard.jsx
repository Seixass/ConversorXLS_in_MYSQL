import { ArrowUpRight } from 'lucide-react'
import Badge from '../ui/Badge'

export default function SystemCard({ sistema, onAbrir }) {
  const iniciais = sistema.nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()

  return (
    <div className="glass-panel rounded-3xl p-5 lg:p-6 flex flex-col gap-3 hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-soft"
          style={{ backgroundColor: sistema.cor }}
        >
          {iniciais}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 dark:text-white truncate">{sistema.nome}</p>
          {sistema.global ? (
            <Badge variant="amber">Global</Badge>
          ) : (
            <Badge variant="brand">{sistema.setorNome}</Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{sistema.descricao}</p>

      <button
        type="button"
        onClick={() => onAbrir(sistema)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        Abrir sistema
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  )
}
