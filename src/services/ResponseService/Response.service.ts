// src/app/services/response.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../model/ResponseDto';
import { QuestionnaireAssignmentResponseDto, QuestionOptionResponseDto, QuestionResponseDto } from '../../model/QuestionOptionResponseDto';
@Injectable({
  providedIn: 'root',
})
export class ResponseService {
  private apiUrl = 'http://localhost:3267/api/Response'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  submitResponse(response: ResponseDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, response);
  }
  submitAllResponses(responses: ResponseDto[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, responses);  // Updated endpoint
    
}

getResponsesForAssignment(assignmentId: number): Observable<QuestionnaireAssignmentResponseDto> {
  return this.http.get<QuestionnaireAssignmentResponseDto>(`${this.apiUrl}/assignment/${assignmentId}`);
}

getAllResponsesForQuestionnaire(questionnaireId: number): Observable<QuestionnaireAssignmentResponseDto[]> {
  return this.http.get<QuestionnaireAssignmentResponseDto[]>(`${this.apiUrl}/questionnaire/${questionnaireId}`);
}
getResponseForAssignmentAndQuestion(assignmentId: number, questionId: number): Observable<QuestionResponseDto> {
  return this.http.get<QuestionResponseDto>(`${this.apiUrl}/assignment/${assignmentId}/question/${questionId}`);
}
}
