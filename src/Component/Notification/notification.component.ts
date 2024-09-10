import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../../services/NotificationService/NotificationService.service';
import { Notification } from '../../model/Notification';
import { AuthService } from '../../services/AuthService/auth.service';
import { User } from '../../model/user';
@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationSidebarComponent {
  @Input() isNotificationOpen: boolean = false;
  @Output() closeNotification = new EventEmitter<void>();

  fetchuser:User={ email: '',  name: '', contact_Number: '', isActive: true };
  notifications: Notification[] = [];
  constructor(private notificationService: NotificationService,private authService: AuthService) {}

  ngOnInit(): void {
    
    this.fetchuser=(this.authService.getCurrentUser())!;
    console.log(this.fetchuser);
    this.getNotifications();
  }
  getNotifications(): void {
    
    
    this.notificationService.getNotifications(this.fetchuser.userId!).subscribe(
      (data) => {
        this.notifications = data;
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );
  }
  closeSidebar() {
    this.isNotificationOpen = false;
    this.closeNotification.emit(); // Emit event to notify the parent component
  }
}
