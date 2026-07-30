import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { HubDataProvider } from './context/HubDataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isAdmin, isGestorOuAdmin } from './utils/permissoes'
import LoadingScreen from './components/ui/LoadingScreen'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Perfil from './pages/Perfil'
import Funcionarios from './pages/Funcionarios'
import Aprovacoes from './pages/Aprovacoes'
import Sistemas from './pages/Sistemas'
import Setores from './pages/Setores'
import NotFoundPage from './pages/NotFoundPage'

function RequireAuth({ children }) {
  const { usuario, carregando } = useAuth()
  const location = useLocation()
  if (carregando) return <LoadingScreen />
  if (!usuario) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function RequireGestorOuAdmin({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <LoadingScreen />
  if (!isGestorOuAdmin(usuario)) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <LoadingScreen />
  if (!isAdmin(usuario)) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <LoadingScreen />
  if (usuario) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Home />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="funcionarios" element={<RequireGestorOuAdmin><Funcionarios /></RequireGestorOuAdmin>} />
        <Route path="aprovacoes" element={<RequireGestorOuAdmin><Aprovacoes /></RequireGestorOuAdmin>} />
        <Route path="sistemas" element={<RequireAdmin><Sistemas /></RequireAdmin>} />
        <Route path="setores" element={<RequireAdmin><Setores /></RequireAdmin>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/hub">
        <AuthProvider>
          <HubDataProvider>
            <AppRoutes />
          </HubDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
