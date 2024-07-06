// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from '../model/role';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from '../Component/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
