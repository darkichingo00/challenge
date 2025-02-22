import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks.component')
          .then(m => m.TasksComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about-worksync/about-worksync.component')
          .then(m => m.AboutWorksyncComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
