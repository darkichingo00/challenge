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

  tableColumns = ['No.', 'Título', 'Descripción', 'Creación', 'Estado', 'Acciones'];
  tasks: Task[] = [];
  searchQuery = '';
  isEditMode = false;
  selectedTask: Task | null = null;
  selectedStatus: string = '';

  // Campos del formulario para crear una nueva tarea
  taskFields = [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      placeholder: 'Ingrese el título de la tarea',
      required: true,
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      placeholder: 'Ingrese la descripción de la tarea',
      required: true,
    },
    {
      name: 'date',
      label: 'Fecha',
      type: 'date',
      placeholder: 'Seleccione la fecha',
      required: true,
    },
  ];

  ngOnInit() {
    this.ngSpinnerService.showSpinner()
    this.loadUserTasks();
  }

  switchToCreateMode() {
    this.isEditMode = false;
    this.selectedTask = null;
    this.resetForm();
  }

  // Cargar las tareas del usuario
  loadUserTasks() {
    this.taskService.getUserTasks().subscribe({
      next: (response: TaskResponse) => {
        this.tasks = response.tasks || [];
        this.ngSpinnerService.hideSpinner()
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
        this.selectedTask = item;
        this.isEditMode = true;
        this.patchFormValues(item);
        break;

      case 'DELETE':
        this.deleteTask(item.id!);
        break;

      case 'COMPLETED':
        this.updateTaskStatus(item.id!, TaskStatus.COMPLETED, 'Tarea completada.');
        break;

      case 'PENDING':
        this.updateTaskStatus(item.id!, TaskStatus.PENDING, 'Tarea pendiente.');
        break;

      case 'CANCEL':
        this.updateTaskStatus(item.id!, TaskStatus.CANCEL, 'Tarea cancelada.');
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

          // Si la respuesta no tiene un arreglo de tareas, agregamos la tarea manualmente
          if (response.tasks && response.tasks.length > 0) {
            this.tasks.push(response.tasks[0]); // Agregar la nueva tarea al arreglo
          } else {
            // Si no hay tareas en la respuesta, asumimos que la tarea creada es el objeto `task`
            this.tasks.push(task);
          }

          this.loadUserTasks(); // Recargar las tareas
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
      this.formComponent.form.patchValue({
        title: task.title,
        description: task.description,
        date: task.date,
        status: task.status
      });
    }
  }

  updateTask(task: Task) {
    this.ngSpinnerService.showSpinner();
    this.taskService.updateTask(task.id!, task).subscribe({
      next: (response: TaskResponse) => {
        this.alertService.success('Tarea actualizada', 'La tarea se ha actualizado correctamente.');

        // Extraer la tarea actualizada de la respuesta
        const updatedTask = response.tasks?.[0]; // Asume que la respuesta contiene la tarea actualizada

        if (updatedTask) {
          // Actualizar el arreglo `tasks` con la tarea modificada
          const index = this.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask; // Actualiza la tarea en el arreglo
          }
        }

        this.loadUserTasks(); // Recargar las tareas desde el servidor
        this.switchToCreateMode(); // Volver al modo de creación
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
      status: TaskStatus.PENDING, // Estado inicial de la tarea
    };

    this.createTask(newTask);
    this.resetForm();
  }

  onUpdateTask(formData: any) {
    if (this.selectedTask) {
      const updatedTask: Task = {
        ...this.selectedTask,
        title: formData.title,
        description: formData.description,
        date: formData.date,
      };

      this.updateTask(updatedTask);
    }
  }

  // Editar una tarea existente
  editTask(task: Task) {
    // Aquí puedes implementar la lógica para editar la tarea sin usar un modal
    console.log('Editar tarea:', task);
  }

  // Actualizar el estado de una tarea
  updateTaskStatus(id: string, status: TaskStatus, message: string) {
    this.taskService.updateTask(id, { status }).subscribe({
      next: () => {
        this.alertService.success('Actualización', message);
        this.loadUserTasks(); // Recargar las tareas
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo actualizar la tarea.');
      },
    });
  }

  // Eliminar una tarea
  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.alertService.success('Tarea eliminada', 'La tarea ha sido eliminada con éxito.');
        this.loadUserTasks(); // Recargar las tareas
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo eliminar la tarea.');
      },
    });
  }

  resetForm() {
    if (this.formComponent && this.formComponent.form) {
      this.formComponent.form.reset(); // Restablece el formulario
    }
  }
}
