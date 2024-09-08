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
  newUser: User = {
    email: '',
    role: Role.Admin,
    name: '',
    contact_Number: '',
    isActive: true,
  };
  selectedUser: User | null = null;
  roles = Object.values(Role).filter((role) => role !== Role.Vendor);
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pagedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  showFileUpload: boolean = false;
  selectedColumns: string[] = [
    'User ID',
    'Email',
    'Name',
    'Contact Number',
    'Role',
    'Is Active',
  ];
  allColumns: string[] = [
    'User ID',
    'Email',
    'Name',
    'Contact Number',
    'Role',
    'Is Active',
  ];
  csvHeaders: string[] = ['Email', 'Name', 'Contact Number', 'Role'];
  isFilterVisible = false;
  searchBy = '';
  searchKeyword = '';
  selectedRoleIds: string[] = [];
  selectedUserStatus: string[] = [];
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
  ngOnInit() {
    this.loadUsers();
  }
  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['User Id', 'User Name', 'Email Id'],
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '',
    },
    {
      name: 'Role',
      type: 'checkbox',
      options: ['Analyst', 'Manager', 'Admin'],
    },
    {
      name: 'User Status',
      type: 'checkbox',
      options: ['Active', 'Inactive'],
    },
  ];
  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }
  closeFilter(): void {
    this.isFilterVisible = false;
  }

  onFilterChange(event: any) {
    console.log(
      'User Data:',
      this.users.map((user) => ({
        id: user.userId,
        isActive: user.isActive,
      }))
    );

    const filters = this.prepareFilters();
    this.filteredUsers = this.filterService.applyFilter(this.users, filters);
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  prepareFilters() {
    const filters: {
      partName: string;
      value: string | string[];
      column: keyof User | ((user: User) => any);
      exactMatch?: boolean;
    }[] = [];

    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    const searchKeywordSubPart = this.filterSubParts.find(
      (part) => part.name === 'Search Keyword'
    );
    const roleSubPart = this.filterSubParts.find(
      (part) => part.name === 'Role'
    );
    const userStatusSubPart = this.filterSubParts.find(
      (part) => part.name === 'User Status'
    );

    const searchByColumnMap: {
      [key: string]: keyof User | ((user: User) => any);
    } = {
      'User Id': 'userId',
      'User Name': 'name',
      'Email Id': 'email',
    };

    if (
      searchBySubPart &&
      searchKeywordSubPart &&
      searchBySubPart.selectedOption
    ) {
      const column = searchByColumnMap[searchBySubPart.selectedOption];
      if (column) {
        filters.push({
          partName: 'Search By',
          value: searchKeywordSubPart.keyword || '',
          column,
          exactMatch: false,
        });
      }
    }
    if (
      userStatusSubPart &&
      userStatusSubPart.selectedOptions &&
      userStatusSubPart.selectedOptions.length > 0
    ) {
      filters.push({
        partName: 'User Status', // Ensure this matches the correct name for user management
        value: userStatusSubPart.selectedOptions,
        column: (user: User) => (user.isActive ? 'Active' : 'Inactive'),
      });
    }
    if (
      roleSubPart &&
      roleSubPart.selectedOptions &&
      roleSubPart.selectedOptions.length > 0
    ) {
      filters.push({
        partName: 'Role',
        value: roleSubPart.selectedOptions,
        column: (user: User) => user.role || '',
      });
    }
    return filters;
  }
  loadUsers() {
    const token = this.authService.getToken();
    this.adminService.getAllUsers(token).subscribe((serverUsers: User[]) => {
      this.users = serverUsers
        .filter(
          (user) => user.roleId !== this.dataFetchService.getRoleId(Role.Vendor)
        )
        .map((user) => this.dataFetchService.mapServerUserToUser(user));
      this.filteredUsers = this.users;
      this.totalItems = this.users.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePagedUsers();
    });
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
    this.pagedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }
  onFileUploadTriggered() {
    this.showFileUpload = true;
  }
  onUserAdded(newUser: User) {
    const token = this.authService.getToken();
    const userToAdd = {
      ...newUser,
      roleId: this.dataFetchService.getRoleId(newUser.role!),
      isActive: true,
    };
    this.adminService.addUser(userToAdd, token).subscribe(
      (serverUser) => {
        this.users.push(this.dataFetchService.mapServerUserToUser(serverUser));
        this.loadUsers();
        this.popupService.showPopup('User added successfully', '#0F9D09');
      },
      (error) => {
        console.error('Error adding user:', error);
        this.popupService.showPopup(
          'Failed to add user. Please try again.',
          '#C10000'
        );
      }
    );
  }
  onUserUpdated(updatedUser: User) {
    const token = this.authService.getToken();
    const userToUpdate = {
      ...updatedUser,
      roleId: this.dataFetchService.getRoleId(updatedUser.role!),
    };
    this.adminService.updateUser(userToUpdate, token).subscribe(
      (response) => {
        const index = this.users.findIndex((u) => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] =
            this.dataFetchService.mapServerUserToUser(response);
          this.updatePagedUsers();
          this.resetSelectedUser();
          this.popupService.showPopup('User updated successfully', '#0F9D09');
        }
      },
      (error) => {
        console.error('Error updating user:', error);
        this.popupService.showPopup(
          'Failed to update user. Please try again.',
          '#C10000'
        );
      }
    );
  }
  resetNewUser() {
    this.newUser = {
      email: '',
      role: Role.Admin,
      name: '',
      contact_Number: '',
      isActive: true,
    };
  }
  resetSelectedUser() {
    this.selectedUser = null;
    this.resetNewUser();
  }
  toggleUserStatus(user: User) {
    const newStatus = !user.isActive;
    const token = this.authService.getToken();
    const updatedUser = {
      ...user,
      isActive: newStatus,
      roleId: this.dataFetchService.getRoleId(user.role!),
    };
    this.adminService.updateUser(updatedUser, token).subscribe(
      (response) => {
        const index = this.users.findIndex((u) => u.userId === response.userId);
        if (index !== -1) {
          this.users[index] =
            this.dataFetchService.mapServerUserToUser(response);
          this.updatePagedUsers();
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        user.isActive = !newStatus;
        this.cdr.detectChanges();
      }
    );
  }
  openExportModal() {
    const data = this.users.map((user) => ({
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
  selectUserForUpdate(user: User) {
    this.selectedUser = { ...user };
  }
  toggleFileUpload(): void {
    this.showFileUpload = !this.showFileUpload;
  }
  onFileParsed(parsedData: any[]): void {
    this.showFileUpload = false;
    const token = this.authService.getToken();
    let successCount = 0;
    let failureCount = 0;
    this.failedUsersUpload = [];
    parsedData.forEach((userData, index) => {
      try {
        const newUser =
          this.dataFetchService.mapServerUserToUserForFileUpload(userData);
        newUser.roleId = this.dataFetchService.getRoleId(userData['Role']);
        this.adminService.addUser(newUser, token).subscribe(
          (response) => {
            this.users.push(
              this.dataFetchService.mapServerUserToUser(response)
            );
            successCount++;
            this.loadUsers();
            if (index === parsedData.length - 1) {
              this.showSummaryPopup(successCount, failureCount);
            }
          },
          (error) => {
            console.error(
              `Error adding user from file at index ${index}:`,
              error
            );
            this.failedUsersUpload.push(newUser.name || 'Unknown User');
            failureCount++;
            if (index === parsedData.length - 1) {
              this.showSummaryPopup(successCount, failureCount);
            }
          }
        );
      } catch (error) {
        console.error(
          `Error processing user data at index ${index}:`,
          userData,
          error
        );
        this.failedUsersUpload.push(userData['Name'] || 'Unknown User');
        failureCount++;
        if (index === parsedData.length - 1) {
          this.showSummaryPopup(successCount, failureCount);
        }
      }
    });
  }
  private showSummaryPopup(successCount: number, failureCount: number): void {
    const message = `${successCount} users added successfully, ${failureCount} could not be added.`;
    this.popupService.showPopup(message, '#0F9D09');
  }
  onCancelFileUpload(): void {
    this.showFileUpload = false;
  }
  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    const roleIdSubPart = this.filterSubParts.find(
      (part) => part.name === 'Role'
    );
    const userStatusSubPart = this.filterSubParts.find(
      (part) => part.name === 'User Status'
    );
    return (
      !!(searchBySubPart && searchBySubPart.selectedOption) ||
      !!(
        roleIdSubPart &&
        roleIdSubPart.selectedOptions &&
        roleIdSubPart.selectedOptions.length > 0
      ) ||
      !!(
        userStatusSubPart &&
        userStatusSubPart.selectedOptions &&
        userStatusSubPart.selectedOptions.length > 0
      )
    );
  }
}
