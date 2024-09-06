import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../model/user';
import { Role } from '../../model/role';

@Component({
  selector: 'app-userForm',
  templateUrl: './userForm.component.html',
  styleUrls: ['./userForm.component.scss'],
})
export class UserFormComponent {
  @Input() selectedUser: User | null = null;
  @Input() roles: Role[] = [];
  @Output() userAdded = new EventEmitter<User>();
  @Output() userUpdated = new EventEmitter<User>();
  @Output() fileUploadTriggered = new EventEmitter<void>();

  newUser: User = {
    email: '',
    role: Role.Admin,
    name: '',
    contact_Number: '',
    isActive: true,
  };

  @ViewChild('userForm') userForm!: NgForm;

  toggleFileUpload(): void {
    this.fileUploadTriggered.emit();
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
    return this.selectedUser
      ? this.selectedUser.contact_Number
      : this.newUser.contact_Number;
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

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.selectedUser) {
      this.userUpdated.emit(this.selectedUser);
    } else {
      this.userAdded.emit(this.newUser);
      this.resetNewUser();
    }
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
}
