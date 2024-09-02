import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { VendorManagementComponent } from './VendorManagement/VendorManagement.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportDialogBoxComponent } from '../Component/exportDialogBox/exportDialogBox.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaginationComponent } from '../Component/Pagination/pagination/pagination.component';
import { VendorcardComponent } from '../Component/vendorcard/vendorcard.component';
import { UsercardComponent } from '../Component/usercard/usercard.component';
import { PopupBoxModule } from '../Component/popup-box/popup-box/popup-box.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../Component/filter/filter.component';
import { BurgerMenuComponent } from '../Component/burgerMenu/burgerMenu.component';
import { FileUploadComponent } from '../Component/fileUpload/fileUpload.component';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { FileUploadStatusComponent } from '../Component/FileUploadStatus/FileUploadStatus.component';
import { MatRadioModule } from '@angular/material/radio';
import { ManageQuestionaireComponent } from './ManageQuestionaire/ManageQuestionaire.component';
import { QuestionType_SelectOneOptionComponent } from '../Component/QuestionType_SelectOneOption/QuestionType_SelectOneOption.component';
import { QuestionType_SelectMultipleOptionComponent } from '../Component/QuestionType_SelectMultipleOption/QuestionType_SelectMultipleOption.component';
import { QuestionType_TextBoxComponent } from '../Component/QuestionType_TextBox/QuestionType_TextBox.component';
import { QuestionType_AttachFileComponent } from '../Component/QuestionType_AttachFile/QuestionType_AttachFile.component';
import { QuestionType_DateComponent } from '../Component/QuestionType_Date/QuestionType_Date.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AssignQuestionnaireComponent } from './AssignQuestionnaire/AssignQuestionnaire.component';
import { VendorHierarchyGraphComponent } from '../Component/vendorHierarchyGraph/vendorHierarchyGraph.component';
import { AddQuestionComponent } from './AddQuestion/AddQuestion.component';
import { UserFormComponent } from '../Component/userForm/userForm.component';
import { VendorFormComponent } from '../Component/vendorForm/vendorForm.component';
import { ChangePasswordModalComponent } from '../Component/change-password-modal/change-password-modal.component';
import { CreateNewQuestionnaireComponent } from './CreateNewQuestionnaire/CreateNewQuestionnaire.component';
import { VendorSelectionComponent } from '../Component/VendorSelection/VendorSelection.component';
import { FrameworkSelectionComponent } from '../Component/FrameworkSelection/FrameworkSelection.component';
import { SelectQuestionsComponent } from './SelectQuestions/SelectQuestions.component';
import { SharedModule } from '../app/Shared/Shared.module';
import { BreadcrumbComponent } from '../Component/breadcrumb/breadcrumb.component';
import { ReportsComponent } from './Reports/Reports.component';
import { DynamicReportsComponent } from './DynamicReports/DynamicReports.component';
import { DynamicQuestionnairelistComponent } from '../Component/DynamicQuestionnairelist/DynamicQuestionnairelist.component';
import { DynamicDisplayComponent } from '../Component/DynamicDisplay/DynamicDisplay.component';
import { DynamicVendorListComponent } from '../Component/DynamicVendorList/DynamicVendorList.component';
import { DynamicResponseListComponent } from '../Component/DynamicResponseList/DynamicResponseList.component';
@NgModule({
  imports: [FormsModule],
})
export class AppModule {}

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],
  declarations: [
    DynamicQuestionnairelistComponent,
    DynamicReportsComponent,
    DynamicDisplayComponent,
    DynamicResponseListComponent,
    DynamicVendorListComponent,
    ReportsComponent,
    AdminComponent,
    VendorHierarchyGraphComponent,
    AssignQuestionnaireComponent,
    QuestionType_TextBoxComponent,
    QuestionType_AttachFileComponent,
    QuestionType_DateComponent,
    QuestionType_SelectMultipleOptionComponent,
    FileUploadStatusComponent,
    QuestionType_SelectOneOptionComponent,
    ManageQuestionaireComponent,
    AddQuestionComponent,
    FileUploadComponent,
    FilterComponent,
    UsercardComponent,
    VendorcardComponent,
    DashboardComponent,
    UserManagementComponent,
    ExportDialogBoxComponent,
    VendorManagementComponent,
    PaginationComponent,
    CreateNewQuestionnaireComponent,
    VendorSelectionComponent,
    FrameworkSelectionComponent,
    UserFormComponent,
    SelectQuestionsComponent,
    VendorFormComponent,
    BreadcrumbComponent,
  ],
})
export class AdminModule {}
