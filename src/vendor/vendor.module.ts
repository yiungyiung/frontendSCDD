import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { VendorDashboardComponent } from './VendorDashboard/VendorDashboard.component';
import { DisclaimerFooterComponent } from '../Component/disclaimerFooter/disclaimerFooter.component';
import { NavItemComponent } from '../Component/nav-item/nav-item.component';
import { TopBarComponent } from '../Component/TopBar/TopBar.component';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../app/Shared/Shared.module';
import { QuestionnaireAnsweringComponent } from './QuestionnaireAnswering/QuestionnaireAnswering.component';

@NgModule({
  declarations: [
    VendorComponent,
    VendorDashboardComponent,
    QuestionnaireAnsweringComponent,
  ],
  imports: [CommonModule, RouterModule, VendorRoutingModule, SharedModule],
})
export class VendorModule {}
