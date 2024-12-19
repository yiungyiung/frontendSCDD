import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UnitOfMeasurement } from '../../model/entity';

@Component({
  selector: 'app-addUom',
  templateUrl: './addUom.component.html',
  styleUrls: ['./addUom.component.scss'],
})
export class AddUomComponent {
  uomName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddUomComponent>,
    private entityService: EntityService,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    if (this.uomName) {
      const uom: UnitOfMeasurement = { uomid: 0, uomType: this.uomName };
      const token = this.authService.getToken();

      this.entityService.addUnitOfMeasurement(uom, token).subscribe(
        (response: UnitOfMeasurement) => {
          console.log('Uom Added:', response);
          this.dialogRef.close({
            success: true,
            uomName: response.uomType,
          });
        },
        (error) => {
          console.error('Error adding uom:', error);
          this.dialogRef.close({ success: false });
        }
      );
    } else {
      alert('Please enter a valid uom name');
    }
  }

  // Method to handle modal cancellation
  onCancel(): void {
    console.log('Modal Cancelled');
    this.dialogRef.close({ success: false }); // Close with failure or no data
  }
}
