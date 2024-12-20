// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminComponent } from './admin.component';
import { VendorManagementComponent } from './VendorManagement/VendorManagement.component';
import { AssignQuestionnaireComponent } from './AssignQuestionnaire/AssignQuestionnaire.component';
import { AddQuestionComponent } from './AddQuestion/AddQuestion.component';
import { CreateNewQuestionnaireComponent } from './CreateNewQuestionnaire/CreateNewQuestionnaire.component';
import { SelectQuestionsComponent } from './SelectQuestions/SelectQuestions.component';
import { ReportsComponent } from './Reports/Reports.component';
import { DynamicReportsComponent } from './DynamicReports/DynamicReports.component';
import { ResponsePageComponent } from '../Component/ResponsePage/ResponsePage.component';
import { UnsavedChangesGuard } from '../guards/unsaved-changes.guard';
import { FrameworkDetailsComponent } from '../Component/FrameworkDetails/FrameworkDetails.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: { breadcrumb: 'admin' },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        data: { breadcrumb: 'User Management' },
      },
      {
        path: 'framework',
        component: FrameworkDetailsComponent,
        data: { breadcrumb: 'Framework' },
      },
      {
        path: 'vendor-management',
        component: VendorManagementComponent,
        data: { breadcrumb: 'VendorManagement' },
      },
      {
        path: 'CreateNewQuestionnarie',
        component: CreateNewQuestionnaireComponent,
        data: { breadcrumb: 'Create New Questionnaire' },
        children: [
          {
            path: 'select-questions',
            component: SelectQuestionsComponent,
            data: { breadcrumb: 'Select Questions' },
            canDeactivate: [UnsavedChangesGuard], 
          },
        ],
      },
      {
        path: 'AssignExistingQuestionnarie',
        component: AssignQuestionnaireComponent,
        data: { breadcrumb: 'Assign Existing Questionnarie' },
      },
      {
        path: 'Add-question',
        component: AddQuestionComponent,
        data: { breadcrumb: 'Add Question' },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { breadcrumb: 'Reports' },
        children: [
          {
            path: 'response-page',
            component: ResponsePageComponent,
            data: { breadcrumb: 'Response' },
            canDeactivate: [UnsavedChangesGuard], 
          },
        ],
      },
      {
        path: 'dynamicReports',
        component: DynamicReportsComponent,
        data: { breadcrumb: 'Dynamic Reports' },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
