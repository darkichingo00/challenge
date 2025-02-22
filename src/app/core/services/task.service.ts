import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskResponse } from '../interface/task.interface';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  // BehaviorSubject para manejar el estado de las tareas
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  // Método para actualizar el estado de las tareas
  setTasks(tasks: Task[]) {
    this.tasksSubject.next(tasks);
  }

  // Obtener los headers con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });
  }

  // Obtener todas las tareas
  getTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Obtener las tareas del usuario actual
  getUserTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/user`, {
      headers: this.getHeaders(),
    });
  }

  // Crear una nueva tarea
  createTask(task: Task): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, task, {
      headers: this.getHeaders(),
    });
  }

  // Actualizar una tarea existente
  updateTask(id: string, task: Partial<Task>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, task, {
      headers: this.getHeaders(),
    });
  }

  // Eliminar una tarea
  deleteTask(id: string): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
