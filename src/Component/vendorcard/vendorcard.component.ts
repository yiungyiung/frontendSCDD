import { Component, OnInit, Input } from '@angular/core';
import { Tier } from '../../model/entity';
import { Category } from '../../model/category';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';

@Component({
  selector: 'app-vendorcard',
  templateUrl: './vendorcard.component.html',
  styleUrls: ['./vendorcard.component.css']
})
export class VendorcardComponent implements OnInit {

  constructor(private entityService:EntityService, private authService:AuthService, private vendorService:VendorService) { }

  ngOnInit() {
    console.log('vendorrrcarddddd',this.vendor);
    this.getTierName(this.vendor.tierID);
    this.getCategoryName(this.vendor.categoryID);
  }

  @Input() vendor: any;
  @Input() toggleVendorStatus: (vendor: any) => void = () => {
    console.log("workinh");
  }; 
  tierName: string = '';
  categoryName: string = '';
  getTierName(tierID: number): void {
    const token = this.authService.getToken();
    this.entityService.GetTierById(tierID, token).subscribe(
      (Tier: Tier) => {
        console.log('API response:', Tier);
        this.tierName = Tier.tierName;
        console.log('tiernameeeeeee',this.tierName);
      },
      (error) => {
        console.error('Error fetching tier:', error);
        this.tierName = 'Unknown'; // Fallback in case of error
      }
    );
  }

  getCategoryName(categoryID: number): void {
    const token = this.authService.getToken();
    this.vendorService.getCategories(token).subscribe(
      (categories: Category[]) => {
        console.log('Categories response:', categories);
        const category = categories.find(cat => cat.categoryID === categoryID);
        this.categoryName = category ? category.categoryName : 'Unknown'; // Set category name
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.categoryName = 'Unknown'; // Fallback in case of error
      }
    );
  }

}
