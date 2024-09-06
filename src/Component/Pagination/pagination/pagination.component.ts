import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemsPerPageChange: EventEmitter<number> =
    new EventEmitter<number>();

  itemsPerPageOptions: number[] = [5, 10, 20, 50];

  ngOnInit() {
    if (!this.itemsPerPageOptions.includes(this.itemsPerPage)) {
      this.itemsPerPageOptions.push(this.itemsPerPage);
      this.itemsPerPageOptions.sort((a, b) => a - b);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  paginationText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start} - ${end} of ${this.totalItems}`;
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const itemsPerPage = Number(target.value);
    this.itemsPerPageChange.emit(itemsPerPage);
  }
}
