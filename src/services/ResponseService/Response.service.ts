// src/app/services/response.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../model/ResponseDto';
import { QuestionnaireAssignmentResponseDto, QuestionOptionResponseDto, QuestionResponseDto } from '../../model/QuestionOptionResponseDto';
import { AuthService } from '../AuthService/auth.service';
@Injectable({
  providedIn: 'root',
})
export class ResponseService {
  private apiUrl = 'http://localhost:3267/api/Response'; // Adjust the URL as needed

  constructor(private http: HttpClient,private authService: AuthService) {}
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Assuming getToken() returns the token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
  submitResponse(response: ResponseDto): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.apiUrl, response, { headers });
  }

  submitAllResponses(responses: ResponseDto[]): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/bulk`, responses, { headers });
  }

  getResponsesForAssignment(assignmentId: number): Observable<QuestionnaireAssignmentResponseDto> {
    const headers = this.getHeaders();
    return this.http.get<QuestionnaireAssignmentResponseDto>(`${this.apiUrl}/assignment/${assignmentId}`, { headers });
  }

  getAllResponsesForQuestionnaire(questionnaireId: number): Observable<QuestionnaireAssignmentResponseDto[]> {
    const headers = this.getHeaders();
    return this.http.get<QuestionnaireAssignmentResponseDto[]>(`${this.apiUrl}/questionnaire/${questionnaireId}`, { headers });
  }

  getResponseForAssignmentAndQuestion(assignmentId: number, questionId: number): Observable<QuestionResponseDto> {
    const headers = this.getHeaders();
    return this.http.get<QuestionResponseDto>(`${this.apiUrl}/assignment/${assignmentId}/question/${questionId}`, { headers });
  }

  uploadFile(file: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/upload`, formData, { headers });
  }
}
