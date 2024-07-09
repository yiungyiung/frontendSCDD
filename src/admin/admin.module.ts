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

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
  ],
  declarations: [AdminComponent,DashboardComponent,UserManagementComponent,NavItemComponent,TopBarComponent]
})
export class AdminModule { }
