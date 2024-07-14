import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupSubject = new Subject<{ message: string, backgroundColor: string }>(); // Corrected property name
  popupState$ = this.popupSubject.asObservable();

  constructor() { }

  showPopup(message: string, backgroundColor: string): void {
    this.popupSubject.next({ message, backgroundColor }); // Corrected property name
  }
}
