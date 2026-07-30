import { NavLink } from 'react-router-dom'
import { LayoutGrid, UserCircle, Users, ClipboardCheck, Boxes, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { isAdmin, isGestorOuAdmin, PAPEL_LABEL } from '../../utils/permissoes'

const itemBase =
  'flex items-center gap-3 rounded-2xl px-4 py-3 lg:px-5 lg:py-3.5 text-sm lg:text-base font-medium transition'

function NavItem({ to, end, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${itemBase} ${
          isActive
            ? 'bg-brand-500 text-white shadow-soft'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`
      }
    >
      <Icon className="h-4 w-4 xl:h-5 xl:w-5" />
      <span className="flex-1">{label}</span>
      {!!badge && (
        <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { usuario } = useAuth()
  const { fila } = useHubData()
  const filaCount = fila.length // a API já devolve só a fila que este usuário pode ver
  const admin = isAdmin(usuario)
  const gestorOuAdmin = isGestorOuAdmin(usuario)

  // Seções por papel: Principal (todo mundo) → Gestão de Setor (gestor+admin) → Administração (só admin).
  const sections = [
    {
      title: 'Principal',
      items: [
        { to: '/', end: true, label: 'Meus Sistemas', icon: LayoutGrid },
        { to: '/perfil', end: false, label: 'Meu Perfil', icon: UserCircle },
      ],
    },
    {
      title: 'Gestão de Setor',
      items: gestorOuAdmin ? [
        { to: '/funcionarios', end: false, label: 'Funcionários', icon: Users },
        { to: '/aprovacoes', end: false, label: 'Fila de Aprovação', icon: ClipboardCheck, badge: filaCount },
      ] : [],
    },
    {
      title: 'Administração',
      items: admin ? [
        { to: '/sistemas', end: false, label: 'Sistemas', icon: Boxes },
        { to: '/setores', end: false, label: 'Setores', icon: Building2 },
      ] : [],
    },
  ].filter(section => section.items.length > 0)

  const navigation = sections.flatMap(section => section.items)

  const portalLabel = admin ? 'Administração' : gestorOuAdmin ? 'Gestão de Setor' : usuario ? PAPEL_LABEL[usuario.papel] : ''

  return (
    <>
      {/* ── Sidebar desktop ────────────────────────────────── */}
      <aside className="glass-panel hidden h-screen w-56 shrink-0 border-r p-4 lg:sticky lg:top-0 lg:block xl:w-64 xl:p-5 2xl:w-72 2xl:p-6">

        {/* LOGO TOPO */}
        <div className="mb-6 flex items-center gap-3 xl:mb-8">
          <img
            src={`${import.meta.env.BASE_URL}logo-programa.png`}
            alt="Hub Ronda no Bairro"
            className="h-14 w-14 rounded-2xl bg-white p-1 shadow-sm xl:h-16 xl:w-16"
          />
          <div>
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand-500 xl:text-sm">
              Hub Ronda no Bairro
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 xl:text-base">
              {portalLabel}
            </p>
          </div>
        </div>

        {/* MENU + LOGO RODAPÉ */}
        <div className="flex h-[calc(100%-80px)] flex-col justify-between">

          <nav className="space-y-5 overflow-y-auto xl:space-y-6">
            {sections.map(section => (
              <div key={section.title} className="space-y-2 xl:space-y-3">
                <p className="section-title px-4 xl:px-5">{section.title}</p>
                {section.items.map(item => <NavItem key={item.to} {...item} />)}
              </div>
            ))}
          </nav>

          {/* LOGO RODAPÉ */}
          <div className="mt-6 flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}Logo-seprev.png`}
              alt="Seprev"
              className="max-h-16 object-contain opacity-90 xl:max-h-20"
            />
          </div>
        </div>
      </aside>

      {/* ── Bottom nav mobile ─────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition',
                  isActive
                    ? 'text-brand-500'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className={[
                    'flex h-9 w-9 items-center justify-center rounded-xl transition',
                    isActive ? 'bg-brand-500/10' : ''
                  ].join(' ')}>
                    <Icon className={['h-5 w-5', isActive ? 'text-brand-500' : ''].join(' ')} />
                  </span>
                  <span className="text-[11px] font-medium leading-tight">
                    {item.label}
                  </span>
                  {!!item.badge && (
                    <span className="absolute top-0.5 right-1/2 translate-x-3 min-w-[1rem] h-4 px-1 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
