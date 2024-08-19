import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FileUpload } from '../../model/question';

@Component({
  selector: 'app-QuestionType_AttachFile',
  templateUrl: './QuestionType_AttachFile.component.html',
  styleUrls: ['./QuestionType_AttachFile.component.css']
})
export class QuestionType_AttachFileComponent implements OnInit {
  @Input() id!: number;
  @Output() remove = new EventEmitter<void>();
  @Output() fileUploadChange = new EventEmitter<FileUpload>();

  label: string = '';

  constructor() { }

  ngOnInit() {
    this.emitFileUpload();
  }

  removeComponent() {
    this.remove.emit();
  }

  onLabelChange() {
    this.emitFileUpload();
  }

  private emitFileUpload() {
    const fileUpload: FileUpload = {
      label: this.label,
      orderIndex: 0 // You might want to handle this differently based on your requirements
    };
    this.fileUploadChange.emit(fileUpload);
  }
}