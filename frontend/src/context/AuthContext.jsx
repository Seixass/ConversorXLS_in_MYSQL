import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'hub_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [usuario, setUsuario] = useState(null)
  // Começa "carregando" quando há token salvo: precisa validar contra /auth/me antes de liberar a UI.
  // É só sobre esse bootstrap inicial — os guards de rota (RequireAuth/PublicRoute) dependem disso.
  const [carregando, setCarregando] = useState(() => !!localStorage.getItem(STORAGE_KEY))
  // Estado separado do login em si: se fosse o mesmo "carregando", o PublicRoute desmontaria a
  // página de Login no meio de uma tentativa (achando que ainda está checando sessão) e perderia
  // a mensagem de erro exibida logo em seguida.
  const [entrando, setEntrando] = useState(false)

  // Valida o token salvo (se houver) contra a API só uma vez, ao montar — login()/logout()
  // já atualizam "usuario" diretamente, sem precisar re-disparar isso.
  useEffect(() => {
    if (!token) return

    let cancelado = false

    api.me(token)
      .then(({ usuario }) => {
        if (!cancelado) setUsuario(usuario)
      })
      .catch(() => {
        if (!cancelado) {
          localStorage.removeItem(STORAGE_KEY)
          setToken(null)
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(email, senha) {
    setEntrando(true)
    try {
      const { token: novoToken, usuario: dadosUsuario } = await api.login(email, senha)
      localStorage.setItem(STORAGE_KEY, novoToken)
      setUsuario(dadosUsuario)
      setToken(novoToken)
      return dadosUsuario
    } finally {
      setEntrando(false)
    }
  }

  function logout() {
    if (token) api.logout(token).catch(() => {}) // stateless — melhor esforço, não bloqueia o logout local
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, carregando, entrando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
