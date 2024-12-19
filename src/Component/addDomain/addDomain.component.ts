import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EntityService } from '../../services/EntityService/Entity.service';
import { Domain } from '../../model/entity';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-addDomain',
  templateUrl: './addDomain.component.html',
  styleUrls: ['./addDomain.component.scss'],
})
export class AddDomainComponent {
  domainName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddDomainComponent>,
    private entityService: EntityService,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    if (this.domainName) {
      const domain: Domain = { domainID: 0, domainName: this.domainName };
      const token = this.authService.getToken();

      this.entityService.addDomain(domain, token).subscribe(
        (response: Domain) => {
          console.log('Domain Added:', response);
          this.dialogRef.close({
            success: true,
            domainName: response.domainName,
          });
        },
        (error) => {
          console.error('Error adding domain:', error);
          this.dialogRef.close({ success: false });
        }
      );
    } else {
      alert('Please enter a valid domain name');
    }
  }

  // Method to handle modal cancellation
  onCancel(): void {
    console.log('Modal Cancelled');
    this.dialogRef.close({ success: false }); // Close with failure or no data
  }
}
