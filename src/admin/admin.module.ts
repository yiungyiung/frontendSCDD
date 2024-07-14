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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { disclaimerFooterComponent} from '../Component/disclaimerFooter/disclaimerFooter.component';
import { ExportDialogBoxComponent } from '../Component/exportDialogBox/exportDialogBox.component';
import { PopupBoxComponent } from '../Component/popup-box/popup-box.component';
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatCardModule,
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule

  ],
  declarations: [AdminComponent,DashboardComponent,UserManagementComponent,NavItemComponent,TopBarComponent,disclaimerFooterComponent, ExportDialogBoxComponent, VendorManagementComponent, PopupBoxComponent]
})
export class AdminModule { }
