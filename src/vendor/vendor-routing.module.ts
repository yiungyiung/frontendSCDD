import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { VendorDashboardComponent } from './VendorDashboard/VendorDashboard.component';
import { QuestionnaireAnsweringComponent } from './QuestionnaireAnswering/QuestionnaireAnswering.component';

const routes: Routes = [
  {
    path: '',
    component: VendorComponent,
    children: [
      { path: 'dashboard', component: VendorDashboardComponent },
      { path: 'answer-questionnaire', component: QuestionnaireAnsweringComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // Add other child routes as needed
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
