import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllUsers(token: string): Observable<User[]> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, { headers });
  }

  addUser(user: User, token: string): Observable<User> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<User>(`${this.apiUrl}/admin/users`, user, { headers });
  }

  updateUser(user: User, token: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<User>(`${this.apiUrl}/admin/users/${user.userId}`, user, { headers });
  }
}
