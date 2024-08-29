import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../AuthService/auth.service';
import { VendorService } from '../VendorService/Vendor.service';
import { AdminService } from '../AdminService/Admin.service';
import { Tier } from '../../model/tier';
import { Category } from '../../model/category';
import { Vendor } from '../../model/vendor';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  constructor(
    private authService: AuthService,
    private vendorService: VendorService,
    private adminService: AdminService
  ) {}

  loadData<T>(serviceMethod: (token: string) => Observable<T>): Observable<T> {
    const token = this.authService.getToken();
    return serviceMethod(token);
  }

  loadCategories(): Observable<Category[]> {
    return this.loadData<Category[]>(
      this.vendorService.getCategories.bind(this.vendorService)
    );
  }

  loadTiers(): Observable<Tier[]> {
    return this.loadData<Tier[]>(
      this.vendorService.getTiers.bind(this.vendorService)
    );
  }

  loadVendors(): Observable<Vendor[]> {
    return this.loadData<Vendor[]>(
      this.vendorService.getAllVendors.bind(this.vendorService)
    );
  }

  loadUsers(): Observable<User[]> {
    return this.loadData<User[]>(
      this.adminService.getAllUsers.bind(this.adminService)
    );
  }
}
