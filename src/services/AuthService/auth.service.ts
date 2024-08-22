import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../../model/role';
import { User } from '../../model/user';
import { ChangePasswordDto } from '../../model/ChangePasswordDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  JwtRegisteredClaimNames = {
    Email: 'email'
};
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth-token';
  public jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

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

  changePassword(changePasswordDto: ChangePasswordDto, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/auth/changepassword`, changePasswordDto, { 
      headers: headers,
      responseType: 'text'
    });
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
    console.log(token);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);

      return {
        
        email:decodedToken[this.JwtRegisteredClaimNames.Email],
        name: decodedToken['name'],
        userId:decodedToken['user_id'],
        isActive: decodedToken['is_active'] === 'true',
        contact_Number: decodedToken['contact_number'],
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as Role
      };
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
