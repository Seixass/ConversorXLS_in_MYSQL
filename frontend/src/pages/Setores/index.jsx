import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useHubData } from '../../context/HubDataContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import TextField from '../../components/forms/TextField'

function NovoSetorForm({ onSalvar, onCancelar }) {
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setErro('')
    setSalvando(true)
    try {
      await onSalvar({ nome: nome.trim() })
    } catch (err) {
      setErro(err.errors?.nome?.[0] ?? err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField label="Nome do setor" value={nome} onChange={e => setNome(e.target.value)} required autoFocus />
      {erro && <p className="text-sm text-rose-600 dark:text-rose-400">{erro}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" disabled={salvando}>{salvando ? 'Criando...' : 'Criar setor'}</Button>
      </div>
    </form>
  )
}

export default function Setores() {
  const { setores, sistemas, criarSetor } = useHubData()
  const [modalAberto, setModalAberto] = useState(false)

  function contarSistemas(setorId) {
    return sistemas.filter(s => s.ativo && (s.global || s.setores?.some(st => st.id === setorId))).length
  }

  async function handleSalvar(dados) {
    await criarSetor(dados)
    setModalAberto(false)
  }

  return (
    <div>
      <PageHeader
        title="Setores"
        description="Setores da instituição — base para o acesso automático a sistemas exclusivos."
        action={
          <Button onClick={() => setModalAberto(true)}>
            <Plus className="h-4 w-4" />
            Novo setor
          </Button>
        }
      />

      <div className="glass-panel rounded-3xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-4 font-semibold">Setor</th>
              <th className="px-5 py-4 font-semibold">Funcionários</th>
              <th className="px-5 py-4 font-semibold">Sistemas disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {setores.map(setor => (
              <tr key={setor.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-100">{setor.nome}</td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{setor.funcionarios_count}</td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{contarSistemas(setor.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <Modal title="Novo setor" onClose={() => setModalAberto(false)}>
          <NovoSetorForm onSalvar={handleSalvar} onCancelar={() => setModalAberto(false)} />
        </Modal>
      )}
    </div>
  )
}
