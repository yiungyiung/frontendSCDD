import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Domain,
  Framework,
  FrameworkDetails,
  Status,
  Tier,
  UnitOfMeasurement,
} from '../../model/entity';
import { Category } from '../../model/category';
@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  GetAllTiers(token: string): Observable<Tier[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Tier[]>(`${this.apiUrl}/vendor/tiers`, { headers });
  }

  GetTierById(id: number, token: string): Observable<Tier> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Tier>(`${this.apiUrl}/entity/tiers/${id}`, {
      headers,
    });
  }

  GetAllDomains(token: string): Observable<Domain[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Domain[]>(`${this.apiUrl}/entity/domains`, {
      headers,
    });
  }
  GetAllCategory(token: string): Observable<Category[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Category[]>(`${this.apiUrl}/entity/categories`, {
      headers,
    });
  }

  GetDomainById(id: number, token: string): Observable<Domain> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Domain>(`${this.apiUrl}/entity/domains/${id}`, {
      headers,
    });
  }

  GetAllFrameworks(token: string): Observable<Framework[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Framework[]>(`${this.apiUrl}/entity/frameworks`, {
      headers,
    });
  }

  GetFrameworkById(id: number, token: string): Observable<Framework> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Framework>(`${this.apiUrl}/entity/frameworks/${id}`, {
      headers,
    });
  }

  getAllFrameworkDetails(token: string): Observable<FrameworkDetails[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<FrameworkDetails[]>(
      `${this.apiUrl}/entity/frameworkdetails`,
      { headers }
    );
  }

  getAllUnitsOfMeasurement(token: string): Observable<UnitOfMeasurement[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UnitOfMeasurement[]>(
      `${this.apiUrl}/entity/unitsOfMeasurement`,
      { headers }
    );
  }

  // Get a unit of measurement by ID
  getUnitOfMeasurementById(
    id: number,
    token: string
  ): Observable<UnitOfMeasurement> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UnitOfMeasurement>(
      `${this.apiUrl}/entity/unitsOfMeasurement/${id}`,
      { headers }
    );
  }
  getAllStatuses(token: string): Observable<Status[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Status[]>(`${this.apiUrl}/entity/statuses`, {
      headers,
    });
  }

  // Fetch a status by ID
  getStatusById(id: number, token: string): Observable<Status> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Status>(`${this.apiUrl}/entity/statuses/${id}`, {
      headers,
    });
  }

  // Add a new status
  addStatus(status: Status, token: string): Observable<Status> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Status>(`${this.apiUrl}/entity/statuses`, status, {
      headers,
    });
  }

  addDomain(domain: Domain, token: string): Observable<Domain> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Domain>(`${this.apiUrl}/entity/domains`, domain, {
      headers,
    });
  }

  addUnitOfMeasurement(
    unitOfMeasurement: UnitOfMeasurement,
    token: string
  ): Observable<UnitOfMeasurement> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<UnitOfMeasurement>(
      `${this.apiUrl}/entity/unitsOfMeasurement`,
      unitOfMeasurement,
      { headers }
    );
  }
}
