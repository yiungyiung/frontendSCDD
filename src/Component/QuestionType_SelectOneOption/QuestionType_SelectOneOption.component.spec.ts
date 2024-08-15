/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuestionType_SelectOneOptionComponent } from './QuestionType_SelectOneOption.component';

describe('QuestionType_SelectOneOptionComponent', () => {
  let component: QuestionType_SelectOneOptionComponent;
  let fixture: ComponentFixture<QuestionType_SelectOneOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionType_SelectOneOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionType_SelectOneOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
