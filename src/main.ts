import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.prod';

if (environment.production) {
  console.log('Estamos en producción');
} else {
  console.log('Estamos en desarrollo');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
