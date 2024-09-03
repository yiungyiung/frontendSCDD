import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportStateService {
  private selectedQuestionnaireSubject = new BehaviorSubject<number | null>(null);
  selectedQuestionnaire$ = this.selectedQuestionnaireSubject.asObservable();

  private selectedVendorAssignmentsSubject = new BehaviorSubject<{ vendorID: number, assignmentID: number, vendorName: string }[]>([]);
  selectedVendorAssignments$ = this.selectedVendorAssignmentsSubject.asObservable();

  private selectedQuestionsSubject = new BehaviorSubject<number[]>([]);
  selectedQuestions$ = this.selectedQuestionsSubject.asObservable();

  selectQuestionnaire(questionnaireId: number) {
    this.selectedQuestionnaireSubject.next(questionnaireId);
    // Reset vendors and questions when changing questionnaire
    this.selectedVendorAssignmentsSubject.next([]);
    this.selectedQuestionsSubject.next([]);
  }

  selectVendorAssignments(vendorAssignments: { vendorID: number, assignmentID: number, vendorName: string }[]) {
    this.selectedVendorAssignmentsSubject.next(vendorAssignments);
  }

  updateSelectedQuestions(questionIds: number[]) {
    this.selectedQuestionsSubject.next(questionIds);
  }

  get selectedQuestionnaireValue(): number | null {
    return this.selectedQuestionnaireSubject.getValue();
  }

  get selectedQuestionsValue(): number[] {
    return this.selectedQuestionsSubject.getValue();
  }

  get selectedVendorAssignmentsValue(): { vendorID: number, assignmentID: number, vendorName: string }[] {
    return this.selectedVendorAssignmentsSubject.getValue();
  }
}
