import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/DataService/data.service';
import { AuthService } from '../services/AuthService/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
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