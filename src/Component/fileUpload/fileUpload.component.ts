import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-fileUpload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.css']
})
export class FileUploadComponent {
  @Output() fileParsed: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() TemplateHeader : string[] = [];

  private selectedFile: File | null = null;

  constructor(private ngxCsvParser: NgxCsvParser) {}

  onDownloadTemplate() {
    const csvData = this.generateCSVTemplate();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  generateCSVTemplate(): string {
    // Generate your CSV data here as a string
    // Example CSV structure:
    const headers = this.TemplateHeader;
    
  
    let csvContent = headers.join(',') + '\n';
    
  
    return csvContent;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'csv') {
        this.parseCsvFile(this.selectedFile);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        this.parseExcelFile(this.selectedFile);
      } else {
        console.error('Unsupported file format');
      }
    } else {
      console.error('No file selected');
    }
  }

  parseCsvFile(file: File): void {
    this.ngxCsvParser.parse(file, { header: true, delimiter: ',' }).subscribe({
      next: (result: any[] | NgxCSVParserError) => {
        if (result instanceof NgxCSVParserError) {
          console.error('Error parsing CSV:', result);
        } else {
          console.log('Parsed CSV Data:', result);
          this.fileParsed.emit(result);
        }
      },
      error: (error: NgxCSVParserError) => {
        console.error('Error parsing CSV:', error);
      }
    });
  }

  parseExcelFile(file: File): void {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      console.log('Parsed Excel Data:', jsonData);
      this.fileParsed.emit(jsonData);
    };
    reader.onerror = (error) => {
      console.error('Error reading Excel file:', error);
    };
  }

  onCancel(): void {
    this.selectedFile = null;
    this.cancel.emit();
  }
}
