import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { VendorDashboardComponent } from './VendorDashboard/VendorDashboard.component';
import { QuestionnaireAnsweringComponent } from './QuestionnaireAnswering/QuestionnaireAnswering.component';
import { ResponsePageComponent } from '../Component/ResponsePage/ResponsePage.component';
import { FrameworkDetailsComponent } from '../Component/FrameworkDetails/FrameworkDetails.component';

const routes: Routes = [
  {
    path: '',
    component: VendorComponent,
    data: { breadcrumb: 'vendor' },
    children: [
      {
        path: 'dashboard',
        component: VendorDashboardComponent,
        data: { breadcrumb: 'Dashboard' },
        children: [
          {
            path: 'response-page',
            component: ResponsePageComponent,
            data: { breadcrumb: 'Response' },
          },
        ],
      },
      {
        path: 'answer-questionnaire',
        component: QuestionnaireAnsweringComponent,
        data: { breadcrumb: 'Answer Questionnaire' },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'framework',
        component: FrameworkDetailsComponent,
        data: { breadcrumb: 'Framework' },
      },
      // Add other child routes as needed
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
