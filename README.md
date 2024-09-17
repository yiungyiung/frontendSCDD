
---

# **Vendor-Admin Portal**

## **Overview**

This project is a web-based platform for managing supply chain due diligence processes, developed with Angular. It provides administrators and vendors with tools to streamline questionnaire management, reporting, and overall compliance in supply chain operations.

---

## **Features**

- **Role-Based Access**: Different features for Admin, Vendors, and Managers.
- **Questionnaire Management**: Admins can create, assign, and manage questionnaires dynamically.
- **Vendor Management**: Comprehensive vendor data and questionnaire assignments.
- **Dynamic Reports**: Real-time reports with filtering and exporting functionality.
- **Authentication & Authorization**: Secure access using JWT authentication.
- **Responsive UI**: Built with Bootstrap and Angular Material for mobile and desktop devices.

---

## **Table of Contents**

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Running the Project](#running-the-project)
5. [Environment Configuration](#environment-configuration)
6. [Routing](#routing)
7. [Services](#services)
8. [Guards](#guards)
9. [Dependencies](#dependencies)

---

## **Project Structure**

```bash
+---admin (Lazy-loaded Admin Module)
|   +---AddQuestion
|   +---AssignQuestionnaire
|   +---CreateNewQuestionnaire
|   +---dashboard
|   +---DynamicReports
|   +---Reports
|   +---SelectQuestions
|   +---user-management
|   +---VendorManagement
+---vendor (Lazy-loaded Vendor Module)
|   +---QuestionnaireAnswering
|   +---VendorDashboard
+---Component (Shared Components)
|   +---AssignmentCard
|   +---Breadcrumb
|   +---burgerMenu
|   +---fileUpload
|   +---pagination
|   +---pie-chart
|   +---vendorHierarchyGraph
+---services (Shared Services)
|   +---AdminService
|   +---AuthService
|   +---QuestionnaireService
|   +---VendorService
+---guards (Route Guards)
|   +---AuthGuard
|   +---UnsavedChangesGuard
+---environments
+---style
```

- **admin/**: Contains components related to admin functionalities like user management, questionnaire creation, etc.
- **vendor/**: Contains vendor functionalities like answering questionnaires and viewing vendor-specific dashboards.
- **Component/**: Shared reusable components like charts, pagination, file upload, etc.
- **services/**: Houses all the Angular services responsible for fetching and managing data.
- **guards/**: Includes the `AuthGuard` for authentication and `UnsavedChangesGuard` to prevent data loss.

---

## **Installation**

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd vendor-admin-portal
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Update the `src/environments/environment.ts` file with the appropriate API base URL.
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3267/api'  // Replace with your API URL
    };
    ```

---

## **Running the Project**

To run the project locally, use the following command:

```bash
npm start
```

This will serve the app at `http://localhost:4200/`. The application automatically reloads if you change any of the source files.

### **Production Build**

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory. You can serve these static files with any web server.

---

## **Environment Configuration**

The project uses environment files for configuration:

- `src/environments/environment.ts`: Development environment configuration.
- `src/environments/environment.prod.ts`: Production environment configuration.

Set the `apiUrl` property in these files to point to your API endpoints.

---

## **Routing**

The application utilizes Angular’s **lazy loading** feature for the `admin` and `vendor` modules to optimize loading times. Each route is protected by role-based authentication using Angular's `AuthGuard`.

Example of **Admin** routing in `admin-routing.module.ts`:

```typescript
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

- **Admin Module**: Accessible only by users with admin-related roles (Admin, Analyst, Manager).
- **Vendor Module**: Accessible only by users with the Vendor role.

---

## **Services**

The following services handle core functionality:

- **AuthService**: Manages user authentication and token handling.
- **AdminService**: Handles admin-specific operations like user management, questionnaire creation, etc.
- **VendorService**: Manages vendor-related data and questionnaires.
- **QuestionnaireService**: Manages questionnaire operations, from creation to assignment.
- **NotificationService**: Sends and retrieves user notifications.

Each service interacts with the backend API using Angular's `HttpClientModule` to fetch and post data.

---

## **Guards**

- **AuthGuard**: Protects routes based on user roles. Ensures only authenticated users can access certain routes.
- **UnsavedChangesGuard**: Warns users if they try to leave a page with unsaved changes.

```typescript
canDeactivate(component: SelectQuestionsComponent): boolean {
  if (component.hasUnsavedChanges()) {
    return confirm("You have unsaved changes! Do you really want to leave?");
  }
  return true;
}
```

---

## **Key Dependencies**

- **Angular Material**: For UI components like modals, buttons, and cards.
- **Bootstrap**: Responsive grid system and pre-built styles.
- **Google Charts & Highcharts**: For dynamic and interactive data visualization.
- **FileSaver.js & jsPDF**: Used for file exports in formats like CSV and PDF.
- **ngx-bootstrap**: For additional Bootstrap components.
- **Auth0 Angular JWT**: JWT-based authentication.

To view the full list of dependencies, refer to the `package.json` file.

---

This README ensures that users and developers can quickly understand the purpose and architecture of your Angular project, along with detailed instructions on how to set up and contribute to it. Let me know if you'd like to modify or add anything!
# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
