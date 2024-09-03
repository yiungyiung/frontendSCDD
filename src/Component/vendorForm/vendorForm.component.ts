import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Vendor } from '../../model/vendor';
import { Category } from '../../model/category';
import { Tier } from '../../model/tier';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { AdminService } from '../../services/AdminService/Admin.service';
import { PopupService } from '../../services/PopupService/popup.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-vendorForm',
  templateUrl: './vendorForm.component.html',
  styleUrls: ['./vendorForm.component.css'],
})
export class VendorFormComponent implements OnInit, OnChanges {
  @Input() categories: Category[] = [];
  @Input() tiers: Tier[] = [];
  @Input() selectedVendor: Vendor | null = null;
  @Output() vendorAdded = new EventEmitter<Vendor>();
  @Output() vendorUpdated = new EventEmitter<Vendor>();

  vendorForm!: FormGroup;
  submitted = false;
  showParentVendorSelection = false;
  filteredTier1Vendors: Vendor[] = [];
  tier1Vendors: Vendor[] = [];
  private _searchQuery = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private vendorService: VendorService,
    private adminService: AdminService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedVendor'] && this.vendorForm) {
      this.updateForm();
    }
  }

  newVendor: Vendor = {
    vendorRegistration: '',
    vendorName: '',
    vendorAddress: '',
    tierID: 0,
    categoryID: 0,
    parentVendorIDs: [],
    user: {
      isActive: true,
      email: '',
      name: '',
      contact_Number: '',
      roleId: 4,
    },
    registrationDate: new Date(),
  };

  initForm() {
    this.vendorForm = this.fb.group({
      vendorName: [{ value: '', disabled: this.selectedVendor !== null }, Validators.required],
      vendorRegistration: [{ value: '', disabled: this.selectedVendor !== null }, Validators.required],
      vendorAddress: [{ value: '', disabled: this.selectedVendor !== null }, Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, this.contactNumberValidator]],
      categoryID: [{ value: '', disabled: this.selectedVendor !== null }, Validators.required],
      tierID: [{ value: '', disabled: this.selectedVendor !== null }, Validators.required],
    });
  
    this.vendorForm.get('tierID')?.valueChanges.subscribe((tierID) => {
      this.onTierChange(tierID);
    });
  }
  
  contactNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^[0-9]{10}$/.test(value);
    return isValid ? null : { invalidContactNumber: true };
  }

  updateForm() {
    if (this.selectedVendor) {
      this.vendorForm.patchValue({
        vendorName: this.selectedVendor.vendorName,
        vendorRegistration: this.selectedVendor.vendorRegistration,
        vendorAddress: this.selectedVendor.vendorAddress,
        contactName: this.selectedVendor.user.name,
        email: this.selectedVendor.user.email,
        contactNumber: this.selectedVendor.user.contact_Number,
        categoryID: this.selectedVendor.categoryID,
        tierID: this.selectedVendor.tierID,
      });
  
      // Disable form controls
      this.vendorForm.get('vendorName')?.disable();
      this.vendorForm.get('vendorRegistration')?.disable();
      this.vendorForm.get('vendorAddress')?.disable();
      this.vendorForm.get('categoryID')?.disable();
      this.vendorForm.get('tierID')?.disable();
  
      this.onTierChange(this.selectedVendor.tierID);
    } else {
      this.vendorForm.reset();
      this.vendorForm.enable(); // Enable all fields when there's no selected vendor
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.vendorForm.invalid) {
      return;
    }

    const formData = this.vendorForm.value;
    const vendorData: Vendor = {
      vendorName: formData.vendorName,
      vendorRegistration: formData.vendorRegistration,
      vendorAddress: formData.vendorAddress,
      tierID: formData.tierID,
      categoryID: formData.categoryID,
      user: {
        name: formData.contactName,
        email: formData.email,
        contact_Number: formData.contactNumber,
        roleId: 4,
        isActive: this.selectedVendor
          ? this.selectedVendor.user.isActive
          : true,
      },
      parentVendorIDs: this.newVendor.parentVendorIDs,
    };

    if (this.selectedVendor) {
      this.updateVendor(vendorData);
    } else {
      this.addVendor(vendorData);
    }
  }

  addVendor(vendorData: Vendor) {
    const token = this.authService.getToken();
    console.log('Adding vendor with payload:', vendorData);

    this.vendorService.addVendor(token, vendorData).subscribe(
      (addedVendor) => {
        this.vendorAdded.emit(addedVendor);
        this.resetForm();
        this.popupService.showPopup('Vendor added successfully', '#0F9D09');
      },
      (error) => {
        console.error('Error adding vendor:', error);
        this.popupService.showPopup(
          'Failed to add vendor. Please try again.',
          '#C10000'
        );
      }
    );
  }

  onTierChange(tierID: number) {
    this.showParentVendorSelection = tierID > 1;
    if (this.showParentVendorSelection) {
      const token = this.authService.getToken();
      this.vendorService.getVendorsByTier(token, tierID - 1).subscribe(
        (vendors) => {
          this.tier1Vendors = vendors;
          this.filteredTier1Vendors = vendors;
          this.applySearch();
        },
        (error) => console.error('Error loading parent vendors:', error)
      );
    } else {
      this.tier1Vendors = [];
      this.filteredTier1Vendors = [];
      this.newVendor.parentVendorIDs = [];
    }
  }

  applySearch() {
    this.filteredTier1Vendors = this.tier1Vendors.filter((vendor) =>
      vendor.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get filteredVendors() {
    return this.filteredTier1Vendors;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    this._searchQuery = value;
    this.applySearch();
  }

  toggleSelection(vendorID: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;

    if (isChecked) {
      if (!this.newVendor.parentVendorIDs!.includes(vendorID)) {
        this.newVendor.parentVendorIDs!.push(vendorID);
      }
    } else {
      const index = this.newVendor.parentVendorIDs!.indexOf(vendorID);
      if (index !== -1) {
        this.newVendor.parentVendorIDs!.splice(index, 1);
      }
    }
  }

  updateVendor(vendorData: Vendor) {
    if (this.vendorForm.invalid || !this.selectedVendor) {
      console.log('Form is invalid or selectedVendor is null');
      return;
    }

    const token = this.authService.getToken();

    // Prepare updated user data
    const updatedUser: User = {
      ...this.selectedVendor.user,
      name: this.vendorForm.get('contactName')?.value,
      email: this.vendorForm.get('email')?.value,
      contact_Number: this.vendorForm.get('contactNumber')?.value,
    };

    // Update the user information using AdminService
    this.adminService.updateUser(updatedUser, token).subscribe(
      (response) => {
        // Update the local selectedVendor object with the updated user details
        if (this.selectedVendor) {
          this.selectedVendor.user = response;
        }

        // Emit the updated vendor to the parent component
        this.vendorUpdated.emit(this.selectedVendor!);

        // Optionally reset the form or handle the success scenario
        this.resetForm();
        this.popupService.showPopup(
          'Vendor user details updated successfully',
          '#0F9D09'
        );
      },
      (error) => {
        console.error('Error updating vendor user details:', error);
        this.popupService.showPopup(
          'Failed to update vendor user details. Please try again.',
          '#C10000'
        );
      }
    );
  }

  resetForm() {
    this.vendorForm.reset();
    this.submitted = false;
    this.selectedVendor = null;
    this.showParentVendorSelection = false;
    this.tier1Vendors = [];
    this.filteredTier1Vendors = [];
    this.newVendor.parentVendorIDs = [];
  }

  onCancel() {
    this.resetForm();
  }

  get f() {
    return this.vendorForm.controls;
  }
}
