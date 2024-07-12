import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/DataService/data.service';
import { AuthService } from '../services/AuthService/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private dataService: DataService, private authService: AuthService,
  ){}
  ngOnInit(): void {
  }
}