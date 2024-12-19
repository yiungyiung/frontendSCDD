import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { VendorManagementComponent } from './VendorManagement/VendorManagement.component';
import { VendorcardComponent } from '../Component/vendorcard/vendorcard.component';
import { UsercardComponent } from '../Component/usercard/usercard.component';
import { FileUploadComponent } from '../Component/fileUpload/fileUpload.component';
import { FileUploadStatusComponent } from '../Component/FileUploadStatus/FileUploadStatus.component';
import { QuestionType_SelectOneOptionComponent } from '../Component/QuestionType_SelectOneOption/QuestionType_SelectOneOption.component';
import { QuestionType_SelectMultipleOptionComponent } from '../Component/QuestionType_SelectMultipleOption/QuestionType_SelectMultipleOption.component';
import { QuestionType_TextBoxComponent } from '../Component/QuestionType_TextBox/QuestionType_TextBox.component';
import { QuestionType_AttachFileComponent } from '../Component/QuestionType_AttachFile/QuestionType_AttachFile.component';
import { QuestionType_DateComponent } from '../Component/QuestionType_Date/QuestionType_Date.component';
import { AssignQuestionnaireComponent } from './AssignQuestionnaire/AssignQuestionnaire.component';
import { VendorHierarchyGraphComponent } from '../Component/vendorHierarchyGraph/vendorHierarchyGraph.component';
import { AddQuestionComponent } from './AddQuestion/AddQuestion.component';
import { UserFormComponent } from '../Component/userForm/userForm.component';
import { VendorFormComponent } from '../Component/vendorForm/vendorForm.component';
import { CreateNewQuestionnaireComponent } from './CreateNewQuestionnaire/CreateNewQuestionnaire.component';
import { VendorSelectionComponent } from '../Component/VendorSelection/VendorSelection.component';
import { FrameworkSelectionComponent } from '../Component/FrameworkSelection/FrameworkSelection.component';
import { SelectQuestionsComponent } from './SelectQuestions/SelectQuestions.component';
import { SharedModule } from '../Shared/Shared.module';
import { ReportsComponent } from './Reports/Reports.component';
import { DynamicReportsComponent } from './DynamicReports/DynamicReports.component';
import { DynamicQuestionnairelistComponent } from '../Component/DynamicQuestionnairelist/DynamicQuestionnairelist.component';
import { DynamicDisplayComponent } from '../Component/DynamicDisplay/DynamicDisplay.component';
import { DynamicVendorListComponent } from '../Component/DynamicVendorList/DynamicVendorList.component';
import { DynamicResponseListComponent } from '../Component/DynamicResponseList/DynamicResponseList.component';
import { AddDomainComponent } from '../Component/addDomain/addDomain.component';
import { AddUomComponent } from '../Component/addUom/addUom.component';
@NgModule({
  imports: [FormsModule],
})
export class AppModule {}

@NgModule({
  imports: [SharedModule, AdminRoutingModule],
  declarations: [
    DynamicQuestionnairelistComponent,
    DynamicReportsComponent,
    DynamicDisplayComponent,
    DynamicResponseListComponent,
    DynamicVendorListComponent,
    ReportsComponent,
    AdminComponent,
    AssignQuestionnaireComponent,
    VendorHierarchyGraphComponent,
    AssignQuestionnaireComponent,
    QuestionType_TextBoxComponent,
    QuestionType_AttachFileComponent,
    QuestionType_DateComponent,
    QuestionType_SelectMultipleOptionComponent,
    FileUploadStatusComponent,
    QuestionType_SelectOneOptionComponent,
    AddQuestionComponent,
    FileUploadComponent,
    UsercardComponent,
    VendorcardComponent,
    DashboardComponent,
    UserManagementComponent,
    VendorManagementComponent,
    CreateNewQuestionnaireComponent,
    VendorSelectionComponent,
    FrameworkSelectionComponent,
    UserFormComponent,
    SelectQuestionsComponent,
    VendorFormComponent,
    AddDomainComponent,
    AddUomComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
