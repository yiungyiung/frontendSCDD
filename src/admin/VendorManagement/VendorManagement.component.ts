import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
@Component({
  selector: 'app-VendorManagement',
  templateUrl: './VendorManagement.component.html',
  styleUrls: ['./VendorManagement.component.css']
})
export class VendorManagementComponent implements OnInit {
  vendors: Vendor[] = [];
  constructor(private vendorService: VendorService, private authService: AuthService) {}

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe(
      serverVendors => this.vendors = serverVendors,
      error => console.error('Error loading vendors:', error)
    );
  }

 

}
