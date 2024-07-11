import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from '../../model/vendor';
@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private apiUrl = `${environment.apiUrl}/vendor`;

  constructor(private http: HttpClient) {}
   
  getAllVendors(token: string): Observable<Vendor[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`, { headers });
  }
}
