import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Vendor } from '../../model/vendor';
import { Framework } from '../../model/entity';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-CreateNewQuestionnaire',
  templateUrl: './CreateNewQuestionnaire.component.html',
  styleUrls: ['./CreateNewQuestionnaire.component.css'],
})
export class CreateNewQuestionnaireComponent implements OnInit {
  questionnaireForm!: FormGroup;
  vendors?: Vendor[];
  frameworks?: Framework[];
  categorizedVendors: any[] = [];
  selectedCategoryID: number | undefined;
  selectedFrameworkID?: number;
  selectedVendors: Set<number> = new Set<number>();
  disabledCategories: Set<number> = new Set<number>();
  toggledSubParts: { [key: string]: boolean } = {};

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private entityService: EntityService,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.getVendors();
    this.getFrameworks();
  }

  initForm() {
    this.questionnaireForm = this.formBuilder.group({
      framework: ['', Validators.required],
      vendors: this.formBuilder.array([], Validators.required), // Ensure at least one vendor is selected
    });
  }

  get vendorsFormArray() {
    return this.questionnaireForm.get('vendors') as FormArray;
  }

  getVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe((vendors: Vendor[]) => {
      this.vendors = vendors;
      this.categorizeVendors();
    });
  }

  getFrameworks() {
    const token = this.authService.getToken();
    this.entityService
      .GetAllFrameworks(token)
      .subscribe((frameworks: Framework[]) => {
        this.frameworks = frameworks;

        // Set the first framework as the default value if frameworks exist
        if (this.frameworks && this.frameworks.length > 0) {
          this.questionnaireForm.patchValue({
            framework: this.frameworks[0].frameworkID,
          });
        }
      });
  }

  categorizeVendors() {
    const categoriesMap = new Map<
      number,
      { categoryID: number; categoryName: string; vendors: Vendor[] }
    >();
    this.vendors?.forEach((vendor: Vendor) => {
      if (vendor.categoryID !== undefined) {
        if (!categoriesMap.has(vendor.categoryID)) {
          categoriesMap.set(vendor.categoryID, {
            categoryID: vendor.categoryID,
            categoryName: vendor.category?.categoryName || 'Unknown',
            vendors: [],
          });
        }
        categoriesMap.get(vendor.categoryID)?.vendors.push(vendor);
      }
    });
    this.categorizedVendors = Array.from(categoriesMap.values());
  }

  isVendorSelected(vendorID: number | undefined): boolean {
    return vendorID !== undefined && this.selectedVendors.has(vendorID);
  }

  onVendorSelect(vendorID: number | undefined): void {
    if (vendorID === undefined) return;

    if (this.isVendorSelected(vendorID)) {
      this.selectedVendors.delete(vendorID);
    } else {
      this.selectedVendors.add(vendorID);
    }

    this.updateSelectedCategory();
    this.updateVendorsFormArray(); // Synchronize FormArray with selected vendors
  }
  updateVendorsFormArray() {
    const formArray = this.vendorsFormArray;
    formArray.clear(); // Clear the form array

    this.selectedVendors.forEach((vendorID) => {
      formArray.push(this.formBuilder.control(vendorID)); // Add each selected vendor to the form array
    });
  }

  toggleSelectAll(categoryID: number): void {
    const category = this.categorizedVendors.find(
      (cat) => cat.categoryID === categoryID
    );
    if (category) {
      const allSelected = category.vendors.every(
        (vendor: Vendor) =>
          vendor.vendorID !== undefined &&
          this.selectedVendors.has(vendor.vendorID)
      );
      if (allSelected) {
        category.vendors.forEach((vendor: Vendor) => {
          if (vendor.vendorID !== undefined) {
            this.selectedVendors.delete(vendor.vendorID);
          }
        });
      } else {
        category.vendors.forEach((vendor: Vendor) => {
          if (vendor.vendorID !== undefined) {
            this.selectedVendors.add(vendor.vendorID);
          }
        });
      }
    }
    this.updateSelectedCategory();
    this.updateVendorsFormArray();
  }

  isAllVendorsSelected(categoryID: number): boolean {
    const category = this.categorizedVendors.find(
      (cat) => cat.categoryID === categoryID
    );
    return category
      ? category.vendors.every(
          (vendor: Vendor) =>
            vendor.vendorID !== undefined &&
            this.selectedVendors.has(vendor.vendorID)
        )
      : false;
  }

  updateSelectedCategory() {
    if (this.selectedVendors.size > 0) {
      // Find the first selected vendor where vendorID is not undefined
      const firstSelectedVendor = this.vendors?.find(
        (v) => v.vendorID !== undefined && this.selectedVendors.has(v.vendorID)
      );
      this.selectedCategoryID = firstSelectedVendor?.categoryID;
    } else {
      this.selectedCategoryID = undefined;
    }

    // Update disabled categories based on selectedCategoryID
    this.disabledCategories.clear(); // Clear all disabled categories first

    if (this.selectedCategoryID !== undefined) {
      // Disable all categories except the selected one
      this.categorizedVendors.forEach((category) => {
        if (category.categoryID !== this.selectedCategoryID) {
          this.disabledCategories.add(category.categoryID);
        }
      });
    }
  }

  onFrameworkSelected(frameworkId: number) {
    this.selectedFrameworkID = frameworkId;
    this.questionnaireForm.patchValue({ framework: frameworkId });
  }

  toggleSubPart(categoryID: number): void {
    this.toggledSubParts[categoryID] = !this.toggledSubParts[categoryID];
  }

  isSubPartToggled(categoryID: number): boolean {
    return !!this.toggledSubParts[categoryID];
  }

  onSubmit() {
    console.log('Form Valid:', this.questionnaireForm.valid);
    console.log('Form Errors:', this.questionnaireForm.errors);
    console.log('Form Controls:', this.questionnaireForm.controls);
    console.log('Vendors:', this.vendorsFormArray.value);
    console.log(this.questionnaireForm.value.framework);
    if (this.questionnaireForm.valid) {
      const selectedVendors = this.vendorsFormArray.value.map(
        (vendorID: number) => {
          const vendor = this.vendors?.find((v) => v.vendorID === vendorID);
          return {
            vendorID: vendor?.vendorID,
            vendorName: vendor?.vendorName,
            categoryID: vendor?.categoryID,
            categoryName: vendor?.category?.categoryName,
          };
        }
      );

      const selectedFrameworkID = this.questionnaireForm.value.framework;
      const selectedFramework = this.frameworks?.find(
        (f) => f.frameworkID === selectedFrameworkID
      );

      console.log('Selected Framework:', selectedFramework);
      console.log('Selected Vendors:', selectedVendors);
      this.router
        .navigate(['/admin/select-questions'], {
          state: {
            frameworkID: selectedFrameworkID,
            vendorCategories: selectedVendors.map((v: Vendor) => v.categoryID),
          },
        })
        .then((success) => {
          if (success) {
            console.log('Navigation successful');
          } else {
            console.log('Navigation failed');
          }
        })
        .catch((err) => {
          console.error('Navigation error:', err);
        });
      // Here you can add code to store the data as needed
    } else {
      console.log('Form is invalid');
      Object.values(this.questionnaireForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}