import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../model/user';
import { Role } from '../../model/role';
import { AdminService } from '../../services/AdminService/Admin.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { PopupService } from '../../services/PopupService/popup.service';
import { NgForm } from '@angular/forms'; 

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: User = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  selectedUser: User | null = null;
  roles = Object.values(Role).filter(role => role !== Role.Vendor);
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pagedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  selectedColumns: string[] = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active']; 
  allColumns: string[] = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active'];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private modalService: ExportModalServiceService,
    private popupService: PopupService 
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  get email(): string {
    return this.selectedUser ? this.selectedUser.email : this.newUser.email;
  }
  set email(value: string) {
    if (this.selectedUser) {
      this.selectedUser.email = value;
    } else {
      this.newUser.email = value;
    }
  }

  get name(): string {
    return this.selectedUser ? this.selectedUser.name : this.newUser.name;
  }
  set name(value: string) {
    if (this.selectedUser) {
      this.selectedUser.name = value;
    } else {
      this.newUser.name = value;
    }
  }

  get contactNumber(): string {
    return this.selectedUser ? this.selectedUser.contact_Number : this.newUser.contact_Number;
  }
  set contactNumber(value: string) {
    if (this.selectedUser) {
      this.selectedUser.contact_Number = value;
    } else {
      this.newUser.contact_Number = value;
    }
  }

  get role(): Role | undefined {
    return this.selectedUser ? this.selectedUser.role : this.newUser.role;
  }
  
  set role(value: Role | undefined) {
    if (this.selectedUser) {
      this.selectedUser.role = value;
    } else {
      this.newUser.role = value;
    }
  }

  loadUsers() {
    const token = this.authService.getToken();
    this.adminService.getAllUsers(token).subscribe(
      (serverUsers: User[]) => {
        this.users = serverUsers
          .filter(user => user.roleId !== this.getRoleId(Role.Vendor))
          .map(user => this.mapServerUserToUser(user));
  
        console.log('Loaded users:', this.users);
        
        this.totalItems = this.users.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedUsers();
      },
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedUsers();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; 
    this.updatePagedUsers();
  }

  updatePagedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  addUser(userForm: NgForm): void {
    if (userForm.invalid) {
      return;
    }
    
    if (!this.newUser.role) {
      this.popupService.showPopup('Please select a role for the new user.', '#C10000');
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
        this.loadUsers();
        this.resetNewUser();
        this.popupService.showPopup('User added successfully', '#0F9D09');
      },
      error => {
        console.error('Error adding user:', error);
        this.popupService.showPopup('Failed to add user. Please try again.', '#C10000');
      }
    );
  }

  updateUser(userForm: NgForm): void {
    if (userForm.invalid || !this.selectedUser) {
      return;
    }

    const token = this.authService.getToken();
    const userToUpdate = { 
      ...this.selectedUser, 
      roleId: this.getRoleId(this.selectedUser.role!)
    };
    this.adminService.updateUser(userToUpdate, token).subscribe(
      updatedUser => {
        const index = this.users.findIndex(u => u.userId === updatedUser.userId);
        if (index !== -1) {
          this.users[index] = this.mapServerUserToUser(updatedUser);
          this.updatePagedUsers();
          this.resetSelectedUser();
          this.popupService.showPopup('User updated successfully', '#0F9D09');
        }
      },
      error => {
        console.error('Error updating user:', error);
        this.popupService.showPopup('Failed to update user. Please try again.', '#C10000');
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

  private getRoleFromRoleId(roleId: number): Role {
    switch(roleId) {
      case 1: return Role.Admin;
      case 2: return Role.Manager;
      case 3: return Role.Analyst;
      case 4: return Role.Vendor;
      default: throw new Error('Invalid role ID');
    }
  }

  resetNewUser() {
    this.newUser = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  }

  resetSelectedUser() {
    this.selectedUser = null;
    this.resetNewUser();
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.isActive;
    const token = this.authService.getToken();
    const updatedUser = { ...user, isActive: newStatus, roleId: this.getRoleId(user.role!) };

    this.adminService.updateUser(updatedUser, token).subscribe(
      response => {
        const index = this.users.findIndex(u => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] = this.mapServerUserToUser(response);
          this.updatePagedUsers();
          this.cdr.detectChanges();  
        }
      },
      error => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        user.isActive = !newStatus;
        this.cdr.detectChanges(); 
      }
    );
  }

  paginationText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start} - ${end} of ${this.totalItems}`;
  }

  openExportModal() {
    const data = this.users.map(user => ({
      'User ID': user.userId,
      'Email': user.email,
      'Name': user.name,
      'Contact Number': user.contact_Number,
      'Role': user.role,
      'Is Active': user.isActive
    }));
    
    this.modalService.setDataAndColumns(data, this.selectedColumns);
    this.modalService.showExportModal();
  }

  selectUserForUpdate(user: User) {
    this.selectedUser = { ...user };
  }
}