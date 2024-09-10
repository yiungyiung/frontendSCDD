import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../../model/Notification';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notification`;  // Update with actual API URL

  constructor(private http: HttpClient) { }

  // Fetch notifications for a specific user
  getNotifications(userID: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user-notifications/${userID}`);
  }

  // Mark a notification as read
  markAsRead(notificationID: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-as-read/${notificationID}`, {});
  }

}
