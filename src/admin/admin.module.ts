import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NavItemComponent } from '../Component/nav-item/nav-item.component';
import { TopBarComponent } from '../Component/TopBar/TopBar.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VendorManagementComponent } from './VendorManagement/VendorManagement.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { DisclaimerFooterComponent } from '../Component/disclaimerFooter/disclaimerFooter.component';
import { ExportDialogBoxComponent } from '../Component/exportDialogBox/exportDialogBox.component';
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatCardModule,
    NgxPaginationModule

  ],
  declarations: [AdminComponent,DashboardComponent,UserManagementComponent,NavItemComponent,TopBarComponent,DisclaimerFooterComponent, ExportDialogBoxComponent, VendorManagementComponent]
})
export class AdminModule { }
