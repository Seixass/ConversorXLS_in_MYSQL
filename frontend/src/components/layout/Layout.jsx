import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Footer from './Footer'
import LoadingScreen from '../ui/LoadingScreen'
import { useHubData } from '../../context/HubDataContext'

export default function Layout() {
  const { carregando, erro } = useHubData()

  if (carregando) return <LoadingScreen label="Carregando o Hub..." />

  return (
    <div className="page-shell flex min-h-screen">
      <Sidebar />
      <main className="flex flex-col flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8 xl:p-10 2xl:p-12">
        <Topbar />
        {erro && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {erro}
          </div>
        )}
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}
