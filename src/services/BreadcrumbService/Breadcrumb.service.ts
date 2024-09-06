import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Array<{ label: string, url: string }>>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string, url: string }> = []
  ): Array<{ label: string, url: string }> {
    const routeData = route.snapshot.data;

    if (routeData['breadcrumb']) {
      const routeURL: string = route.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Store the breadcrumb URLs but conditionally hide labels
      breadcrumbs.push({
        label: routeData['breadcrumb'] !== 'admin' && routeData['breadcrumb'] !== 'vendor'
          ? routeData['breadcrumb']
          : '', // Hide labels for 'admin'/'vendor'
        url: url
      });
    }

    if (route.children.length > 0) {
      for (const child of route.children) {
        this.createBreadcrumbs(child, url, breadcrumbs);
      }
    }

    // Remove breadcrumbs with empty labels from display
    return breadcrumbs.filter(breadcrumb => breadcrumb.label !== '');
  }
}
