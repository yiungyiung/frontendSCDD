import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-TopBar',
  templateUrl: './TopBar.component.html',
  styleUrls: ['./TopBar.component.scss'],
})
export class TopBarComponent implements OnInit {
  isSidenavOpen = false;
  showBurgerMenu = false;
  isNotificationOpen = false;  // Add this property

  constructor() {}

  ngOnInit() {}

  openSidenav() {
    this.isSidenavOpen = true;
  }

  closeSidenav() {
    this.isSidenavOpen = false;
  }

  toggleBurgerMenu() {
    this.showBurgerMenu = !this.showBurgerMenu;
  }

  openNotificationSidebar() {
    this.isNotificationOpen = true;
  }

  closeNotificationSidebar() {
    this.isNotificationOpen = false;
  }
}
