import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { AppComponent } from '../../app/app.component';

@Component({
  selector: 'app-TopBar',
  templateUrl: './TopBar.component.html',
  styleUrls: ['./TopBar.component.css']
})
export class TopBarComponent implements OnInit {


  ngOnInit() {
  }


  constructor(private appComponent: AppComponent) {}
  isSidenavOpen = false;

  openSidenav() {
    this.isSidenavOpen = true;
  }

  closeSidenav() {
    this.isSidenavOpen = false;
  }
}
