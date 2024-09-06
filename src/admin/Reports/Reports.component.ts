import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-Reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  isChildRouteActive = false;
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the child route
        this.isChildRouteActive = this.route.firstChild != null;
      }
    });
  }

  isTableView: boolean = false;

  // Toggle the view between the list and table
  toggleView() {
    this.isTableView = !this.isTableView;
  }
}
