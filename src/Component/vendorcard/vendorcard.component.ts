import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendorcard',
  templateUrl: './vendorcard.component.html',
  styleUrls: ['./vendorcard.component.css']
})
export class VendorcardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() vendor: any;
  @Input() toggleVendorStatus: (vendor: any) => void = () => {
    console.log("workinh");
  }; 
  

}
