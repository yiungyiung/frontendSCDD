import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { Question } from '../../model/question';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-AssignQuestionnaire',
  templateUrl: './AssignQuestionnaire.component.html',
  styleUrls: ['./AssignQuestionnaire.component.css']
})
export class AssignQuestionnaireComponent implements OnInit {
  
  constructor(private questionService: QuestionService, private authService: AuthService) { }
  ngOnInit() {
    this.getQuestion(1);
  }

  addQuestion(): void {
    const token = this.authService.getToken();
    const newQuestion: Question = {
      questionText: 'Sample Question',
      description: 'This is a sample question',
      orderIndex: 1,
      domainID: 1,
      categoryID: 1,
      options: [{ optionText: 'Option 1', orderIndex: 1 }],
      textboxes: [{ label: 'Textbox 1', orderIndex: 1, uomid: 1 }],
      fileUploads: [{label: 'file1',orderIndex:1}],
      frameworkIDs: [1]
    };

    this.questionService.addQuestion(newQuestion, token).subscribe(response => {
      console.log('Question added successfully:', response);
    });
  }

  getQuestion(id: number): void {
    const token = this.authService.getToken();
    this.questionService.getQuestionById(id,token).subscribe((question: Question) => {
      console.log('Question fetched successfully:', question);
    });
  }
}
