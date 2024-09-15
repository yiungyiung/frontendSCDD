import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../model/user';
import { Role } from '../../model/role';
import { AdminService } from '../../services/AdminService/Admin.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { PopupService } from '../../services/PopupService/popup.service';
import { SubPart } from '../../Component/filter/filter.component';
import { FormBuilder } from '@angular/forms';
import { FilterService } from '../../services/FilterService/Filter.service';
import { DataFetchService } from '../../services/DataFetchService/DataFetch.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  failedUsersUpload: string[] = [];
  newUser: User = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  selectedUser: User | null = null;
  roles = Object.values(Role).filter((role) => role !== Role.Vendor);
  itemsPerPageOptions = [5, 10, 20, 50];
  pagedUsers: User[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  showFileUpload = false;
  selectedColumns = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active'];
  allColumns = [...this.selectedColumns];
  csvHeaders = ['Email', 'Name', 'Contact Number', 'Role'];
  isFilterVisible = false;
  filterSubParts: SubPart[] = [
    { name: 'Search By', type: 'MCQ', options: ['User Id', 'User Name', 'Email Id'] },
    { name: 'Search Keyword', type: 'searchBar', keyword: '' },
    { name: 'Role', type: 'checkbox', options: ['Analyst', 'Manager', 'Admin'] },
    { name: 'User Status', type: 'checkbox', options: ['Active', 'Inactive'] },
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private modalService: ExportModalServiceService,
    private popupService: PopupService,
    private filterService: FilterService,
    private dataFetchService: DataFetchService
  ) {}

  ngOnInit() { this.loadUsers(); }

  toggleFilterVisibility() { this.isFilterVisible = !this.isFilterVisible; }
  closeFilter() { this.isFilterVisible = false; }

  onFilterChange() {
    this.filteredUsers = this.filterService.applyFilter(this.users, this.prepareFilters());
    this.updatePagination();
  }

  prepareFilters() {
    const filters: {
      partName: string;
      value: string | string[];
      column: keyof User | ((user: User) => any);
      exactMatch?: boolean;
    }[] = [];

    const searchByColumnMap: { [key: string]: keyof User } = {
      'User Id': 'userId',
      'User Name': 'name',
      'Email Id': 'email'
    };

    const searchBy = this.filterSubParts.find(part => part.name === 'Search By');
    const searchKeyword = this.filterSubParts.find(part => part.name === 'Search Keyword');
    const role = this.filterSubParts.find(part => part.name === 'Role');
    const userStatus = this.filterSubParts.find(part => part.name === 'User Status');

    if (searchBy?.selectedOption && searchKeyword?.keyword) {
      const column = searchByColumnMap[searchBy.selectedOption as keyof typeof searchByColumnMap];
      if (column) {
        filters.push({
          partName: 'Search By',
          value: searchKeyword.keyword,
          column: column,
          exactMatch: false,
        });
      }
    }

    if (userStatus?.selectedOptions?.length) {
      filters.push({
        partName: 'User Status',
        value: userStatus.selectedOptions,
        column: (user: User) => user.isActive ? 'Active' : 'Inactive',
      });
    }

    if (role?.selectedOptions?.length) {
      filters.push({
        partName: 'Role',
        value: role.selectedOptions,
        column: 'role',
      });
    }

    return filters;
  }

  loadUsers() {
    this.adminService.getAllUsers(this.authService.getToken()).subscribe(serverUsers => {
      this.users = serverUsers
        .filter(user => user.roleId !== this.dataFetchService.getRoleId(Role.Vendor))
        .map(user => this.dataFetchService.mapServerUserToUser(user));
      this.filteredUsers = this.users;
      this.updatePagination();
    });
  }

  updatePagination() {
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedUsers();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.updatePagination();
  }

  updatePagedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedUsers = this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onFileUploadTriggered() { this.showFileUpload = true; }

  onUserAdded(newUser: User) {
    const userToAdd = { ...newUser, roleId: this.dataFetchService.getRoleId(newUser.role!), isActive: true };
    this.adminService.addUser(userToAdd, this.authService.getToken()).subscribe(
      serverUser => {
        this.users.push(this.dataFetchService.mapServerUserToUser(serverUser));
        this.loadUsers();
        this.popupService.showPopup('User added successfully', '#0F9D09');
      },
      error => {
        console.error('Error adding user:', error);
        this.popupService.showPopup('Failed to add user. Please try again.', '#C10000');
      }
    );
  }

  onUserUpdated(updatedUser: User) {
    const userToUpdate = { ...updatedUser, roleId: this.dataFetchService.getRoleId(updatedUser.role!) };
    this.adminService.updateUser(userToUpdate, this.authService.getToken()).subscribe(
      response => {
        const index = this.users.findIndex(u => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] = this.dataFetchService.mapServerUserToUser(response);
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

  resetSelectedUser() {
    this.selectedUser = null;
    this.newUser = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  }

  toggleUserStatus(user: User) {
    const updatedUser = { ...user, isActive: !user.isActive, roleId: this.dataFetchService.getRoleId(user.role!) };
    this.adminService.updateUser(updatedUser, this.authService.getToken()).subscribe(
      response => {
        const index = this.users.findIndex(u => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] = this.dataFetchService.mapServerUserToUser(response);
          this.updatePagedUsers();
          this.cdr.detectChanges();
        }
      },
      error => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        user.isActive = !updatedUser.isActive;
        this.cdr.detectChanges();
      }
    );
  }

  openExportModal() {
    const data = this.users.map(user => ({
      'User ID': user.userId,
      Email: user.email,
      Name: user.name,
      'Contact Number': user.contact_Number,
      Role: user.role,
      'Is Active': user.isActive,
    }));
    this.modalService.setDataAndColumns(data, this.selectedColumns);
    this.modalService.showExportModal();
  }

  selectUserForUpdate(user: User) { this.selectedUser = { ...user }; }

  toggleFileUpload() { this.showFileUpload = !this.showFileUpload; }

  onFileParsed(parsedData: any[]): void {
    this.showFileUpload = false;
    let successCount = 0;
    let failureCount = 0;
    this.failedUsersUpload = [];

    parsedData.forEach((userData, index) => {
      try {
        const newUser = this.dataFetchService.mapServerUserToUserForFileUpload(userData);
        newUser.roleId = this.dataFetchService.getRoleId(userData['Role']);
        this.adminService.addUser(newUser, this.authService.getToken()).subscribe(
          response => {
            this.users.push(this.dataFetchService.mapServerUserToUser(response));
            successCount++;
            if (index === parsedData.length - 1) this.showSummaryPopup(successCount, failureCount);
          },
          error => {
            console.error(`Error adding user from file at index ${index}:`, error);
            this.failedUsersUpload.push(newUser.name || 'Unknown User');
            failureCount++;
            if (index === parsedData.length - 1) this.showSummaryPopup(successCount, failureCount);
          }
        );
      } catch (error) {
        console.error(`Error processing user data at index ${index}:`, userData, error);
        this.failedUsersUpload.push(userData['Name'] || 'Unknown User');
        failureCount++;
        if (index === parsedData.length - 1) this.showSummaryPopup(successCount, failureCount);
      }
    });
  }

  private showSummaryPopup(successCount: number, failureCount: number): void {
    this.popupService.showPopup(`${successCount} users added successfully, ${failureCount} could not be added.`, '#0F9D09');
  }

  onCancelFileUpload(): void { this.showFileUpload = false; }

  isFilterApplied(): boolean {
    const searchBy = this.filterSubParts.find(part => part.name === 'Search By');
    const role = this.filterSubParts.find(part => part.name === 'Role');
    const userStatus = this.filterSubParts.find(part => part.name === 'User Status');
    return !!(searchBy?.selectedOption) || 
           !!(role?.selectedOptions?.length) || 
           !!(userStatus?.selectedOptions?.length);
  }
}