import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-FileUploadStatus',
  templateUrl: './FileUploadStatus.component.html',
  styleUrls: ['./FileUploadStatus.component.scss'],
})
export class FileUploadStatusComponent implements OnInit, OnDestroy {
  @Input() failedUsers: string[] = [];
  private timer: any;

  constructor() {}

  ngOnInit() {
    // Set a timer to hide the component after 1 minute (60000 milliseconds)
    this.timer = setTimeout(() => {
      this.hideComponent();
    }, 60000);
  }

  ngOnDestroy() {
    // Clean up the timer if the component is destroyed before the timer completes
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  hideComponent(): void {
    // Notify the parent component to hide this component
    if (this.failedUsers.length > 0) {
      this.failedUsers = []; // Or another method to notify the parent to hide the component
    }
  }
}
