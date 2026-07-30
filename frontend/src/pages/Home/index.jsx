import { useState } from 'react'
import { Wifi } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { nomeSetor } from '../../utils/permissoes'
import SystemCard from '../../components/hub/SystemCard'
import PageHeader from '../../components/ui/PageHeader'

// Endereços atuais dos sistemas na rede interna — ainda sem SSO real via token do Hub.
const URL_SISTEMA = {
  'ronda-social': 'http://192.168.200.3/rondasocial',
  'visita-segura': 'http://192.168.200.3/visitasegura',
}

export default function Home() {
  const { usuario } = useAuth()
  const { meusSistemas, setores } = useHubData()
  const [mensagem, setMensagem] = useState('')

  // Um sistema não-global só aparece aqui se for do setor do próprio usuário — a API já garante isso.
  const visiveis = meusSistemas.map(s => ({
    ...s,
    setorNome: nomeSetor(setores, usuario.setor_id),
  }))

  function handleAbrir(sistema) {
    const url = URL_SISTEMA[sistema.slug]
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    setMensagem(`"${sistema.nome}" ainda não tem endereço cadastrado no Hub.`)
  }

  return (
    <div>
      <PageHeader
        title="Meus Sistemas"
        description={`Olá, ${usuario.nome.split(' ')[0]}. Estes são os sistemas aos quais você tem acesso.`}
      />

      {visiveis.length > 0 && (
        <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
          <Wifi className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Os sistemas ficam na rede interna do PRB — conecte-se a ela antes de abrir.</span>
        </div>
      )}

      {mensagem && (
        <div className="mb-6 rounded-2xl border border-brand-500/20 bg-brand-500/5 px-4 py-3 text-sm text-brand-700 dark:text-brand-300 flex items-start justify-between gap-3">
          <span>{mensagem}</span>
          <button type="button" onClick={() => setMensagem('')} className="text-brand-500/60 hover:text-brand-500 shrink-0">✕</button>
        </div>
      )}

      {visiveis.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-400">
          Nenhum sistema disponível para o seu setor no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiveis.map(sistema => (
            <SystemCard key={sistema.id} sistema={sistema} onAbrir={handleAbrir} />
          ))}
        </div>
      )}
    </div>
  )
}
