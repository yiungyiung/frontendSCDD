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
  }

  loadUsers() {
    const token = this.authService.getToken();
    this.adminService.getAllUsers(token).subscribe(serverUsers => {
      this.users = serverUsers.map(this.mapServerUserToUser);
    });
  }

  addUser() {
    const token = this.authService.getToken();
    this.adminService.addUser(this.newUser, token).subscribe(serverUser => {
      this.users.push(this.mapServerUserToUser(serverUser));
      this.newUser = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
    });
  }

  private mapServerUserToUser(serverUser: any): User {
    return {
      email: serverUser.email,
      role: serverUser.role.roleName as Role,
      name: serverUser.name,
      contact_Number: serverUser.contact_Number,
      isActive: serverUser.isActive
    };
  }

  toggleUserStatus(user: User) {
    user.isActive = !user.isActive;
    // You'll need to implement an update method in your AdminService
    // this.adminService.updateUser(user, this.authService.getToken()).subscribe();
  }
}