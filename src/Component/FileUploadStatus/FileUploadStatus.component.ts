import { Component, OnInit, Input, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-FileUploadStatus',
  templateUrl: './FileUploadStatus.component.html',
  styleUrls: ['./FileUploadStatus.component.css']
})
export class FileUploadStatusComponent implements OnInit {
  @Input() failedUsers: string[] = [];
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }
  onCancel(): void {
    this.cancel.emit();
  }

}
