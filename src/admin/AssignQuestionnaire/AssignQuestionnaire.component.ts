import { Component, OnInit } from '@angular/core';
import { VendorHierarchy } from '../../model/vendorHierarchy';
import { VendorHierarchyService } from '../../services/VendorHierarchyService/vendorHierarchy.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-AssignQuestionnaire',
  templateUrl: './AssignQuestionnaire.component.html',
  styleUrls: ['./AssignQuestionnaire.component.css']
})
export class AssignQuestionnaireComponent implements OnInit {
  vendorHierarchy: VendorHierarchy[] = [];

  constructor(
    private vendorHierarchyService: VendorHierarchyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadVendorHierarchy();
  }

  loadVendorHierarchy(): void {
    const token = this.authService.getToken();
    this.vendorHierarchyService.getVendorHierarchy(token).subscribe(
      (hierarchy: VendorHierarchy[]) => {
        this.vendorHierarchy = hierarchy;
        console.log('Updated vendorHierarchy array inside callback:', this.vendorHierarchy);

        // Call any additional methods or perform actions with the data here
        this.performAdditionalSetup();
      },
      error => {
        console.error('Error loading vendor hierarchy:', error);
      }
    );
  }

  performAdditionalSetup(): void {
    // Perform any operations with the vendorHierarchy array after it's loaded
    console.log('Performing additional setup with vendor hierarchy:', this.vendorHierarchy);
    // Additional logic here, such as initializing components that depend on the data
  }
}
