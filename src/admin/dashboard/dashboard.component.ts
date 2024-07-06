import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth.service';
import { DataService } from '../../services/DataService/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {
  }

  fetchUsers(): void {
    const token = this.authService.getToken();
    this.dataService.getUsers(token).subscribe(data => {
      this.users = data;
    });
  }
}
