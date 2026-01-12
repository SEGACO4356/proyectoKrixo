import Swal from 'sweetalert2';

export const showSuccessAlert = (message: string, title: string = '¡Éxito!') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#10b981',
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showErrorAlert = (message: string, title: string = 'Error') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#ef4444',
  });
};

export const showWarningAlert = (message: string, title: string = 'Advertencia') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#f59e0b',
  });
};

export const showConfirmAlert = async (
  message: string,
  title: string = '¿Estás seguro?',
  confirmText: string = 'Sí, continuar',
  cancelText: string = 'Cancelar'
) => {
  const result = await Swal.fire({
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
  });
  
  return result.isConfirmed;
};

export const showInfoAlert = (message: string, title: string = 'Información') => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3b82f6',
  });
};

export const showLoadingAlert = (message: string = 'Procesando...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoadingAlert = () => {
  Swal.close();
};
