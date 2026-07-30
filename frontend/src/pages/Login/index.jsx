import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import TextField from '../../components/forms/TextField'
import Footer from '../../components/layout/Footer'
import { useAuth } from '../../context/AuthContext'
import { PAPEL_LABEL } from '../../utils/permissoes'

// Senha e e-mails do seeder do backend (HubDemoSeeder) — só usados nos atalhos de dev abaixo.
const SENHA_MOCK = '123456'
const EMAIL_ATALHO = {
  funcionario: 'ana.lima@exemplo.local',
  gestor: 'carlos.rocha@exemplo.local',
  admin: 'juliana.prado@exemplo.local',
}

export default function Login() {
  const { login, entrando } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', senha: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const destino = location.state?.from?.pathname ?? '/'

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await login(form.email, form.senha)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAtalho(papel) {
    setError('')
    try {
      await login(EMAIL_ATALHO[papel], SENHA_MOCK)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 flex items-center justify-center">

      {/* EFEITOS DE FUNDO */}
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-slate-900/10 blur-3xl dark:bg-white/10" />

      {/* CONTAINER */}
      <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col">

        {/* CARD LOGIN */}
        <div className="relative glass-panel w-full rounded-[2rem] sm:rounded-[2.5rem] p-6 shadow-xl border border-white/20 bg-white dark:bg-slate-900 sm:p-10 lg:p-14">

          {/* HEADER */}
          <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left gap-4 sm:gap-5">
            <div className="order-2 sm:order-1 sm:mt-9">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-brand-500">
                Hub Ronda no Bairro
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Acesso Centralizado
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                Entre com suas credenciais para acessar os sistemas.
              </p>
            </div>

            <img
              src={`${import.meta.env.BASE_URL}logo-programa.png`}
              alt="Hub Ronda no Bairro"
              className="order-1 sm:order-2 h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-2xl bg-slate-50 p-2 shadow-inner object-contain"
            />
          </div>

          {/* ERRO */}
          {error && (
            <div className="mb-5 sm:mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* FORMULÁRIO */}
          <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
            <TextField
              label="E-mail"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="relative">
              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={form.senha}
                onChange={e => setForm({ ...form, senha: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute bottom-3.5 right-4 text-slate-400 hover:text-brand-500 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5 sm:h-[22px] sm:w-[22px]" /> : <Eye className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={entrando}
              className="w-full rounded-2xl bg-brand-500 py-4 sm:py-5 text-sm sm:text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {entrando ? 'Entrando...' : 'Entrar agora'}
            </button>
          </form>

          {/* ESBOÇO — LOGIN RÁPIDO (só em ambiente de desenvolvimento, some no build de produção) */}
          {import.meta.env.DEV && (
            <div className="mt-8 sm:mt-9 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Esboço — login rápido
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Dados fictícios. Senha de teste: <code className="font-mono">{SENHA_MOCK}</code>
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {Object.keys(EMAIL_ATALHO).map(papel => (
                  <button
                    key={papel}
                    type="button"
                    onClick={() => handleAtalho(papel)}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Entrar como {PAPEL_LABEL[papel]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-9 text-center">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}
