import { Component, OnInit } from '@angular/core';
import { VendorHierarchy } from '../../model/vendorHierarchy';
import { VendorHierarchyService } from '../../services/VendorHierarchyService/vendorHierarchy.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendorHierarchy: VendorHierarchy[] = [];

  constructor(
    private vendorHierarchyService: VendorHierarchyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.authService.getRoleFromToken(this.authService.getToken()));
    this.loadVendorHierarchy();
  }

  loadVendorHierarchy(): void {
    const token = this.authService.getToken();
    this.vendorHierarchyService.getVendorHierarchy(token).subscribe(
      (hierarchy: VendorHierarchy[]) => {
        this.vendorHierarchy = hierarchy;
      },
      error => {
        console.error('Error loading vendor hierarchy:', error);
      }
    );
  }

}
