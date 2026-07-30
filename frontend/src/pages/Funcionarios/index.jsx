import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { nomeSetor, isAdmin, PAPEL_LABEL, PAPEL_BADGE_VARIANT } from '../../utils/permissoes'
import { errorModal } from '../../lib/alerts'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

export default function Funcionarios() {
  const { usuario } = useAuth()
  const { funcionarios, setores, promoverParaGestor, rebaixarParaFuncionario } = useHubData()
  const admin = isAdmin(usuario)
  const [filtroSetor, setFiltroSetor] = useState('todos')

  // A API já devolve só o que este usuário pode ver (próprio setor, ou tudo se admin).
  let lista = funcionarios
  if (admin && filtroSetor !== 'todos') {
    lista = lista.filter(f => f.setor_id === Number(filtroSetor))
  }

  async function handlePromover(id) {
    try {
      await promoverParaGestor(id)
    } catch (err) {
      errorModal('Não foi possível promover', err.message)
    }
  }

  async function handleRebaixar(id) {
    try {
      await rebaixarParaFuncionario(id)
    } catch (err) {
      errorModal('Não foi possível rebaixar', err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Funcionários"
        description={admin ? 'Todos os funcionários do Hub.' : `Funcionários do setor ${nomeSetor(setores, usuario.setor_gestao_id)}.`}
        action={admin && (
          <select
            value={filtroSetor}
            onChange={e => setFiltroSetor(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="todos">Todos os setores</option>
            {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
        )}
      />

      <div className="glass-panel rounded-3xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-4 font-semibold">Funcionário</th>
              <th className="px-5 py-4 font-semibold">Setor</th>
              <th className="px-5 py-4 font-semibold">Papel</th>
              {admin && <th className="px-5 py-4 font-semibold text-right">Ação</th>}
            </tr>
          </thead>
          <tbody>
            {lista.map(f => (
              <tr key={f.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {f.iniciais}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{f.nome}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{f.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{f.setor?.nome ?? '—'}</td>
                <td className="px-5 py-4">
                  <Badge variant={PAPEL_BADGE_VARIANT[f.papel]}>{PAPEL_LABEL[f.papel]}</Badge>
                </td>
                {admin && (
                  <td className="px-5 py-4 text-right">
                    {f.papel === 'funcionario' && (
                      <button type="button" onClick={() => handlePromover(f.id)} className="text-xs font-semibold text-brand-500 hover:underline">
                        Promover a gestor
                      </button>
                    )}
                    {f.papel === 'gestor' && (
                      <button type="button" onClick={() => handleRebaixar(f.id)} className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:underline">
                        Rebaixar a funcionário
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={admin ? 4 : 3} className="px-5 py-10 text-center text-sm text-slate-400">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
