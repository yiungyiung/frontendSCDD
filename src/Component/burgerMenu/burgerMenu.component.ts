import { EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { User } from '../../model/user';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burgerMenu.component.html',
  styleUrls: ['./burgerMenu.component.css']
})
export class BurgerMenuComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild('passwordModal') passwordModal?: TemplateRef<any>;
  private dialogRef?: MatDialogRef<any>;

  constructor(private authservice:AuthService,private dialog: MatDialog){}

  fetchuser:User={ email: '',  name: '', contact_Number: '', isActive: true };
  


  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    var user=this.authservice.getCurrentUser();
    this.fetchuser.email=user!.email;
    this.fetchuser.name=user!.name;
    console.log(user);   
  }

  changepassword() {
    if (this.passwordModal) {
      this.dialogRef = this.dialog.open(this.passwordModal, {
        disableClose: true // Prevents closing on clicking outside or pressing ESC
      });
    }
  }

  closePasswordModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = undefined;
    }
  }


  closeMenu() {
    this.close.emit();
    this.authservice.logout();
  }
}
