import { Component, Input, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-exportDialogBox',
  templateUrl: './exportDialogBox.component.html',
  styleUrls: ['./exportDialogBox.component.css']
})
export class ExportDialogBoxComponent implements OnInit {
  @Input() allColumns: string[] = [];
  @Input() selectedColumns: string[] = [];
  @Input() data: any[] = [];
  isModalVisible = false;
  downloadFormat: string = 'csv';

  constructor(private modalService: ExportModalServiceService) {}

  ngOnInit(): void {
    this.modalService.exportModalState$.subscribe((state) => {
      this.isModalVisible = state;
    });

    this.modalService.data$.subscribe((data) => {
      this.data = data;
    });

    this.modalService.columns$.subscribe((columns) => {
      this.selectedColumns = columns;
    });
  }

  removeColumn(column: string): void {
    this.selectedColumns = this.selectedColumns.filter(col => col !== column);
  }

  addColumn(column: string): void {
    if (!this.selectedColumns.includes(column)) {
      this.selectedColumns.push(column);
    }
  }

  onColumnChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.addColumn(target.value);
  }

  setDownloadFormat(format: string): void {
    this.downloadFormat = format;
  }

  exportData(): void {
    if (this.downloadFormat === 'csv') {
      this.exportDataCSV();
    } else if (this.downloadFormat === 'pdf') {
      this.exportDataPDF();
    }
  }

  exportDataCSV() {
    const options = {
      showLabels: true,
      showTitle: true,
      title: 'Data Export',
      headers: this.selectedColumns
    };

    const data = this.data.map(item => {
      const row: any = {};
      this.selectedColumns.forEach(column => {
        row[column] = item[column];
      });
      return row;
    });

    new ngxCsv(data, 'export.csv', options);
    this.modalService.hideExportModal();
  }

  exportDataPDF() {
    const doc = new jsPDF();

    doc.text('Data Export', 14, 16);
    
    const data = this.data.map(item => {
      return this.selectedColumns.map(column => item[column]);
    });

    const headers = [this.selectedColumns];

    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20
    });

    doc.save('export.pdf');
    this.modalService.hideExportModal();
  }

  isDownloadable(): boolean {
    return this.selectedColumns.length > 0;
  }
}
