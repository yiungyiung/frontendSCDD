import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from '../../services/BreadcrumbService/Breadcrumb.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-Breadcrumb',
  templateUrl: './Breadcrumb.component.html',
  styleUrls: ['./Breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<{ label: string, url: string }> = [];
  private breadcrumbSubscription: Subscription = new Subscription();

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbSubscription = this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  ngOnDestroy() {
    this.breadcrumbSubscription.unsubscribe();
  }
  GoTo(url:string)
  {
    console.log(url);
  }
}
