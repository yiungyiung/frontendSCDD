import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplianceService {
  private apiUrl = `${environment.apiUrl}/compliance`;

  constructor(private http: HttpClient) {}

  getComplianceData(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/compliance-data`, { headers });
  }
}
