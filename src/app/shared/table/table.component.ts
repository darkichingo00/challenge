import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableActionEvent } from '../../core/interface/table-action.interface';
import { TaskStatus } from '../../core/enum/task-status.enum';
import { TaskAction } from '../../core/enum/task-action.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges, OnDestroy {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() pageSize: number = 10;
  @Input() searchQuery: string = '';
  @Input() selectedStatus: string = '';
  @Output() onAction = new EventEmitter<TableActionEvent>();
  @Output() onPageChange = new EventEmitter<number>();

  currentPage = 1;
  paginatedData: any[] = [];
  filteredData: any[] = [];
  TaskStatus = TaskStatus;
  TaskAction = TaskAction;

  validActions: TaskAction[] = [
    TaskAction.COMPLETED,
    TaskAction.CANCEL,
    TaskAction.PENDING,
    TaskAction.DELETE,
    TaskAction.EDIT,
  ];

  private subscriptions: Subscription[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['pageSize'] || changes['searchQuery'] || changes['selectedStatus']) {
      this.applyFilters();
      this.updatePaginatedData();
    }
  }

  get totalPages(): number {
    return this.filteredData.length > 0 ? Math.ceil(this.filteredData.length / this.pageSize) : 1;
  }

  applyFilters() {
    if (!this.data || !Array.isArray(this.data)) {
      console.error('Error: `data` no es un array válido.');
      return;
    }

    const searchQueryLower = this.searchQuery.trim().toLowerCase();

    this.filteredData = this.data.filter(task => {
      const matchesSearch = !this.searchQuery ||
        Object.values(task).some(value =>
          value !== null && value !== undefined &&
          value.toString().toLowerCase().includes(searchQueryLower)
        );

      const matchesStatus = !this.selectedStatus || task.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    if (!Array.isArray(this.filteredData)) {
      console.error('Error: `filteredData` no es un array.');
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  emitAction(action: TaskAction, item: any) {
    if (this.validActions.includes(action)) {
      this.onAction.emit({ action, item });
    } else {
      console.error(`Acción no válida: ${action}`);
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
      this.onPageChange.emit(this.currentPage);
    } else {
      console.warn(`Página fuera de rango: ${page}`);
    }
  }

  ngOnDestroy(): void {
    console.log('TableComponent destruido. Limpiando suscripciones...');
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
