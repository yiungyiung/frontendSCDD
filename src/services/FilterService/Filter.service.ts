import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  applyFilter<T>(
    data: T[],
    filters: {
      partName: string;
      value: string | string[]; // Allow value to be either a string or an array of strings
      column: keyof T | ((item: T) => any);
      exactMatch?: boolean; // Optional flag for exact matching
    }[]
  ): T[] {
    // If no filters are applied, return all data
    if (filters.length === 0) {
      return data;
    }

    return data.filter((item) => {
      return filters.every((filter) => {
        const fieldValue =
          typeof filter.column === 'function'
            ? filter.column(item)
            : item[filter.column];

        const exactMatch =
          filter.exactMatch !== undefined ? filter.exactMatch : true;

        // If filter value is null, empty string, or empty array, return true to include all data
        if (
          filter.value === null ||
          (Array.isArray(filter.value) && filter.value.length === 0) ||
          filter.value === ''
        ) {
          return true;
        }

        // Handle the case where filter value is an array of selected values (e.g., multiple categories)
        if (Array.isArray(filter.value)) {
          return filter.value.some((filterVal) =>
            this.checkFieldValue(fieldValue, filterVal, exactMatch)
          );
        } else {
          // For single-value filter
          return this.checkFieldValue(fieldValue, filter.value, exactMatch);
        }
      });
    });
  }

  private checkFieldValue(
    fieldValue: any,
    filterValue: string,
    exactMatch: boolean
  ): boolean {
    if (Array.isArray(fieldValue)) {
      return fieldValue.some((value) =>
        exactMatch
          ? value.toString().toLowerCase() === filterValue.toLowerCase()
          : value.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      return exactMatch
        ? fieldValue?.toString().toLowerCase() === filterValue.toLowerCase()
        : fieldValue
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
    }
  }
}
