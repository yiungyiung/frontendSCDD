import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question,  } from '../../model/question'; 
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addQuestion(question: Question, token: string): Observable<Question> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Question>(`${this.apiUrl}/question/add`, question,{headers});
  }

  getQuestionById(id: number,token: string): Observable<Question> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Question>(`${this.apiUrl}/question/${id}`,{headers});
  }
}
