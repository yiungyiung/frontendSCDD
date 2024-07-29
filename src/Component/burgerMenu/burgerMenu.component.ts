import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burgerMenu.component.html',
  styleUrls: ['./burgerMenu.component.css']
})
export class BurgerMenuComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  constructor(private authservice:AuthService){}

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


  closeMenu() {
    this.close.emit();
    this.authservice.logout();
  }
}
