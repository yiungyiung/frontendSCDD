import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupBoxComponent } from './popup-box.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PopupBoxComponent],
  exports: [
    PopupBoxComponent
  ]
})
export class PopupBoxModule { }
