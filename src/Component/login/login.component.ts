import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  token = '';
  protectedData = '';
  adminData = '';

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.email, this.password).subscribe(response => {
      this.token = response.token;
      console.log('Logged in successfully:', response);
    }, error => {
      console.error('Login failed:', error);
    });
  }

  getProtectedData() {
    this.authService.getProtectedData(this.token).subscribe(response => {
      this.protectedData = response;
      console.log('Protected data:', response);
    }, error => {
      console.error('Failed to get protected data:', error);
    });
  }

  getAdminData() {
    this.authService.getAdminData(this.token).subscribe(response => {
      this.adminData = response;
      console.log('Admin data:', response);
    }, error => {
      console.error('Failed to get admin data:', error);
    });
  }
}
