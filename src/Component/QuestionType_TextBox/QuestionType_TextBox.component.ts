import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UnitOfMeasurement } from '../../model/entity';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-QuestionType_TextBox',
  templateUrl: './QuestionType_TextBox.component.html',
  styleUrls: ['./QuestionType_TextBox.component.css']
})
export class QuestionType_TextBoxComponent implements OnInit {
  @Input() id!: number;
  @Output() textboxChange = new EventEmitter<{ textbox: string, uomID: number }>();
  @Output() remove = new EventEmitter<void>();
 UnitOfMeasurement:UnitOfMeasurement[] = [];

  textbox: string = '';
  selectedUomId: number | undefined = undefined; 

  constructor(private entityService: EntityService, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {this.loadunitofmeasurement(); }

  loadunitofmeasurement() {
    const token = this.authService.getToken();
    this.entityService.getAllUnitsOfMeasurement(token).subscribe(
      (unitOfMeasurement) => {
        this.UnitOfMeasurement = unitOfMeasurement;
        console.log('Loaded uom:', this.UnitOfMeasurement);
      },
      error => console.error('Error loading uom:', error)
    );
  }


  removeComponent() {
    this.remove.emit();
  }

  onTextboxChange() {
    this.emitData();
  }

  onUnitChange() {
    console.log("yash");
    console.log('Selected UOM ID:', this.selectedUomId);
    this.emitData();
  }
  

  private emitData() {
    const uomID = this.selectedUomId !== null && this.selectedUomId !== undefined ? this.selectedUomId : -1;
    this.textboxChange.emit({
      textbox: this.textbox,
      uomID: uomID
    });
  }
}
