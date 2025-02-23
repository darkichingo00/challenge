import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  success(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd',
    });
  }

  error(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd',
    });
  }

  warning(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd',
    });
  }

  userNotFound(
    title: string,
    text: string,
    confirmButtonText: string,
    cancelButtonText: string,
  ): Promise<boolean> {
    return Swal.fire({
      title: title,
      html: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: '#0d6efd',
    }).then((result) => result.isConfirmed);
  }

  async generalAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string) {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#0d6efd',
      cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
  }

  async confirmComplete(): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Marcar como realizada?',
      text: 'Esta tarea se marcará como completada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar',
      confirmButtonColor: '#0d6efd',
      cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
  }

  /** Alerta de confirmación para cancelar tarea */
  async confirmCancel(): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Cancelar tarea?',
      text: 'Esta tarea será cancelada y no se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#0d6efd',
    });
    return result.isConfirmed;
  }

  /** Alerta de confirmación para eliminar tarea */
  confirmDelete(title: string = '¿Eliminar tarea?', text: string = 'Esta acción no se puede deshacer.') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
    }).then((result) => result.isConfirmed);
  }

  async exitLogout(title: string, text: string, confirmButtonText: string, cancelButtonText: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: '#0d6efd',
    });

    return result.isConfirmed;
  }
}
