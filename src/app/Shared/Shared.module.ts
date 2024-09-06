import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // Example of Angular Material module
import { NavItemComponent } from '../../Component/nav-item/nav-item.component';
import { TopBarComponent } from '../../Component/TopBar/TopBar.component';
import { DisclaimerFooterComponent } from '../../Component/disclaimerFooter/disclaimerFooter.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BurgerMenuComponent } from '../../Component/burgerMenu/burgerMenu.component';
import { ChangePasswordModalComponent } from '../../Component/change-password-modal/change-password-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
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
import { HighchartsChartModule } from 'highcharts-angular';
import { StackedBarChartComponent } from '../../Component/stacked-bar-chart/stacked-bar-chart.component';
import { PieChartComponent } from '../../Component/pie-chart/pie-chart.component';
import { QuestionnaireListComponent } from '../../Component/QuestionnaireList/QuestionnaireList.component';
import { ResponseModalComponent } from '../../Component/ResponseModal/ResponseModal.component';
import { BreadcrumbComponent } from '../../Component/breadcrumb/breadcrumb.component';
import { ResponsePageComponent } from '../../Component/ResponsePage/ResponsePage.component';
import { QuestionnaireTableComponent } from '../../Component/QuestionnaireTable/QuestionnaireTable.component';
import { ExportDialogBoxComponent } from '../../Component/exportDialogBox/exportDialogBox.component';
import { PaginationComponent } from '../../Component/Pagination/pagination/pagination.component';

@NgModule({
  declarations: [
    PaginationComponent,
    NavItemComponent,
    TopBarComponent,
    DisclaimerFooterComponent,
    BurgerMenuComponent,
    ChangePasswordModalComponent,
    StackedBarChartComponent,
    PieChartComponent,
    QuestionnaireListComponent,
    QuestionnaireTableComponent,
    ResponseModalComponent,
    BreadcrumbComponent,
    ResponsePageComponent,
    ExportDialogBoxComponent,
  ],
  imports: [
    HighchartsChartModule,
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
    PaginationComponent,
    ExportDialogBoxComponent,
    ResponseModalComponent,
    QuestionnaireTableComponent,
    QuestionnaireListComponent,
    PieChartComponent,
    StackedBarChartComponent,
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
    MatSlideToggleModule,
    BreadcrumbComponent,
    ResponsePageComponent,
  ],
})
export class SharedModule {}
