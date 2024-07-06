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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'dashboard',
      this.domSanitizer.bypassSecurityTrustResourceUrl('Dashboard.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'framework',
      this.domSanitizer.bypassSecurityTrustResourceUrl('Framework.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'vendors',
      this.domSanitizer.bypassSecurityTrustResourceUrl('vendors.svg')
    )

    this.matIconRegistry.addSvgIcon(
      'ques',
      this.domSanitizer.bypassSecurityTrustResourceUrl('questionnaire.svg')
    )

    this.matIconRegistry.addSvgIcon(
      'users',
      this.domSanitizer.bypassSecurityTrustResourceUrl('users.svg')
    )

    this.matIconRegistry.addSvgIcon(
      'reports',
      this.domSanitizer.bypassSecurityTrustResourceUrl('reports.svg')
    )
  }

  ngOnInit(): void {
  }
}