import { Component, OnInit } from '@angular/core';
import { FrameworkDetails, Framework } from '../../model/entity';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-FrameworkDetails',
  templateUrl: './FrameworkDetails.component.html',
  styleUrls: ['./FrameworkDetails.component.scss'],
})
export class FrameworkDetailsComponent implements OnInit {
  frameworkDetails: FrameworkDetails[] | undefined;
  frameworkNames: { [id: number]: string } = {}; // Store framework names by ID
  token: string | undefined;

  constructor(
    private entityService: EntityService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.loadFrameworkDetails();
  }

  toggleFramework(detail: any) {
    detail.expanded = !detail.expanded; // Toggle the expanded property
  }

  loadFrameworkDetails(): void {
    this.entityService.getAllFrameworkDetails(this.token!).subscribe(
      (details) => {
        this.frameworkDetails = details;
        this.frameworkDetails.forEach((detail) => {
          this.getFrameworkName(detail.frameworkID); // Fetch the framework name
        });
      },
      (error) => console.error('Error fetching framework details', error)
    );
  }

  getFrameworkName(frameworkId: number): void {
    if (this.token) {
      this.entityService.GetFrameworkById(frameworkId, this.token).subscribe(
        (framework: Framework) => {
          this.frameworkNames[frameworkId] = framework.frameworkName; // Store name by ID
        },
        (error) => {
          console.error('Error fetching framework name', error);
        }
      );
    }
  }
}
