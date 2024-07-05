import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from '../Component/login/login.component';
import { TestComponent } from '../Component/test/test.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from '../Component/admin-dashboard/admin-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { NavItemComponent } from '../Component/nav-item/nav-item.component';
import { MenubarComponent } from '../Component/menubar/menubar.component';
import { TopBarComponent } from '../Component/TopBar/TopBar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TestComponent,
    AdminDashboardComponent,
    NavItemComponent,
    MenubarComponent,
    TopBarComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatIconModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
