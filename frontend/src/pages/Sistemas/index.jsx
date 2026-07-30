import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useHubData } from '../../context/HubDataContext'
import { errorModal } from '../../lib/alerts'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import TextField from '../../components/forms/TextField'

function NovoSistemaForm({ setores, onSalvar, onCancelar }) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [cor, setCor] = useState('#00008b')
  const [global, setGlobal] = useState(false)
  const [setoresIds, setSetoresIds] = useState([])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  function toggleSetor(id) {
    setSetoresIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setErro('')
    setSalvando(true)
    try {
      await onSalvar({ nome: nome.trim(), descricao: descricao.trim(), cor, global, setores_ids: setoresIds })
    } catch (err) {
      setErro(err.errors?.nome?.[0] ?? err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField label="Nome do sistema" value={nome} onChange={e => setNome(e.target.value)} required />
      <TextField label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cor</span>
        <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="h-10 w-14 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer bg-transparent" />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" checked={global} onChange={e => setGlobal(e.target.checked)} className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
        Sistema global (acesso automático para todos os setores)
      </label>

      {!global && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Setores com acesso</p>
          <div className="flex flex-wrap gap-2">
            {setores.map(s => (
              <label key={s.id} className={`text-sm px-3 py-1.5 rounded-2xl border cursor-pointer transition-colors ${setoresIds.includes(s.id) ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-300' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="checkbox" className="hidden" checked={setoresIds.includes(s.id)} onChange={() => toggleSetor(s.id)} />
                {s.nome}
              </label>
            ))}
          </div>
        </div>
      )}

      {erro && <p className="text-sm text-rose-600 dark:text-rose-400">{erro}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" disabled={salvando}>{salvando ? 'Criando...' : 'Criar sistema'}</Button>
      </div>
    </form>
  )
}

export default function Sistemas() {
  const { sistemas, setores, toggleSistemaAtivo, criarSistema } = useHubData()
  const [modalAberto, setModalAberto] = useState(false)

  function nomesSetores(sistema) {
    return sistema.setores?.map(s => s.nome).join(', ') || '—'
  }

  async function handleSalvar(dados) {
    await criarSistema(dados)
    setModalAberto(false)
  }

  async function handleToggleAtivo(id) {
    try {
      await toggleSistemaAtivo(id)
    } catch (err) {
      errorModal('Não foi possível atualizar', err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Sistemas"
        description="Catálogo de sistemas do Hub — quem enxerga cada um e se está ativo."
        action={
          <Button onClick={() => setModalAberto(true)}>
            <Plus className="h-4 w-4" />
            Novo sistema
          </Button>
        }
      />

      <div className="glass-panel rounded-3xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-4 font-semibold">Sistema</th>
              <th className="px-5 py-4 font-semibold">Escopo</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {sistemas.map(sistema => (
              <tr key={sistema.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl shrink-0" style={{ backgroundColor: sistema.cor }} />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{sistema.nome}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs">{sistema.descricao}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {sistema.global ? <Badge variant="amber">Global</Badge> : <Badge variant="brand">{nomesSetores(sistema)}</Badge>}
                </td>
                <td className="px-5 py-4">
                  {sistema.ativo ? <Badge variant="green">Ativo</Badge> : <Badge variant="slate">Inativo</Badge>}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggleAtivo(sistema.id)}
                    className="text-xs font-semibold text-brand-500 hover:underline"
                  >
                    {sistema.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <Modal title="Novo sistema" onClose={() => setModalAberto(false)}>
          <NovoSistemaForm setores={setores} onSalvar={handleSalvar} onCancelar={() => setModalAberto(false)} />
        </Modal>
      )}
    </div>
  )
}
