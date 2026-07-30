import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { nomeSetor, isAdmin } from '../../utils/permissoes'
import { confirmModal, successModal, errorModal } from '../../lib/alerts'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'

export default function Aprovacoes() {
  const { usuario } = useAuth()
  const { fila, setores, aprovarPendente, recusarPendente } = useHubData()
  const admin = isAdmin(usuario)

  // A API já devolve só a fila do setor deste gestor (ou todas, se admin).
  const pendentes = fila

  async function handleAprovar(p) {
    try {
      await aprovarPendente(p.id)
      await successModal('Acesso aprovado', `${p.nome} agora tem acesso como funcionário.`)
    } catch (err) {
      errorModal('Não foi possível aprovar', err.message)
    }
  }

  async function handleRecusar(p) {
    const ok = await confirmModal({
      title: 'Recusar autocadastro',
      text: `Deseja recusar o cadastro de ${p.nome}? Esta ação não pode ser desfeita.`,
      confirmText: 'Recusar',
    })
    if (!ok) return

    try {
      await recusarPendente(p.id)
    } catch (err) {
      errorModal('Não foi possível recusar', err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Fila de Aprovação"
        description={admin
          ? 'Autocadastros pendentes de todos os setores.'
          : `Autocadastros pendentes do setor ${nomeSetor(setores, usuario.setor_gestao_id)}.`}
      />

      {pendentes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-400">
          Nenhum autocadastro pendente no momento.
        </div>
      ) : (
        <div className="space-y-3">
          {pendentes.map(p => (
            <div key={p.id} className="glass-panel rounded-3xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-100">{p.nome}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">{p.email}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Setor declarado: {p.setor?.nome ?? '—'} &middot; solicitado em {new Date(p.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="secondary" onClick={() => handleRecusar(p)}>Recusar</Button>
                <Button onClick={() => handleAprovar(p)}>Aprovar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
