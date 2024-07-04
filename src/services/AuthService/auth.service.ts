import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../../model/role';
import { User } from '../../model/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private tokenKey = 'auth-token';
  private jwtHelper = new JwtHelperService();


  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }, { headers });
  
  }

 getRoleFromToken(token: string): Role {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as Role;

  }


  getProtectedData(token: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/test/protected`, { headers });
  }

  getAdminData(token: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/test/admin`, { headers });
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return {
        email: decodedToken.email,
        role: decodedToken.role as Role
      };
    }
    return null;
  }

}
