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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaginationComponent } from '../Component/Pagination/pagination/pagination.component';
import { NotificationComponent } from '../Component/notification/notification/notification.component';
import { VendorcardComponent } from '../Component/vendorcard/vendorcard.component';
import { UsercardComponent } from '../Component/usercard/usercard.component';
import { PopupBoxModule } from '../Component/popup-box/popup-box/popup-box.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // other imports
    FormsModule,
  ],
  // declarations, providers, etc.
})
export class AppModule { }


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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PopupBoxModule,
    ReactiveFormsModule
  ],
  declarations: [AdminComponent,UsercardComponent, VendorcardComponent, DashboardComponent,UserManagementComponent,NavItemComponent,TopBarComponent,disclaimerFooterComponent, ExportDialogBoxComponent, VendorManagementComponent, PaginationComponent, NotificationComponent]
})
export class AdminModule { }
