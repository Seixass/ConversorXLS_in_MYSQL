const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

// Chama a API do Hub e faz o parse do envelope {success, data, message, errors}.
// Em respostas não-ok, lança Error com .status e .errors preenchidos (mesmo padrão
// que o AuthContext já usava com o login mockado).
async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const err = new Error(payload?.message ?? 'Erro inesperado ao falar com o servidor.')
    err.status = response.status
    err.errors = payload?.errors ?? null
    throw err
  }

  return payload.data
}

export const api = {
  login: (email, senha) => request('/auth/login', { method: 'POST', body: { email, senha } }),
  me: (token) => request('/auth/me', { token }),
  logout: (token) => request('/auth/logout', { method: 'POST', token }),

  getSetores: (token) => request('/setores', { token }),
  criarSetor: (token, dados) => request('/setores', { method: 'POST', token, body: dados }),

  getSistemasVisiveis: (token) => request('/sistemas/visiveis', { token }),
  getSistemas: (token) => request('/sistemas', { token }),
  criarSistema: (token, dados) => request('/sistemas', { method: 'POST', token, body: dados }),
  toggleSistemaAtivo: (token, id) => request(`/sistemas/${id}/toggle-ativo`, { method: 'PATCH', token }),

  getFuncionarios: (token) => request('/funcionarios', { token }),
  promoverFuncionario: (token, id) => request(`/funcionarios/${id}/promover`, { method: 'POST', token }),
  rebaixarFuncionario: (token, id) => request(`/funcionarios/${id}/rebaixar`, { method: 'POST', token }),

  getAprovacoes: (token) => request('/aprovacoes', { token }),
  aprovar: (token, id) => request(`/aprovacoes/${id}/aprovar`, { method: 'POST', token }),
  recusar: (token, id) => request(`/aprovacoes/${id}/recusar`, { method: 'POST', token }),
}
