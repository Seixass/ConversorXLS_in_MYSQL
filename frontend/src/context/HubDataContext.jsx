import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../lib/api'
import { isAdmin, isGestorOuAdmin } from '../utils/permissoes'

const HubDataContext = createContext(null)

export function HubDataProvider({ children }) {
  const { usuario, token, logout } = useAuth()

  const [setores, setSetores] = useState([])
  const [sistemas, setSistemas] = useState([]) // catálogo completo — só admin
  const [meusSistemas, setMeusSistemas] = useState([]) // sistemas visíveis ao usuário logado
  const [funcionarios, setFuncionarios] = useState([]) // só gestor/admin
  const [fila, setFila] = useState([]) // só gestor/admin
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // Envolve toda chamada autenticada: em 401 (token expirado/inválido), desloga em vez
  // de deixar a página tentando renderizar dados de um usuário que não está mais logado.
  const comToken = useCallback(async (fn, ...args) => {
    try {
      return await fn(token, ...args)
    } catch (err) {
      if (err.status === 401) logout()
      throw err
    }
  }, [token, logout])

  const carregarTudo = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const chamadas = [
        api.getSetores(token).then(setSetores),
        api.getSistemasVisiveis(token).then(setMeusSistemas),
      ]
      if (isAdmin(usuario)) {
        chamadas.push(api.getSistemas(token).then(setSistemas))
      }
      if (isGestorOuAdmin(usuario)) {
        chamadas.push(api.getFuncionarios(token).then(setFuncionarios))
        chamadas.push(api.getAprovacoes(token).then(setFila))
      }
      await Promise.all(chamadas)
    } catch (err) {
      if (err.status === 401) {
        logout()
      } else {
        setErro('Não foi possível carregar os dados do Hub. Tente recarregar a página.')
      }
    } finally {
      setCarregando(false)
    }
  }, [usuario, token, logout])

  useEffect(() => {
    if (usuario) {
      carregarTudo()
    } else {
      setSetores([])
      setSistemas([])
      setMeusSistemas([])
      setFuncionarios([])
      setFila([])
      setErro(null)
      setCarregando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  async function criarSetor(dados) {
    await comToken(api.criarSetor, dados)
    await carregarTudo()
  }

  async function criarSistema(dados) {
    await comToken(api.criarSistema, dados)
    await carregarTudo()
  }

  async function toggleSistemaAtivo(id) {
    await comToken(api.toggleSistemaAtivo, id)
    await carregarTudo()
  }

  async function aprovarPendente(id) {
    await comToken(api.aprovar, id)
    await carregarTudo()
  }

  async function recusarPendente(id) {
    await comToken(api.recusar, id)
    await carregarTudo()
  }

  async function promoverParaGestor(funcionarioId) {
    await comToken(api.promoverFuncionario, funcionarioId)
    await carregarTudo()
  }

  async function rebaixarParaFuncionario(funcionarioId) {
    await comToken(api.rebaixarFuncionario, funcionarioId)
    await carregarTudo()
  }

  return (
    <HubDataContext.Provider value={{
      setores,
      sistemas,
      meusSistemas,
      funcionarios,
      fila,
      carregando,
      erro,
      criarSetor,
      criarSistema,
      toggleSistemaAtivo,
      aprovarPendente,
      recusarPendente,
      promoverParaGestor,
      rebaixarParaFuncionario,
    }}>
      {children}
    </HubDataContext.Provider>
  )
}

export function useHubData() {
  return useContext(HubDataContext)
}
