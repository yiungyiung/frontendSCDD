import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface SubPart {
  name: string;
  type: 'checkbox' | 'searchBar' | 'MCQ'; // Add more types as needed
  options?: string[]; // Only for checkboxes and MCQ
  selectedOption?: string;
  selectedOptions?: string[];
  keyword?: string; // Add keyword property for searchBar
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() subParts: SubPart[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<SubPart[]>();

  toggledSubParts: { [key: string]: boolean } = {};

  ngOnInit() {
    // Initialize the toggledSubParts state
    this.subParts.forEach((subPart) => {
      this.toggledSubParts[subPart.name] = false;
    });
  }

  closeFilter(): void {
    this.close.emit();
  }

  toggleSubPart(name: string): void {
    this.toggledSubParts[name] = !this.toggledSubParts[name];
  }

  isSubPartToggled(name: string): boolean {
    return this.toggledSubParts[name];
  }

  selectOption(subPart: SubPart, option: string): void {
    if (subPart.type === 'MCQ') {
      subPart.selectedOption = option;
    } else if (subPart.type === 'checkbox') {
      if (!subPart.selectedOptions) {
        subPart.selectedOptions = [];
      }
      const index = subPart.selectedOptions.indexOf(option);
      if (index === -1) {
        subPart.selectedOptions.push(option);
      } else {
        subPart.selectedOptions.splice(index, 1);
      }
    }
  }

  onKeywordChange(subPart: SubPart, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    subPart.keyword = inputElement.value;
  }

  resetFilter(): void {
    this.subParts.forEach((subPart) => {
      if (subPart.type === 'MCQ') {
        subPart.selectedOption = '';
      } else if (subPart.type === 'checkbox') {
        subPart.selectedOptions = [];
      } else if (subPart.type === 'searchBar') {
        subPart.keyword = '';
      }
    });
    this.filterChange.emit(this.subParts);
  }

  submitFilter(): void {
    this.filterChange.emit(this.subParts);
  }
}
