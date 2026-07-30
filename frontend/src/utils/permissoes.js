// Helpers de UI sobre o papel do usuário — o escopo de dados (quem vê o quê) já é
// aplicado pela própria API (ver HubRondaNoBairro/backend/app/Support/AccessScope.php).
// Ver memória "Hub de sistemas" para o modelo completo (papéis: funcionario | gestor | admin).

export function isGestor(usuario) {
  return usuario?.papel === 'gestor'
}

export function isAdmin(usuario) {
  return usuario?.papel === 'admin'
}

export function isGestorOuAdmin(usuario) {
  return isGestor(usuario) || isAdmin(usuario)
}

export function nomeSetor(setores, setorId) {
  return setores.find(s => s.id === setorId)?.nome ?? '—'
}

export const PAPEL_LABEL = {
  funcionario: 'Funcionário',
  gestor: 'Gestor de setor',
  admin: 'Administrador (TI)',
}

export const PAPEL_BADGE_VARIANT = {
  funcionario: 'slate',
  gestor: 'brand',
  admin: 'amber',
}
