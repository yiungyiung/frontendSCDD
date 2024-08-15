import { Component, Input, ElementRef, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements AfterViewInit {
  @Input() svgIcon!: string;
  @Input() text!: string;
  @Input() href!: string;
  @Input() hasSubPanel: boolean = false;
  showSubPanel: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (this.hasSubPanel) {
      // Force the sub-panel to be rendered
      this.showSubPanel = true;
      this.cdr.detectChanges();
      
      // Adjust the size
      this.adjustSubPanelSize();
      
      // Hide the sub-panel again
      this.showSubPanel = false;
      this.cdr.detectChanges();
    }
  }

  toggleSubPanel(show: boolean) {
    this.showSubPanel = show;
    if (show) {
      this.adjustSubPanelSize();
    }
  }

  private adjustSubPanelSize() {
    const navbarElement = this.elementRef.nativeElement.closest('.custom-navbar');
    const subPanelElement = this.elementRef.nativeElement.querySelector('.sub-panel');
    if (navbarElement && subPanelElement) {
      const navbarRect = navbarElement.getBoundingClientRect();
      const navItemRect = this.elementRef.nativeElement.getBoundingClientRect();
      this.renderer.setStyle(subPanelElement, 'width', `${navbarRect.width}px`);
      this.renderer.setStyle(subPanelElement, 'left', `${navbarRect.left - navItemRect.left}px`);
    }
  }
}