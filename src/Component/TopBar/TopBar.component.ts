import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-TopBar',
  templateUrl: './TopBar.component.html',
  styleUrls: ['./TopBar.component.css']
})
export class TopBarComponent implements OnInit {
  isSidenavOpen = false;
  showBurgerMenu = false;

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
}
