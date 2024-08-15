/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuestionType_SelectMultipleOptionComponent } from './QuestionType_SelectMultipleOption.component';

describe('QuestionType_SelectMultipleOptionComponent', () => {
  let component: QuestionType_SelectMultipleOptionComponent;
  let fixture: ComponentFixture<QuestionType_SelectMultipleOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionType_SelectMultipleOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionType_SelectMultipleOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
