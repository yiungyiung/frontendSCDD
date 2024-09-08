import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../AuthService/auth.service';
import { VendorService } from '../VendorService/Vendor.service';
import { AdminService } from '../AdminService/Admin.service';
import { QuestionnaireAssignmentService } from '../QuestionnaireAssignmentService/questionnaireAssignment.service';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { Tier } from '../../model/tier';
import { Category } from '../../model/category';
import { Vendor } from '../../model/vendor';
import { User } from '../../model/user';
import { Role } from '../../model/role';
import { FormArray, FormGroup } from '@angular/forms';
import { Framework } from '../../model/entity';
import { EntityService } from '../EntityService/Entity.service';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  selectedTierId: number | undefined;
  selectedCategoryId: number | undefined;
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
  constructor(
    private authService: AuthService,
    private vendorService: VendorService,
    private adminService: AdminService,
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private entityService: EntityService
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

  loadAssignments(): Observable<QuestionnaireAssignment[]> {
    return this.loadData<QuestionnaireAssignment[]>(
      this.questionnaireAssignmentService.getallAssignment.bind(
        this.questionnaireAssignmentService
      )
    );
  }

  getTierIdFromName(tierName: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.loadTiers().subscribe(
        (tiers) => {
          const matchedTier = tiers.find(
            (tier) => tier.tierName.toLowerCase() === tierName.toLowerCase()
          );
          if (matchedTier) {
            observer.next(matchedTier.tierId);
          } else {
            observer.error('Tier not found');
          }
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }

  getCategoryIdFromName(categoryName: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.loadCategories().subscribe(
        (categories) => {
          const matchedCategory = categories.find(
            (category) =>
              category.categoryName.toLowerCase() === categoryName.toLowerCase()
          );
          if (matchedCategory) {
            observer.next(matchedCategory.categoryID);
          } else {
            observer.error('Category not found');
          }
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }

  mapServerVendorToVendor(serverUser: any): Vendor {
    return {
      vendorID: serverUser.vendorID,
      vendorName: serverUser.vendorName,
      vendorAddress: serverUser.vendorAddress,
      tierID: serverUser.tierID,
      categoryID: serverUser.categoryID,
      vendorRegistration: serverUser.vendorRegistration,
      userID: serverUser.userID,
      user: {
        userId: serverUser.user.userId,
        isActive: serverUser.user.isActive,
        email: serverUser.user.email,
        name: serverUser.user.name,
        contact_Number: serverUser.user.contact_Number,
        roleId: serverUser.user.roleId,
      },
    };
  }

  async mapServerVendorToVendorForFileUpload(userData: any): Promise<Vendor> {
    try {
      await this.getCategoryIdFromName(userData['Category']);
      await this.getTierIdFromName(userData['Tier']);
      const tierID = this.selectedTierId;
      const categoryID = this.selectedCategoryId;
      return {
        vendorName: userData['Vendor Name'],
        vendorAddress: userData['Vendor Address'],
        tierID: tierID!,
        categoryID: categoryID!,
        vendorRegistration: userData['Vendor Registration'],
        parentVendorIDs: this.newVendor.parentVendorIDs!.map(Number),
        user: {
          isActive: this.newVendor.user.isActive,
          email: userData['Contact Email'],
          name: userData['Contact Name'],
          contact_Number: userData['Contact Number'],
          roleId: 4,
        },
      };
    } catch (error) {
      console.error('Error processing user data:', error);
      throw error;
    }
  }

  getRoleId(role: string): number {
    const normalizedRole = role.toLowerCase();
    switch (normalizedRole) {
      case 'admin':
        return 1;
      case 'manager':
        return 2;
      case 'analyst':
        return 3;
      case 'vendor':
        return 4;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  }

  getRoleFromRoleId(roleId: number): Role {
    switch (roleId) {
      case 1:
        return Role.Admin;
      case 2:
        return Role.Manager;
      case 3:
        return Role.Analyst;
      case 4:
        return Role.Vendor;
      default:
        throw new Error('Invalid role ID');
    }
  }

  mapServerUserToUser(serverUser: any): User {
    return {
      userId: serverUser.userId,
      email: serverUser.email,
      role: this.getRoleFromRoleId(serverUser.roleId),
      name: serverUser.name,
      contact_Number: serverUser.contact_Number,
      isActive: serverUser.isActive,
    };
  }

  loadUsers(): Observable<User[]> {
    const token = this.authService.getToken();
    return this.adminService.getAllUsers(token).pipe(
      map((serverUsers: User[]) => {
        return serverUsers
          .filter((user) => user.roleId !== this.getRoleId(Role.Vendor))
          .map((user) => this.mapServerUserToUser(user));
      })
    );
  }

  mapServerUserToUserForFileUpload(userData: any): User {
    return {
      userId: userData['User ID'],
      email: userData['Email'],
      name: userData['Name'],
      contact_Number: userData['Contact Number'],
      role: userData['Role'],
      isActive: userData['Is Active'] === 'true',
    };
  }

  categorizeVendors(
    vendors: Vendor[]
  ): { categoryID: number; categoryName: string; vendors: Vendor[] }[] {
    const categoriesMap = new Map<
      number,
      { categoryID: number; categoryName: string; vendors: Vendor[] }
    >();

    vendors.forEach((vendor: Vendor) => {
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

    return Array.from(categoriesMap.values());
  }

  getVendors(): Observable<Vendor[]> {
    const token = this.authService.getToken();
    return this.vendorService.getAllVendors(token);
  }

  getFrameworks(): Observable<Framework[]> {
    const token = this.authService.getToken();
    return this.entityService.GetAllFrameworks(token);
  }

  getVendorsFormArray(form: FormGroup): FormArray {
    return form.get('vendors') as FormArray;
  }
}
