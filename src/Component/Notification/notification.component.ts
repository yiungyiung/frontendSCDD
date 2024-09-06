import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationSidebarComponent {
  @Input() isNotificationOpen: boolean = false;
  @Output() closeNotification = new EventEmitter<void>();

  notifications = [
    { id: 1, message: "You have received a new Questionnaire." },
    { id: 2, message: "You have received a new Questionnaire." }
  ];

  closeSidebar() {
    this.isNotificationOpen = false;
    this.closeNotification.emit(); // Emit event to notify the parent component
  }
}
