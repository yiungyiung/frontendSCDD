import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { questionnaire } from '../../model/questionnaire';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createQuestionnaire(questionnaire: questionnaire, token:string): Observable<{ QuestionnaireID: number }> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<{ QuestionnaireID: number }>(`${this.apiUrl}/questionnaire`, questionnaire,{headers});
  }

  getAllQuestionnaires(token:string): Observable<questionnaire[]> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<questionnaire[]>(`${this.apiUrl}/getallquestionnaires`,{headers});
  }

  getQuestionsByQuestionnaireId(questionnaireId: number,token:String): Observable<questionnaire> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<questionnaire>(`${this.apiUrl}/questionnaire/${questionnaireId}`,{headers});
  }
}
