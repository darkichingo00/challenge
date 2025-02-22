// header.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../core/services/services';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Person } from '../../core/interface/person.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  userName!: string;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    const userSubscription = this.authService.getUser().subscribe((user: Person | null) => {
      this.userName = user?.fullName || 'Invitado';
    });

    this.subscription.add(userSubscription);
  }

  async logout() {
    this.alertService
      .exitLogout(
        '¿Quieres cerrar sesión?',
        'Se cerrará tu sesión actual.',
        'Si cerrar sesión',
        'Cancelar'
      )
      .then((result) => {
        if (result) {
          this.authService.logout();
        }
      });
  }

  ngOnDestroy(): void {
    console.log('HeaderComponent destruido. Limpiando suscripciones...');
    this.subscription.unsubscribe();
  }
}
