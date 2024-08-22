import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { ChangePasswordDto } from '../../model/ChangePasswordDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {
  @Input() isOpen: boolean = true;
  @Output() closeModal = new EventEmitter<void>();

  changePasswordDto: ChangePasswordDto = {
    userId: 0,
    oldPassword: '',
    newPassword: ''
  };
  
  confirmPassword: string = '';  // New field added

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    // Check if newPassword and confirmPassword match
    if (this.changePasswordDto.newPassword !== this.confirmPassword) {
      this.showError('Passwords do not match!');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !user.userId) {
      this.showError('User not found. Please log in again.');
      return;
    }
    
    this.changePasswordDto.userId = user.userId;
    const token = this.authService.getToken();
    if (!token) {
      this.showError('Authentication token not found. Please log in again.');
      return;
    }

    this.authService.changePassword(this.changePasswordDto, token).subscribe(
      response => {
        this.showSuccess('Password changed successfully');
        this.close();
      },
      error => {
        console.error('Error changing password', error);
        this.showError('Failed to change password. Please try again.');
      }
    );
  }

  close() {
    this.closeModal.emit();
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',  // Display the snackbar at the top
      panelClass: [],  // No need for CSS classes
      data: {
        styles: {
          backgroundColor: '#f44336',  // Red color for error
          color: '#ffffff',  // White text
        }
      }
    });
  }
  
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',  // Display the snackbar at the top
      panelClass: [],  // No need for CSS classes
      data: {
        styles: {
          backgroundColor: '#4caf50',  // Green color for success
          color: '#ffffff',  // White text
        }
      }
    });
  }
}
