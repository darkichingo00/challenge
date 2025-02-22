import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    authService.getAuthStatus().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('Usuario autenticado, acceso permitido.');
        observer.next(true);
        observer.complete();
      } else {
        console.warn('Usuario no autenticado. Redirigiendo a /login');
        router.navigate(['/login']);
        observer.next(false);
        observer.complete();
      }
    });
  });
};
