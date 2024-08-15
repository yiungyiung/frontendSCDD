import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VendorHierarchy } from '../../model/vendorHierarchy';

@Injectable({
  providedIn: 'root'
})
export class VendorHierarchyService {
  private apiUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

getVendorHierarchy(token: string): Observable<VendorHierarchy[]> {
  console.log(this.http.get<VendorHierarchy[]>(this.apiUrl));
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<VendorHierarchy[]>(`${this.apiUrl}/VendorHierarchy`, { headers });
  //return this.http.get<VendorHierarchy[]>(this.apiUrl);
}

}
