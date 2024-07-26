import { Component, OnInit } from '@angular/core';

import { PopupService } from '../../../services/PopupService/popup.service';

@Component({
  selector: 'app-popup-box',
  templateUrl: './popup-box.component.html',
  styleUrls: ['./popup-box.component.css']
})
export class PopupBoxComponent implements OnInit {

  constructor(private popupService: PopupService) {
    this.popupService.popupState$.subscribe(popupData => {
      this.show(popupData.message, popupData.backgroundColor);
    });
  }

  ngOnInit(): void { }
  
    message: string = '';
    backgroundColor: string = 'black'; // Default background color
    isVisible: boolean = false;

    show(message: string, backgroundColor: string): void {
      this.message = message;
      this.backgroundColor = backgroundColor;
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 2000);
    }
  }
  
