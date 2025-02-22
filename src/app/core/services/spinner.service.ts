import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgSpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinner$ = this.spinnerSubject.asObservable();

  showSpinner() {
    this.spinnerSubject.next(true);
  }

  hideSpinner() {
    this.spinnerSubject.next(false);
  }
}
