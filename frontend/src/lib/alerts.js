import Swal from 'sweetalert2'

const baseConfig = {
  confirmButtonColor: '#00008b',
  cancelButtonColor: '#64748b',
  background: '#ffffff',
  color: '#0f172a'
}

export async function confirmModal(titleOrConfig, legacyText, legacyConfirmText = 'Confirmar', legacyCancelText = 'Cancelar') {
  let title, text, confirmText, cancelText

  if (titleOrConfig && typeof titleOrConfig === 'object') {
    ({ title, text, confirmText = 'Confirmar', cancelText = 'Cancelar' } = titleOrConfig)
  } else {
    title = titleOrConfig
    text = legacyText
    confirmText = legacyConfirmText
    cancelText = legacyCancelText
  }

  const result = await Swal.fire({
    ...baseConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true
  })

  return result.isConfirmed
}

export function successModal(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    timer: 1800,
    showConfirmButton: false
  })
}

export function errorModal(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text
  })
}

export function infoModal(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text
  })
}
