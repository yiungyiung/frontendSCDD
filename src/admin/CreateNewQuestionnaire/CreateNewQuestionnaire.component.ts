import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Vendor } from '../../model/vendor';
import { Framework } from '../../model/entity';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { Router } from '@angular/router';
import { FilterService } from '../../services/FilterService/Filter.service';
import { SubPart } from '../../Component/filter/filter.component';

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
  isFilterVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private entityService: EntityService,
    private authService: AuthService,
    private router: Router,
    private filterService: FilterService
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

  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['User Id', 'Vendor Id', 'Vendor Name', 'Email Id'],
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '',
    },
  ];

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  closeFilter(): void {
    this.isFilterVisible = false;
  }

  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );

    return !!(searchBySubPart && searchBySubPart.selectedOption);
  }

  onFilterChange(event: any) {
    const filteredVendors = this.filterService.applyFilter(
      this.vendors ?? [],
      this.filterSubParts,
      {
        'Vendor Id': (vendor) => vendor.vendorID,
        'Vendor Name': (vendor) => vendor.vendorName,
        'Email Id': (vendor) => vendor.user.email,
        'User Id': (vendor) => vendor.userID,
      }
    );
    this.categorizeFilteredVendors(filteredVendors);
  }

  categorizeFilteredVendors(filteredVendors: Vendor[]) {
    const categoriesMap = new Map<
      number,
      { categoryID: number; categoryName: string; vendors: Vendor[] }
    >();

    filteredVendors.forEach((vendor: Vendor) => {
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

    // Update the categorized vendors list
    this.categorizedVendors = Array.from(categoriesMap.values());
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
    if (!this.vendors) return;

    const categoriesMap = new Map<
      number,
      { categoryID: number; categoryName: string; vendors: Vendor[] }
    >();

    this.vendors.forEach((vendor: Vendor) => {
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
      const firstSelectedVendor = this.vendors?.find(
        (v) => v.vendorID !== undefined && this.selectedVendors.has(v.vendorID)
      );
      this.selectedCategoryID = firstSelectedVendor?.categoryID;
    } else {
      this.selectedCategoryID = undefined;
    }
    this.disabledCategories.clear();

    if (this.selectedCategoryID !== undefined) {
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
      const frameworkName = selectedFramework?.frameworkName;
      console.log('Framework Name:', frameworkName);
      console.log('Selected Vendors:', selectedVendors);
      this.router
        .navigate(['/admin/select-questions'], {
          state: {
            frameworkName: frameworkName,
            frameworkID: selectedFrameworkID,
            vendorCategories: selectedVendors.map((v: Vendor) => v.categoryID),
            vendorName: selectedVendors.map((v: Vendor) => v.vendorName),
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
    } else {
      console.log('Form is invalid');
      Object.values(this.questionnaireForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}
