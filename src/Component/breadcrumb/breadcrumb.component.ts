import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: { label: string; path: string }[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.route.root);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; path: string }> = []
  ): Array<{ label: string; path: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string[] = child.snapshot.url.map(
        (segment) => segment.path
      );
      const breadcrumbLabel =
        child.snapshot.data['breadcrumb'] || routeURL.join('/');

      if (routeURL.length > 0) {
        url += `/${routeURL.join('/')}`;
        breadcrumbs.push({ label: breadcrumbLabel, path: url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
