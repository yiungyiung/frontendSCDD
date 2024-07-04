import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from '../model/role';
import { AdminDashboardComponent } from '../Component/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from '../Component/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
  // Add routes for Manager, Analyst, Vendor dashboards
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
