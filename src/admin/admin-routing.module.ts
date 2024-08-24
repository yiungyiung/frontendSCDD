// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminComponent } from './admin.component';
import { VendorManagementComponent } from './VendorManagement/VendorManagement.component';
import { ManageQuestionaireComponent } from './ManageQuestionaire/ManageQuestionaire.component';
import { AssignQuestionnaireComponent } from './AssignQuestionnaire/AssignQuestionnaire.component';
import { AddQuestionComponent } from './AddQuestion/AddQuestion.component';
import { CreateNewQuestionnaireComponent } from './CreateNewQuestionnaire/CreateNewQuestionnaire.component';
import { SelectQuestionsComponent } from './SelectQuestions/SelectQuestions.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'vendor-management', component: VendorManagementComponent},
      { path: 'Manage-question', component: ManageQuestionaireComponent},
      {path: 'CreateNewQuestionnarie', component:CreateNewQuestionnaireComponent},
      {path: 'Add-question', component:AddQuestionComponent},
      { path: 'select-questions', component: SelectQuestionsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
