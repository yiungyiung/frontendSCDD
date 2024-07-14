import { Component, OnInit} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'; 
import { User } from '../../model/user';
import { Role } from '../../model/role';
import { AdminService } from '../../services/AdminService/Admin.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { PopupService } from '../../services/PopupService/popup.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: User = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  roles = Object.values(Role).filter(role => role !== Role.Vendor);
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pagedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  selectedColumns: string[] = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active']; 
  allColumns: string[] = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active'];

  constructor(private adminService: AdminService, private authService: AuthService, private cdr: ChangeDetectorRef,private modalService: ExportModalServiceService, private popupService: PopupService ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const token = this.authService.getToken();
    this.adminService.getAllUsers(token).subscribe(
      (serverUsers: User[]) => {
        // Filter out users with Role.Vendor
        this.users = serverUsers
          .filter(user => user.roleId !== this.getRoleId(Role.Vendor))
          .map(user => this.mapServerUserToUser(user));
  
        console.log('Loaded users:', this.users);
        
        // Calculate total items and pages
        this.totalItems = this.users.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedUsers();
      },
    );
  }
  

  updatePagedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedUsers = this.users.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePagedUsers();
  }

  addUser(): void {
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

  
}
