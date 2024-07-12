import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportModalServiceService {
  private exportModalSubject = new Subject<boolean>();
  exportModalState$ = this.exportModalSubject.asObservable();

  private dataSubject = new Subject<any[]>();
  data$ = this.dataSubject.asObservable();

  private columnsSubject = new Subject<string[]>();
  columns$ = this.columnsSubject.asObservable();

  showExportModal() {
    this.exportModalSubject.next(true);
  }

  hideExportModal() {
    this.exportModalSubject.next(false);
  }

  setDataAndColumns(data: any[], columns: string[]) {
    this.dataSubject.next(data);
    this.columnsSubject.next(columns);
  }
}
