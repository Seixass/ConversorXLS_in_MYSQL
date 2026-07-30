import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { nomeSetor, PAPEL_LABEL, isGestor } from '../../utils/permissoes'
import Button from '../../components/ui/Button'

export default function Perfil() {
  const { usuario, logout } = useAuth()
  const { setores } = useHubData()

  return (
    <div className="max-w-sm mx-auto text-center">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Meu Perfil</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 md:text-base">Seus dados de acesso ao Hub.</p>

      <div className="glass-panel rounded-3xl p-8 mt-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {usuario.iniciais}
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">{usuario.nome}</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">{usuario.email}</p>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {PAPEL_LABEL[usuario.papel]} &middot; {nomeSetor(setores, usuario.setor_id)}
        </p>
        {isGestor(usuario) && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Gestão do setor {nomeSetor(setores, usuario.setor_gestao_id)}
          </p>
        )}

        <Button variant="secondary" onClick={logout} className="mt-6 w-full justify-center">Sair do Hub</Button>
      </div>
    </div>
  )
}
