import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon'; // Example of Angular Material module
import { NavItemComponent } from '../../Component/nav-item/nav-item.component';
import { TopBarComponent } from '../../Component/TopBar/TopBar.component';
import { DisclaimerFooterComponent } from '../../Component/disclaimerFooter/disclaimerFooter.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BurgerMenuComponent } from '../../Component/burgerMenu/burgerMenu.component';
import { ChangePasswordModalComponent } from '../../Component/change-password-modal/change-password-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopupBoxModule } from '../../Component/popup-box/popup-box/popup-box.module';

@NgModule({
  declarations: [
    NavItemComponent,
    TopBarComponent,
    DisclaimerFooterComponent,
    BurgerMenuComponent,
    ChangePasswordModalComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    MatDialogModule,
    MatTooltipModule,
    MatSidenavModule,
    MatCardModule,
    NgxPaginationModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PopupBoxModule,
    ReactiveFormsModule,
    NgxCsvParserModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
  ],
  exports: [
    NavItemComponent,
    TopBarComponent,
    DisclaimerFooterComponent,
    CommonModule,
    MatIconModule,
    RouterModule,
    BurgerMenuComponent,
    ChangePasswordModalComponent,
    MatDialogModule,
    FormsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatCardModule,
    NgxPaginationModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PopupBoxModule,
    ReactiveFormsModule,
    NgxCsvParserModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule, // Export any shared Angular Material or other modules here
  ],
})
export class SharedModule {}
