// src/app/core/services/icon.service.ts

import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  registerIcons(): void {
    this.registerIcon('dashboard', 'Dashboard.svg');
    this.registerIcon('framework', 'Framework.svg');
    this.registerIcon('vendors', 'vendors.svg');
    this.registerIcon('ques', 'questionnaire.svg');
    this.registerIcon('users', 'users.svg');
    this.registerIcon('reports', 'reports.svg');
    this.registerIcon('modify', 'modify.svg');
    this.registerIcon('userIcon', 'userIcon.svg');
    this.registerIcon('notification', 'notification.svg');
    // Add any other icons here
  }

  private registerIcon(name: string, path: string): void {
    this.matIconRegistry.addSvgIcon(
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(path)
    );
  }
}