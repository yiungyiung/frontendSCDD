import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Vendor } from '../../model/vendor';
import { Framework } from '../../model/entity';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-CreateNewQuestionnaire',
  templateUrl: './CreateNewQuestionnaire.component.html',
  styleUrls: ['./CreateNewQuestionnaire.component.css']
})
export class CreateNewQuestionnaireComponent implements OnInit {
  questionnaireForm!: FormGroup;
  vendors?: Vendor[];
  frameworks?: Framework[];
  categorizedVendors: any[] = [];
  selectedCategoryID: number | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private entityService: EntityService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getVendors();
    this.getFrameworks();
  }

  initForm() {
    this.questionnaireForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      framework: ['', Validators.required],
      vendors: this.formBuilder.array([])
    });
  }

  get vendorsFormArray() {
    return this.questionnaireForm.get('vendors') as FormArray;
  }

  getVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe(vendors => {
      this.vendors = vendors;
      this.categorizeVendors();
    });
  }

  getFrameworks() {
    const token = this.authService.getToken();
    this.entityService.GetAllFrameworks(token).subscribe(frameworks => {
      this.frameworks = frameworks;
    });
  }

  categorizeVendors() {
    const categoriesMap = new Map<number, { categoryID: number, categoryName: string, vendors: Vendor[] }>();

    this.vendors?.forEach(vendor => {
      if (vendor.categoryID !== undefined) {
        if (!categoriesMap.has(vendor.categoryID)) {
          categoriesMap.set(vendor.categoryID, { categoryID: vendor.categoryID, categoryName: vendor.category?.categoryName || 'Unknown', vendors: [] });
        }
        categoriesMap.get(vendor.categoryID)?.vendors.push(vendor);
      }
    });

    this.categorizedVendors = Array.from(categoriesMap.values());
  }

  onVendorSelectionChange(event: { vendorID: number, isSelected: boolean }) {
    const { vendorID, isSelected } = event;
    if (isSelected) {
      this.vendorsFormArray.push(this.formBuilder.control(vendorID));
    } else {
      const index = this.vendorsFormArray.controls.findIndex(x => x.value === vendorID);
      if (index >= 0) {
        this.vendorsFormArray.removeAt(index);
      }
    }
    this.updateSelectedCategory();
  }

  updateSelectedCategory() {
    if (this.vendorsFormArray.length > 0) {
      const firstSelectedVendor = this.vendors?.find(v => v.vendorID === this.vendorsFormArray.at(0).value);
      this.selectedCategoryID = firstSelectedVendor?.categoryID;
    } else {
      this.selectedCategoryID = undefined;
    }
  }

  onFrameworkSelected(frameworkId: number) {
    this.questionnaireForm.patchValue({ framework: frameworkId });
  }

  onSubmit() {
    if (this.questionnaireForm.valid) {
      console.log(this.questionnaireForm.value);
    } else {
      Object.values(this.questionnaireForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}