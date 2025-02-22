import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AlertService,
  AuthService,
  NgSpinnerService,
} from '../../../core/services/services';
import { FormField } from '../../../core/interface/form-field.interface';
import { FormComponent } from '../../../shared/form/form.component';
import SpinnerComponent from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, FormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private spinnerService = inject(NgSpinnerService);

  showRegisterForm = false;
  registerFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text',
      placeholder: 'Ingresa tu nombre',
      required: true,
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'ejemplo@correo.com',
      required: true,
    },
  ];

  loginFields: FormField[] = [
    {
      name: 'email',
      label: 'Ingresa Email',
      type: 'email',
      icon: 'bi bi-envelope-fill',
      placeholder: 'ejemplo@correo.com',
      required: true,
    },
  ];

  async onLogin(data: any) {
    this.spinnerService.showSpinner();
    this.authService.login(data.email).subscribe({
      next: async (response) => {
        console.log('Usuario autenticado:', response);
        if (response?.token) {
          this.authService.getAuthStatus().subscribe((isAuthenticated) => {
            if (isAuthenticated) {
              this.spinnerService.hideSpinner();
              console.log(
                'Estado de autenticación actualizado, redirigiendo a /app/home'
              );
              this.router.navigate(['/app/home']);
            }
          });
        }
      },
      error: async () => {
        this.spinnerService.hideSpinner();
        const register = await this.alertService.userNotFound(
          'Oops!!!',
          'Parece que no eres de por aquí. <br> ¿Quieres registrarte?',
          'Sí, quiero registrarme',
          'No, gracias'
        );

        if (register) {
          this.showRegisterForm = true;
        }
      },
    });
  }

  onRegister(data: any) {
    this.spinnerService.showSpinner();
    this.authService.register(data.name, data.email).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        if (response?.token) {
          this.authService.getAuthStatus().subscribe((isAuthenticated) => {
            if (isAuthenticated) {
              this.spinnerService.hideSpinner();
              console.log(
                'Estado de autenticación actualizado, redirigiendo a /app/home'
              );
              this.router.navigate(['/app/home']);
            }
          });
        }
      },
      error: (error) => {
        this.spinnerService.hideSpinner();
        console.error('Error en el registro:', error);
        this.alertService.error(
          'Error de Registro',
          'No se pudo completar el registro. Intenta nuevamente.'
        );
      },
    });
  }

  closeRegisterForm() {
    this.showRegisterForm = false;
  }
}
