import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { AssignmentStatisticsDto } from '../../model/AssignmentStatisticsDto';
@Component({
  selector: 'app-Reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  statistics: AssignmentStatisticsDto | null = null; // Use the DTO
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private questionnaireAssignmentService: QuestionnaireAssignmentService // Inject the service
  ) {}
  isChildRouteActive = false;
  ngOnInit() {
    this.fetchStatistics();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the child route
        this.isChildRouteActive = this.route.firstChild != null;
      }
    });
  }

  isTableView: boolean = false;

  // Toggle the view between the list and table
  toggleView() {
    this.isTableView = !this.isTableView;
  }
  fetchStatistics() {
    const token = this.authService.getToken(); // Get the token (modify as per your app's auth system)
    if (token) {
      this.questionnaireAssignmentService
        .getAssignmentStatistics(token)
        .subscribe(
          (data) => {
            console.log(data, 'data');
            this.statistics = data;
          },
          (error) => {
            console.error('Error fetching statistics:', error);
          }
        );
    }
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'status-1';
      case 2:
        return 'status-2';
      case 3:
        return 'status-3';
      case 4:
        return 'status-4';
      case 5:
        return 'status-5';
      case 6:
        return 'status-6';
      case 7:
        return 'status-7';
      default:
        return '';
    }
  }
}
