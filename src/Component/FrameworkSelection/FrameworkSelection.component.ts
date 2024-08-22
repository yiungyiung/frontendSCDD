import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Framework } from '../../model/entity';

@Component({
  selector: 'app-FrameworkSelection',
  templateUrl: './FrameworkSelection.component.html',
  styleUrls: ['./FrameworkSelection.component.css']
})
export class FrameworkSelectionComponent {
  @Input() frameworks?: Framework[];
  @Output() frameworkSelected = new EventEmitter<number>();

  onFrameworkChange(event: Event) {
    const selectedFrameworkId = +(event.target as HTMLSelectElement).value;
    this.frameworkSelected.emit(selectedFrameworkId);
  }
}
