import { MoonStar, SunMedium, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { PAPEL_LABEL } from '../../utils/permissoes'
import { confirmModal, successModal } from '../../lib/alerts'

export default function Topbar() {
  const { usuario, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const approved = await confirmModal({
      title: 'Encerrar sessão',
      text: 'Deseja realmente sair do Hub?',
      confirmText: 'Sair'
    })

    if (!approved) return

    logout()

    await successModal('Sessão encerrada', 'Você saiu com segurança.')

    navigate('/login', { replace: true })
  }

  return (
    <header className="glass-panel mb-6 flex flex-col gap-4 rounded-3xl px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-7 lg:py-5 xl:mb-8">

      {/* USUÁRIO LOGADO */}
      <div className="flex items-center gap-3 lg:gap-4">
        <img
          src={`${import.meta.env.BASE_URL}logo-programa.png`}
          alt="Hub Ronda no Bairro"
          className="h-12 w-12 rounded-2xl bg-white p-1 shadow-sm lg:h-14 lg:w-14"
        />
        <div>
          <p className="text-base text-slate-500 dark:text-slate-400 lg:text-lg">
            Bem-vindo
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 lg:text-base">
            Usuário logado: {usuario?.email}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold lg:text-xl">
              {usuario?.nome}
            </h2>
            <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-200 lg:text-sm">
              {usuario ? PAPEL_LABEL[usuario.papel] : ''}
            </span>
          </div>
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 lg:px-5 lg:py-2.5 lg:text-base"
        >
          {theme === 'dark' ? (
            <SunMedium className="h-4 w-4 lg:h-5 lg:w-5" />
          ) : (
            <MoonStar className="h-4 w-4 lg:h-5 lg:w-5" />
          )}
          Tema
        </button>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 lg:px-5 lg:py-2.5 lg:text-base"
        >
          <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
          Sair
        </button>
      </div>
    </header>
  )
}
