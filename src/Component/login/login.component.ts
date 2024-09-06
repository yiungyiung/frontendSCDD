import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf, JsonPipe } from '@angular/common';
import { Role } from '../../model/role';
import { Router } from '@angular/router';
import { PopupService } from '../../services/PopupService/popup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  token = '';
  protectedData = '';
  adminData = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private popupService: PopupService
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.token = response.token;
        console.log('Logged in successfully:', response);
        this.popupService.showPopup('Logged in successfully', '#0F9D09');
        this.authService.setToken(this.token);

        // Manually trigger change detection
        this.cdr.detectChanges();

        const role = this.authService.getRoleFromToken(response.token);
        console.log(role + 'seerole');
        if (role === Role.Admin) {
          this.router.navigate(['/admin']);
        } else if (role === Role.Manager) {
          this.router.navigate(['/manager']);
        } else if (role === Role.Analyst) {
          this.router.navigate(['/analyst']);
        } else if (role === Role.Vendor) {
          this.router.navigate(['/vendor']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.popupService.showPopup(
          'Login Failed. Please try again.',
          '#C10000'
        );
        console.error('Login failed:', error);
      }
    );
  }

  getProtectedData() {
    this.authService.getProtectedData(this.token).subscribe(
      (response) => {
        this.protectedData = response;
        console.log('Protected data:', response);
      },
      (error) => {
        this.popupService.showPopup(
          'Login Failed. Please try again.',
          '#C10000'
        );
        console.error('Failed to get protected data:', error);
      }
    );
  }

  getAdminData() {
    this.authService.getAdminData(this.token).subscribe(
      (response) => {
        this.adminData = response;
        console.log('Admin data:', response);
      },
      (error) => {
        this.popupService.showPopup(
          'Login Failed. Please try again.',
          '#C10000'
        );
        console.error('Failed to get admin data:', error);
      }
    );
  }
}
