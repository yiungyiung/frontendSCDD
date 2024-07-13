import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimerFooter',
  templateUrl: './disclaimerFooter.component.html',
  styleUrls: ['./disclaimerFooter.component.css']
})
export class disclaimerFooterComponent {
  @ViewChild('disclaimerModal') disclaimerModal?: TemplateRef<any>;

  constructor(private dialog: MatDialog) {}

  openDisclaimer() {
    if (this.disclaimerModal) {
      this.dialog.open(this.disclaimerModal);
    }
  }
}
