import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { Role } from '../../model/role';
import { AdminService } from '../../services/AdminService/Admin.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: User = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };

  roles = Object.values(Role).filter(role => role !== Role.Vendor);

  constructor(private adminService: AdminService, private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
    console.log('Available roles:', this.roles);
  }

  loadUsers() {
    const token = this.authService.getToken();
    this.adminService.getAllUsers(token).subscribe(serverUsers => {
      this.users = serverUsers.map(this.mapServerUserToUser);
      console.log('Loaded users:', this.users);
    });
  }

  addUser() {
    if (!this.newUser.role) {
      alert('Please select a role for the new user.');
      return;
    }
  
    const token = this.authService.getToken();
    const userToAdd = { 
      ...this.newUser, 
      roleId: this.getRoleId(this.newUser.role),  // Add this line
      isActive: true 
    };
    this.adminService.addUser(userToAdd, token).subscribe(
      serverUser => {
        this.users.push(this.mapServerUserToUser(serverUser));
        this.resetNewUser();
      },
      error => {
        console.error('Error adding user:', error);
        alert('Failed to add user. Please try again.');
      }
    );
  }
  
  // Add this method
  private getRoleId(role: Role): number {
    switch(role) {
      case Role.Admin: return 1;
      case Role.Manager: return 2;
      case Role.Analyst: return 3;
      // Add other roles as needed
      default: throw new Error('Invalid role');
    }
  }
  private mapServerUserToUser(serverUser: any): User {
    return {
      userId: serverUser.userId,
      email: serverUser.email,
      role: serverUser.role.roleName as Role,
      name: serverUser.name,
      contact_Number: serverUser.contact_Number,
      isActive: serverUser.isActive
    };
  }

  private resetNewUser() {
    this.newUser = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
    console.log('Reset new user:', this.newUser);
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.isActive;
    console.log('Toggling user status:', user.email, 'to', newStatus);
    
    const token = this.authService.getToken();
    
    // Create a new User object with updated properties
    const updatedUser = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role:user.role,
      contact_Number: user.contact_Number,
      isActive: newStatus,
      roleId: this.getRoleId(user.role) , // Convert role to roleId
      
    };
    console.log('Sending update request:', JSON.stringify(updatedUser));
    this.adminService.updateUser(updatedUser, token).subscribe(
      (response: User) => {
        console.log('User updated successfully:', response);
        // Update the user in the users array
        const index = this.users.findIndex(u => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] = response;
        }
      },
      error => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        // Revert the status change in case of error
        user.isActive = !newStatus;
      }
    );
  }

}