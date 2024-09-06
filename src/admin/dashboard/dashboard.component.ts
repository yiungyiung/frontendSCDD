import { Component, OnInit } from '@angular/core';
import { VendorHierarchy } from '../../model/vendorHierarchy';
import { VendorHierarchyService } from '../../services/VendorHierarchyService/vendorHierarchy.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { DataFetchService } from '../../services/DataFetchService/DataFetch.service';
import * as Highcharts from 'highcharts';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { ComplianceService } from '../../services/ComplainceService/Complaince.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { Status } from '../../model/entity';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  vendorHierarchy: VendorHierarchy[] = [];
  Highcharts: typeof Highcharts = Highcharts;

  chartLabels: string[] = ['January', 'February', 'March', 'April', 'May'];

  chartData: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Series A',
      data: [5, 3, 7, 2],
      type: 'column',
    },
    {
      name: 'Series B',
      data: [2, 2, 3, 2, 1],
      type: 'column',
    },

  ];

  assignments: QuestionnaireAssignment[] = [];
  piechartData: Highcharts.SeriesPieOptions[] = [
    {
      name: 'Sales',
      type: 'pie',
      data: [
        { name: 'Product A', y: 30 },
        { name: 'Product B', y: 20 },
        { name: 'Product C', y: 25 },
        { name: 'Product D', y: 15 },
        { name: 'Product E', y: 10 },
      ],
    },
  ];

  isModal: boolean = false;
  currentCard: number | null = null;

  constructor(
    private vendorHierarchyService: VendorHierarchyService,
    private authService: AuthService,
    private dataFetchService: DataFetchService,
    private vendorService: VendorService,
    private complianceService: ComplianceService,
    private entityService:EntityService
  ) {}

  ngOnInit(): void {
    console.log(this.authService.getRoleFromToken(this.authService.getToken()));
    this.loadVendorsGroupedByCategory();
    this.loadVendorHierarchy();
    this.loadComplianceData(); // Load compliance data on initialization
  }

  loadVendorHierarchy(): void {
    const token = this.authService.getToken();
    this.vendorHierarchyService.getVendorHierarchy(token).subscribe(
      (hierarchy: VendorHierarchy[]) => {
        this.vendorHierarchy = hierarchy;
      },
      (error) => {
        console.error('Error loading vendor hierarchy:', error);
      }
    );
  }

  loadVendorsGroupedByCategory(): void {
    const token = this.authService.getToken();
    this.vendorService.getVendorsGroupedByCategory(token).subscribe(
      (data: any[]) => {
        this.piechartData = [
          {
            name: 'Vendors',
            type: 'pie',
            data: data.map(item => ({ name: item.categoryName, y: item.vendorCount })),
          },
        ];
      },
      (error) => {
        console.error('Error loading vendors by category:', error);
      }
    );
  }

  loadComplianceData(): void {
    const token = this.authService.getToken();
  
    // Fetch all statuses first
    this.entityService.getAllStatuses(token).subscribe(
      (statuses: Status[]) => {
        // Now, fetch the compliance data
        this.complianceService.getComplianceData(token).subscribe(
          (data: any) => {
            const years = Object.keys(data);
            this.chartLabels = years;
  
            // Dynamically create series based on fetched statuses
            this.chartData = statuses.map(status => ({
              name: status.statusName,
              data: years.map(year => data[year][status.statusName]), // Fill in 0 if data is missing
              type: 'column',
            }));
  
            console.log(this.chartData);
            console.log(this.chartLabels);
          },
          (error) => {
            console.error('Error loading compliance data:', error);
          }
        );
      },
      (error) => {
        console.error('Error loading statuses:', error);
      }
    );
  }
  
  maximizeCard(event: MouseEvent, cardNumber: number): void {
    event.stopPropagation();
    this.isModal = true;
    this.currentCard = cardNumber;
  }

  closeModal(): void {
    this.isModal = false;
    this.currentCard = null;
  }

  onCardClick(event: MouseEvent, cardNumber: number): void {
    if (this.isModal && this.currentCard === cardNumber) {
      event.stopPropagation(); // Prevents modal from closing when clicking on the card
    }
  }

  isCurrentCard(cardNumber: number): boolean {
    return this.currentCard === cardNumber;
  }
}
