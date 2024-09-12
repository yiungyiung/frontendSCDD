import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireAssignmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createQuestionnaireAssignment(
    dto: QuestionnaireAssignment,
    token: string
  ): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/QuestionnaireAssignment`,
      dto,
      { headers }
    );
  }

  getAssignmentById(
    id: number,
    token: string
  ): Observable<QuestionnaireAssignment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<QuestionnaireAssignment>(
      `${this.apiUrl}/QuestionnaireAssignment/${id}`,
      { headers }
    );
  }

  getAssignmentsByVendorId(
    vendorId: number,
    token: string
  ): Observable<QuestionnaireAssignment[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<QuestionnaireAssignment[]>(
      `${this.apiUrl}/QuestionnaireAssignment/vendor/${vendorId}`,
      { headers }
    );
  }

  getallAssignment(token: string): Observable<QuestionnaireAssignment[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<QuestionnaireAssignment[]>(
      `${this.apiUrl}/QuestionnaireAssignment`,
      { headers }
    );
  }
  getAssignmentsByQuestionnaireId(
    questionnaireId: number,
    token: string
  ): Observable<QuestionnaireAssignment[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<QuestionnaireAssignment[]>(
      `${this.apiUrl}/QuestionnaireAssignment/questionnaire/${questionnaireId}`,
      { headers }
    );
  }
  getAssignmentStatistics(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${this.apiUrl}/QuestionnaireAssignment/statistics`,
      { headers }
    );
  }
}