import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { AlertService } from './alert.service';
import { LoginResponse, RegisterResponse, User } from '../interface/person.interface';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  user$ = this.userSubject.asObservable();
  authStatus$ = this.authStatusSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  // Carga el usuario desde localStorage y actualiza el estado de autenticación
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser); // Usar la interfaz User
      this.userSubject.next(user);
    }
  }

  // Verifica si hay un token en localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Devuelve si el usuario está autenticado en tiempo real
  getAuthStatus(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }

  // Realiza la autenticación del usuario con su email
  login(email: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email }).pipe(
      tap((response) => this.handleAuthResponse(response)),
      catchError((error) => this.handleError('Error de autenticación', error))
    );
  }

  // Registra un nuevo usuario en la aplicación
  register(name: string, email: string): Observable<RegisterResponse> {
    const body = { fullName: name, email };
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, body).pipe(
      tap((response) => this.handleAuthResponse(response)),
      catchError((error) => this.handleError('Error de registro', error))
    );
  }

  // Maneja la respuesta de autenticación (login o registro)
  private handleAuthResponse(response: LoginResponse | RegisterResponse): void {
    if (response?.token && response?.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.userSubject.next(response.user);
      this.authStatusSubject.next(true);
    } else {
      console.error('No se recibió un token válido en la respuesta.');
    }
  }

  // Maneja errores comunes
  private handleError(message: string, error: any): Observable<never> {
    console.error(`${message}:`, error);
    this.alertService.error(message, 'Intenta nuevamente.');
    return throwError(() => error);
  }

  // Devuelve el usuario autenticado como un observable
  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  // Cierra sesión, borra el token y actualiza el estado de autenticación
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.authStatusSubject.next(false);
  }

  // Decodifica el token JWT
  decodeToken(): (JwtPayload & { userId?: string }) | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token en localStorage.');
      return null;
    }

    try {
      const decodedToken: JwtPayload & { userId?: string } = jwtDecode(token);
      return decodedToken?.userId ? decodedToken : null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
