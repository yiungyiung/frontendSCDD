import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { User } from '../../model/user';
import { Role } from '../../model/role';
import { AdminService } from '../../services/AdminService/Admin.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { PopupService } from '../../services/PopupService/popup.service';
import { NgForm } from '@angular/forms'; 
import { SubPart } from '../../Component/filter/filter.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterService } from '../../services/FilterService/Filter.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  failedUsersUpload: string[] = [];
  newUser: User = { email: '', role: Role.Admin, name: '', contact_Number: '', isActive: true };
  selectedUser: User | null = null;
  roles = Object.values(Role).filter(role => role !== Role.Vendor);
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pagedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  showFileUpload: boolean = false;
  selectedColumns: string[] = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active']; 
  allColumns: string[] = ['User ID', 'Email', 'Name', 'Contact Number', 'Role', 'Is Active'];
  csvHeaders: string[] = ['Email', 'Name', 'Contact Number', 'Role'];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private modalService: ExportModalServiceService,
    private popupService: PopupService ,
    private filterService  :FilterService
  ) {}

  ngOnInit() {
    this.loadUsers();
    
  }
  

  // Define your filter parts and the criteria to be used for filtering.
filterSubParts: SubPart[] = [
  {
    name: 'Search By',
    type: 'MCQ',
    options: ['User Id', 'User Name', 'Email Id']
  },
  {
    name: 'Search Keyword',
    type: 'searchBar',
    keyword: '' 
  },
  {
    name: 'Role',
    type: 'checkbox',
    options: ['Analyst','Manager','Admin']
  },
  {
    name: 'User Status',
    type: 'checkbox',
    options: ['Active','Inactive']
  }
];

isFilterVisible = false;
searchBy = '';
searchKeyword = '';
selectedRoleIds: string[] = [];
selectedUserStatus: string[] = [];

// Toggle filter visibility
toggleFilterVisibility() {
  this.isFilterVisible = !this.isFilterVisible;
}

// Close the filter
closeFilter(): void {
  this.isFilterVisible = false;
}

onFilterChange(event: any) {
  this.filteredUsers = this.filterService.applyFilter(this.users, this.filterSubParts, {
    'User Id': (user) => user.userId,
    'User Name': (user) => user.name,
    'Email Id': (user) => user.email
  });
  this.totalItems = this.filteredUsers.length;
  this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  this.currentPage = 1;
  this.updatePagedUsers();
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
        
        this.filteredUsers = this.users;
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
    this.pagedUsers = this.filteredUsers.slice(startIndex, endIndex);
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
        console.log('popup userdeatail');
        this.popupService.showPopup('Failed to add user. Please try again.', '#C10000');
        console.log('popup serfice completedddd');
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

  toggleFileUpload(): void {
    console.log("visbility triggered");
    this.showFileUpload = !this.showFileUpload;
  }

  onFileParsed(parsedData: any[]): void {
    this.showFileUpload = false;
    console.log('Parsed data received:', parsedData);
    const token = this.authService.getToken();
    
    let successCount = 0;
    let failureCount = 0;
    this.failedUsersUpload = [];
    
    parsedData.forEach((userData, index) => {
      try {
        console.log('usrdata:',userData);
        // Map the CSV data to the User object
        const newUser = this.mapServerUserToUserForFileUpload(userData);
        // Set the roleId based on the role name in userData
        newUser.roleId = this.getRoleId(userData['Role']);
  
        console.log('User to be added:', newUser);
  
        this.adminService.addUser(newUser, token).subscribe(
          (response) => {
            console.log("got error yet??");
            this.users.push(this.mapServerUserToUser(response));
            console.log('User added from file successfully:', response);
            successCount++;
            this.loadUsers();
            if (index === parsedData.length - 1) {
              this.triggerNotification(successCount, failureCount);
              this.showSummaryPopup(successCount, failureCount);
            }
          },
          (error) => {
            console.error(`Error adding user from file at index ${index}:`, error);
            this.failedUsersUpload.push(newUser.name || 'Unknown User');
            failureCount++;
            if (index === parsedData.length - 1) {
              this.triggerNotification(successCount, failureCount);
              this.showSummaryPopup(successCount, failureCount);
            }
          }
        );
      } catch (error) {
        console.error(`Error processing user data at index ${index}:`, userData, error);
        this.failedUsersUpload.push(userData['Name'] || 'Unknown User');
        failureCount++;
        if (index === parsedData.length - 1) {
          this.triggerNotification(successCount, failureCount);
          this.showSummaryPopup(successCount, failureCount);
        }
      }
    });
  }
  
  private showSummaryPopup(successCount: number, failureCount: number): void {
    const message = `${successCount} users added successfully, ${failureCount} could not be added.`;
    this.popupService.showPopup(message,'#0F9D09');
  }

  onCancelFileUpload(): void {
    this.showFileUpload = false;
  }

  mapServerUserToUserForFileUpload(userData: any): User {
    return {
      userId: userData['User ID'],
      email: userData['Email'],
      name: userData['Name'],
      contact_Number: userData['Contact Number'],
      role: userData['Role'],
      isActive: userData['Is Active'] === 'true'
    };
  }

  private triggerNotification(successCount: number, failureCount: number): void {
    // Triggering notification for failed users
    if (failureCount > 0) {
      // Add any additional logic if necessary
      console.log('Notification triggered for failed users');
    }
  }

  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(part => part.name === 'Search By');
    const roleIdSubPart = this.filterSubParts.find(part => part.name === 'Role');
    const userStatusSubPart = this.filterSubParts.find(part => part.name === 'User Status');
  console.log("filtter applieddd....",!!(searchBySubPart && searchBySubPart.selectedOption) ||
  !!(roleIdSubPart && roleIdSubPart.selectedOptions && roleIdSubPart.selectedOptions.length > 0) ||
  !!(userStatusSubPart && userStatusSubPart.selectedOptions && userStatusSubPart.selectedOptions.length > 0)
)
    return (
      !!(searchBySubPart && searchBySubPart.selectedOption) ||
      !!(roleIdSubPart && roleIdSubPart.selectedOptions && roleIdSubPart.selectedOptions.length > 0) ||
      !!(userStatusSubPart && userStatusSubPart.selectedOptions && userStatusSubPart.selectedOptions.length > 0)
    );
  }
  
}