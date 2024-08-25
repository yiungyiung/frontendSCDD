import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from '../../model/vendor';
import { Category } from '../../model/category';
import { Tier } from '../../model/tier';

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

  getCategories(token: string): Observable<Category[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { headers });
  }

  getTiers(token: string): Observable<Tier[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Tier[]>(`${this.apiUrl}/tiers`, { headers });
  }

  getVendorsByTier(token: string, tierID: number): Observable<Vendor[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors/byTier/${tierID}`, { headers });
  }

  addVendor(token: string, vendor: Vendor): Observable<Vendor> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Vendor>(`${this.apiUrl}/add`, vendor, { headers });
  }
  getVendorIdByUserId(token: string, userId: number): Observable<number> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${this.apiUrl}/byUserId/${userId}`, { headers });
  }
}


