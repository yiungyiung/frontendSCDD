import { Injectable } from '@angular/core';
import { SubPart } from '../../Component/filter/filter.component';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  applyFilter<T>(data: T[], subParts: SubPart[], searchByFields: { [key: string]: (item: T) => any }): T[] {
    let searchBy = '';
    let searchKeyword = '';
    let selectedStatuses: string[] = [];
    let selectedCategoriesOrRoles: string[] = [];

    const searchBySubPart = subParts.find(part => part.name === 'Search By');
    const searchKeywordSubPart = subParts.find(part => part.name === 'Search Keyword');
    const statusSubPart = subParts.find(part => part.name === 'Vendor Status' || part.name === 'User Status');
    const categoryOrRoleSubPart = subParts.find(part => part.name === 'Category' || part.name === 'Role');

    if (searchBySubPart && searchKeywordSubPart) {
      searchBy = searchBySubPart.selectedOption || '';
      searchKeyword = searchKeywordSubPart.keyword || '';
    }

    if (statusSubPart) {
      selectedStatuses = statusSubPart.selectedOptions || [];
    }

    if (categoryOrRoleSubPart) {
      selectedCategoriesOrRoles = categoryOrRoleSubPart.selectedOptions || [];
    }

    return data.filter(item => {
      let matchesSearch = true;
      let matchesStatus = true;
      let matchesCategoryOrRole = true;

      if (searchBy && searchKeyword) {
        const searchField = searchByFields[searchBy];
        const fieldValue = searchField(item)?.toString().toLowerCase();
        matchesSearch = fieldValue?.includes(searchKeyword.toLowerCase());
      }

      if (selectedStatuses.length > 0) {
        const isActive = (item as any).isActive ? 'Active' : 'Inactive';
        matchesStatus = selectedStatuses.includes(isActive);
      }

      if (selectedCategoriesOrRoles.length > 0) {
        const categoryOrRole = (item as any).category?.categoryName || (item as any).role;
        matchesCategoryOrRole = selectedCategoriesOrRoles.includes(categoryOrRole);
      }

      return matchesSearch && matchesStatus && matchesCategoryOrRole;
    });
  }

}
