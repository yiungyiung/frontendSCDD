import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/DataService/data.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    const token = this.authService.getToken();
    this.dataService.getUsers(token).subscribe(data => {
      this.users = data;
    });
  }
}