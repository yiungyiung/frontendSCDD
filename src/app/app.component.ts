import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor (
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'dashboard',
      this.domSanitizer.bypassSecurityTrustResourceUrl('Dashboard.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'framework',
      this.domSanitizer.bypassSecurityTrustResourceUrl('Framework.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'vendors',
      this.domSanitizer.bypassSecurityTrustResourceUrl('vendors.svg')
    )

    this.matIconRegistry.addSvgIcon(
      'ques',
      this.domSanitizer.bypassSecurityTrustResourceUrl('questionnaire.svg')
    )

    this.matIconRegistry.addSvgIcon(
      'users',
      this.domSanitizer.bypassSecurityTrustResourceUrl('users.svg')
    )

    this.matIconRegistry.addSvgIcon(
      'reports',
      this.domSanitizer.bypassSecurityTrustResourceUrl('reports.svg')
    )

  }
}
