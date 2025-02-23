import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/table/table.component';
import { AlertService } from '../../core/services/alert.service';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus, TaskResponse } from '../../core/interface/task.interface';
import { NgSpinnerService } from '../../core/services/spinner.service';
import SpinnerComponent from '../../shared/spinner/spinner.component';
import { FormComponent } from '../../shared/form/form.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    SpinnerComponent,
    FormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  private alertService = inject(AlertService);
  private taskService = inject(TaskService);
  private ngSpinnerService = inject(NgSpinnerService);
  @ViewChild(FormComponent) formComponent!: FormComponent;

  tableColumns = ['No.', 'Título', 'Descripción', 'Programada', 'Estado', 'Acciones'];
  tasks: Task[] = [];
  searchQuery = '';
  isEditMode = false;
  selectedTask: Task | null = null;
  selectedStatus: string = '';

  // Campos del formulario (se actualizan dinámicamente)
  taskFields = this.getTaskFields(false);

  ngOnInit() {
    this.ngSpinnerService.showSpinner();
    this.loadUserTasks();
  }

  // Obtener los campos del formulario según el modo (creación o edición)
  getTaskFields(isEditMode: boolean) {
    return [
      {
        name: 'title',
        label: 'Título',
        type: 'text',
        placeholder: 'Ingrese el título de la tarea',
        required: !isEditMode,
      },
      {
        name: 'description',
        label: 'Descripción',
        type: 'text',
        placeholder: 'Ingrese la descripción de la tarea',
        required: !isEditMode,
      },
      {
        name: 'date',
        label: 'Fecha',
        type: 'date',
        placeholder: 'Seleccione la fecha',
        required: !isEditMode,
      },
      {
        name: 'time',
        label: 'Hora',
        type: 'time',
        placeholder: 'Seleccione la hora',
        required: !isEditMode,
      },
    ];
  }

  switchToCreateMode() {
    this.isEditMode = false;
    this.selectedTask = null;

    this.taskFields = this.getTaskFields(false);
    this.resetForm();
  }

  switchToEditMode(task: Task) {
    this.isEditMode = true;
    this.selectedTask = task;


    this.taskFields = this.getTaskFields(true);
    this.patchFormValues(task);
  }

  // Cargar las tareas del usuario
  loadUserTasks() {
    this.taskService.getUserTasks().subscribe({
      next: (response: TaskResponse) => {
        console.log(response);
        this.tasks = response.tasks || [];
        this.ngSpinnerService.hideSpinner();
      },
      error: () => {
        this.alertService.error('Error', 'Hubo un problema al obtener las tareas.');
      },
    });
  }

  // Manejar acciones de la tabla (crear, editar, eliminar, etc.)
  handleTaskAction(event: { action: string; item: Task }) {
    const { action, item } = event;

    switch (action) {
      case 'CREATE':
        this.createTask(item);
        break;

      case 'EDIT':
        this.switchToEditMode(item);
        break;

      case 'DELETE':
        this.isEditMode = false;
        this.deleteTask(item.id!);
        break;

      case 'COMPLETED':
        this.updateTask(item.id!, { status: TaskStatus.COMPLETED }, 'Tarea completada.');
        break;

      case 'PENDING':
        this.updateTask(item.id!, { status: TaskStatus.PENDING }, 'Tarea pendiente.');
        break;

      case 'CANCEL':
        this.updateTask(item.id!, { status: TaskStatus.CANCEL }, 'Tarea cancelada.');
        break;

      default:
        console.warn('Acción no reconocida:', action);
        break;
    }
  }

  // Crear una nueva tarea
  createTask(task: Task) {
    this.ngSpinnerService.showSpinner();
    this.taskService.createTask(task).subscribe({
      next: (response: TaskResponse) => {
        if (response.message) {
          this.alertService.success('Tarea creada', 'La tarea se ha creado correctamente.');

          if (response.tasks && response.tasks.length > 0) {
            this.tasks.push(response.tasks[0]);
          } else {
            this.tasks.push(task);
          }

          this.loadUserTasks();
        }
        this.ngSpinnerService.hideSpinner();
      },
      error: () => {
        this.ngSpinnerService.hideSpinner();
        this.alertService.error('Error', 'No se pudo crear la tarea.');
      },
    });
  }

  patchFormValues(task: Task) {
    if (this.formComponent && this.formComponent.form) {
      const dateTime = this.combineDateAndTime(task.date, task.time);
      this.formComponent.form.patchValue({
        title: task.title,
        description: task.description,
        date: dateTime,
        time: task.time,
        status: task.status,
      });
    }
  }

  combineDateAndTime(date: string, time: string): number {
    // Crear un objeto Date combinando date y time
    const dateTimeString = `${date}T${time}:00`; // Formato: YYYY-MM-DDTHH:MM:SS
    const dateTime = new Date(dateTimeString);

    // Convertir a timestamp (milisegundos desde 1970-01-01)
    return dateTime.getTime();
  }

  updateTask(id: string, task: Partial<Task>, message?: string) {
    this.ngSpinnerService.showSpinner();
    const currentTask = this.tasks.find(t => t.id === id);

    if (!currentTask) {
      this.ngSpinnerService.hideSpinner();
      this.alertService.error('Error', 'Tarea no encontrada.');
      return;
    }

    const updatedTask = { ...currentTask, ...task };

    this.taskService.updateTask(id, updatedTask).subscribe({
      next: (response: TaskResponse) => {
        if (message) {
          this.alertService.success('Actualización', message);
        } else {
          this.alertService.success('Tarea actualizada', 'La tarea se ha actualizado correctamente.');
        }

        // Actualizar el arreglo `tasks` con la tarea modificada
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updatedTask };
        }

        this.loadUserTasks(); // Recargar las tareas desde el servidor
        this.ngSpinnerService.hideSpinner();
      },
      error: (error) => {
        this.ngSpinnerService.hideSpinner();
        this.alertService.error('Error', 'No se pudo actualizar la tarea.');
        console.error('Error al actualizar la tarea:', error);
      },
    });
  }

  // Manejar el envío del formulario de creación de tareas
  onCreateTask(formData: any) {
    const newTask: Task = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      status: TaskStatus.PENDING,
    };

    this.createTask(newTask);
    this.resetForm();
  }

  onUpdateTask(formData: any) {
    if (this.selectedTask) {
      // Crear un objeto con todos los campos del formulario
      const updatedTask: Partial<Task> = {
        title: formData.title || this.selectedTask.title,
        description: formData.description || this.selectedTask.description,
        date: formData.date || this.selectedTask.date,
        time: formData.time || this.selectedTask.time,
        status: formData.status || this.selectedTask.status,
      };
      // Enviar la tarea actualizada al backend
      this.updateTask(this.selectedTask.id!, updatedTask);
      this.resetForm();
    }
  }

  // Eliminar una tarea
  deleteTask(id: string) {
    // Mostrar una alerta de confirmación
    this.alertService.confirmDelete('¿Eliminar tarea?', 'Esta acción no se puede deshacer.')
      .then((confirmed) => {
        if (confirmed) {
          this.ngSpinnerService.showSpinner();
          this.taskService.deleteTask(id).subscribe({
            next: () => {
              this.ngSpinnerService.hideSpinner();
              this.alertService.success('Tarea eliminada', 'La tarea ha sido eliminada con éxito.');
              this.loadUserTasks(); // Recargar las tareas
            },
            error: () => {
              this.ngSpinnerService.hideSpinner();
              this.alertService.error('Error', 'No se pudo eliminar la tarea.');
            },
          });
        }
      });
  }

  resetForm() {
    if (this.formComponent && this.formComponent.form) {
      this.formComponent.form.reset(); // Restablece el formulario
    }
  }
}
