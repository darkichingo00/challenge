import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  private fb = inject(FormBuilder);

  @Input() icon!: string;
  @Input() title: string = 'Formulario';
  @Input() submitButtonText: string = 'Enviar';
  @Output() onSubmit = new EventEmitter<any>();
  @Input() fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    icon?: string;
    required?: boolean;
    value?: any;
  }[] = [];

  form: FormGroup = this.fb.group({});
  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.createForm();
    }
  }

  // Crea el formulario dinámicamente basado en los campos proporcionados
  private createForm() {
    if (!this.fields || this.fields.length === 0) {
      return;
    }

    const controls: any = {};
    this.fields.forEach((field) => {
      controls[field.name] = this.fb.control(
        field.value || '', // Valor inicial
        field.required ? Validators.required : []
      );
    });

    this.form = this.fb.group(controls);
  }

  // Método para enviar el formulario
  submitForm() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    } else {
      console.warn('Formulario inválido. Revisa los campos.');
    }
  }

  ngOnDestroy(): void {
    console.log('FormComponent destruido. Limpiando suscripciones...');
    this.subscriptions.unsubscribe();
  }
}
