// topbar.component.spec.ts
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopBarComponent } from './TopBar.component';
import { BurgerMenuComponent } from '../burgerMenu/burgerMenu.component'; // Import BurgerMenuComponent

import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Include this if you're using Angular animations

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarComponent, BurgerMenuComponent ], // Declare BurgerMenuComponent here
      imports: [ 
        MatIconModule, // Import Angular Material modules if used
        NoopAnimationsModule // Include this if you are using Angular animations
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests for the BurgerMenuComponent functionality can be added here
});
