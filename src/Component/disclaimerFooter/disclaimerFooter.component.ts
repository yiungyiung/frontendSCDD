import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimerFooter',
  templateUrl: './disclaimerFooter.component.html',
  styleUrls: ['./disclaimerFooter.component.css']
})
export class DisclaimerFooterComponent {
  @ViewChild('disclaimerModal') disclaimerModal?: TemplateRef<any>;
  private dialogRef?: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  toggleDisclaimer() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = undefined;
    } else if (this.disclaimerModal) {
      this.dialogRef = this.dialog.open(this.disclaimerModal);
    }
  }
}
