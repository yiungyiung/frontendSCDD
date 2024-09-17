import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // Example of Angular Material module
import { NavItemComponent } from '../Component/nav-item/nav-item.component';
import { TopBarComponent } from '../Component/TopBar/TopBar.component';
import { DisclaimerFooterComponent } from '../Component/disclaimerFooter/disclaimerFooter.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BurgerMenuComponent } from '../Component/burgerMenu/burgerMenu.component';
import { ChangePasswordModalComponent } from '../Component/change-password-modal/change-password-modal.component';
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
import { PopupBoxModule } from '../Component/popup-box/popup-box/popup-box.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { StackedBarChartComponent } from '../Component/stacked-bar-chart/stacked-bar-chart.component';
import { PieChartComponent } from '../Component/pie-chart/pie-chart.component';
import { QuestionnaireListComponent } from '../Component/QuestionnaireList/QuestionnaireList.component';
import { BreadcrumbComponent } from '../Component/Breadcrumb/breadcrumb.component';
import { ResponsePageComponent } from '../Component/ResponsePage/ResponsePage.component';
import { QuestionnaireTableComponent } from '../Component/QuestionnaireTable/QuestionnaireTable.component';
import { ExportDialogBoxComponent } from '../Component/exportDialogBox/exportDialogBox.component';
import { PaginationComponent } from '../Component/Pagination/pagination/pagination.component';
import { AssignmentCardComponent } from '../Component/AssignmentCard/AssignmentCard.component';
import { NotificationSidebarComponent } from '../Component/Notification/notification.component';
import { ProgressBarComponent } from '../Component/ProgressBar/ProgressBar.component';
import { FilterComponent } from '../Component/filter/filter.component';
import { UnsavedChangesGuard } from '../guards/unsaved-changes.guard'; 
import { ExistingQuestionnaireModalComponent } from '../Component/ExistingQuestionnaireModal/ExistingQuestionnaireModal.component';
import { FrameworkDetailsComponent } from '../Component/FrameworkDetails/FrameworkDetails.component';
import { GoogleChartsModule } from 'angular-google-charts';
@NgModule({
  declarations: [
    PaginationComponent,
    AssignmentCardComponent,
    NavItemComponent,
    TopBarComponent,
    DisclaimerFooterComponent,
    BurgerMenuComponent,
    ChangePasswordModalComponent,
    StackedBarChartComponent,
    PieChartComponent,
    QuestionnaireListComponent,
    QuestionnaireTableComponent,
    BreadcrumbComponent,
    ResponsePageComponent,
    ExportDialogBoxComponent,
    NotificationSidebarComponent,
    ProgressBarComponent,
    FilterComponent,
    ExistingQuestionnaireModalComponent,
    FrameworkDetailsComponent
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
    GoogleChartsModule
  ],
  exports: [
    PaginationComponent,
    AssignmentCardComponent,
    ExportDialogBoxComponent,
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
    NotificationSidebarComponent,
    ProgressBarComponent,
    FilterComponent,
    ExistingQuestionnaireModalComponent,
    FrameworkDetailsComponent,
    GoogleChartsModule
  ],
})
export class SharedModule {}
