import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tier } from '../../model/entity';
import { Category } from '../../model/category';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { Vendor } from '../../model/vendor';

@Component({
  selector: 'app-vendorcard',
  templateUrl: './vendorcard.component.html',
  styleUrls: ['./vendorcard.component.scss'],
})
export class VendorcardComponent implements OnInit {
  constructor(
    private entityService: EntityService,
    private authService: AuthService,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.getTierName(this.vendor.tierID);
    this.getCategoryName(this.vendor.categoryID);
    if (this.vendor) {
      this.loadVendorData(this.vendor);
    }
  }

  @Input() vendor: any;
  @Input() toggleVendorStatus: (vendor: any) => void = () => {
    console.log('workinh');
  };
  @Output() vendorUpdated: EventEmitter<Vendor> = new EventEmitter<Vendor>();
  tierName: string = '';
  categoryName: string = '';
  isLoading: boolean = true;

  private loadVendorData(vendor: Vendor): void {
    this.getTierName(vendor.tierID)
      .then((tier: Tier) => {
        this.tierName = tier.tierName;
        vendor.tier = tier;
        return this.getCategoryName(vendor.categoryID);
      })
      .then((category: Category) => {
        this.categoryName = category.categoryName;
        vendor.category = category;
        this.isLoading = false;
        this.vendorUpdated.emit(vendor);
      })
      .catch((error: any) => {
        console.error('Error loading vendor data:', error);
        this.isLoading = false;
      });
  }

  private getTierName(tierID: number): Promise<Tier> {
    const token = this.authService.getToken();
    return new Promise((resolve, reject) => {
      this.entityService.GetTierById(tierID, token).subscribe(
        (tier: Tier) => resolve(tier),
        (error: any) => reject(error)
      );
    });
  }

  private getCategoryName(categoryID: number): Promise<Category> {
    const token = this.authService.getToken();
    return new Promise((resolve, reject) => {
      this.vendorService.getCategories(token).subscribe(
        (categories: Category[]) => {
          const category = categories.find(
            (cat) => cat.categoryID === categoryID
          );
          if (category) {
            resolve(category);
          } else {
            reject(new Error('Category not found'));
          }
        },
        (error: any) => reject(error)
      );
    });
  }
}
