import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgSpinnerService } from '../../core/services/services';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export default class SpinnerComponent implements OnInit {
  isLoading = false;

  private spinnerService = inject(NgSpinnerService)

  ngOnInit(): void {
    this.spinnerService.spinner$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
