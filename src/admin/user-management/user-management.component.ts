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

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
    console.log('Available roles:', this.roles);
  }

  loadUsers() {
    const token = this.authService.getToken();
    this.adminService.getAllUsers(token).subscribe(
      serverUsers => {
        this.users = serverUsers.map(user => this.mapServerUserToUser(user));
        console.log('Loaded users:', this.users);
      },
      error => console.error('Error loading users:', error)
    );
  }

  addUser() {
    if (!this.newUser.role) {
      alert('Please select a role for the new user.');
      return;
    }
  
    const token = this.authService.getToken();
    const userToAdd = { 
      ...this.newUser, 
      roleId: this.getRoleId(this.newUser.role),
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
  
  private getRoleId(role: Role): number {
    switch(role) {
      case Role.Admin: return 1;
      case Role.Manager: return 2;
      case Role.Analyst: return 3;
      case Role.Vendor: return 4;
      default: throw new Error('Invalid role');
    }
  }

  private getRoleFromRoleId(roleId: number): Role {
    switch(roleId) {
      case 1: return Role.Admin;
      case 2: return Role.Manager;
      case 3: return Role.Analyst;
      case 4: return Role.Vendor;
      default: throw new Error('Invalid role ID');
    }
  }

  private mapServerUserToUser(serverUser: any): User {
    return {
      userId: serverUser.userId,
      email: serverUser.email,
      role: this.getRoleFromRoleId(serverUser.roleId),
      name: serverUser.name,
      contact_Number: serverUser.contact_Number,
      isActive: serverUser.isActive
    };
  }

  private resetNewUser() {
    this.newUser = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.isActive;
    const token = this.authService.getToken();
    const updatedUser = { ...user, isActive: newStatus, roleId: this.getRoleId(user.role) };

    this.adminService.updateUser(updatedUser, token).subscribe(
      response => {
        const index = this.users.findIndex(u => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] = this.mapServerUserToUser(response);
        }
      },
      error => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        user.isActive = !newStatus;
      }
    );
  }
}
