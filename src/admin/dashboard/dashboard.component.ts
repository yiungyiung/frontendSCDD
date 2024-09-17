import { Component, OnInit } from '@angular/core';
import { VendorHierarchy } from '../../model/vendorHierarchy';
import { VendorHierarchyService } from '../../services/VendorHierarchyService/vendorHierarchy.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { DataFetchService } from '../../services/DataFetchService/DataFetch.service';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { ComplianceService } from '../../services/ComplainceService/Complaince.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { Status } from '../../model/entity';

type DataTable = (string | number | null)[][];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  vendorHierarchy: VendorHierarchy[] = [];

  // Google Charts variables
  columnChartOptions = {
    chartType: 'ColumnChart',
    dataTable: [] as DataTable,
    options: {
      title: 'SCDD Overall Status',
      hAxis: { title: 'Year' },
      vAxis: { title: 'Total Vendors' },
      isStacked: true,
    },
  };

  pieChartOptions = {
    chartType: 'PieChart',
    dataTable: [] as DataTable, // Use DataTable type
    options: {
      title: 'Vendor Distribution',
      pieHole: 0.4, // for a donut chart effect
    },
  };

  assignments: QuestionnaireAssignment[] = [];
  isModal: boolean = false;
  currentCard: number | null = null;

  // New property for chart labels
  chartLabels: string[] = [];

  constructor(
    private vendorHierarchyService: VendorHierarchyService,
    private authService: AuthService,
    private dataFetchService: DataFetchService,
    private vendorService: VendorService,
    private complianceService: ComplianceService,
    private entityService: EntityService
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
        // Format the data for Google Charts as a DataTable (array of arrays)
        this.pieChartOptions.dataTable = [
          ['Category', 'Vendor Count'], // Define the headers
          ...data.map((item) => [item.categoryName, item.vendorCount]) // Convert your data to an array of arrays
        ];
        console.log(this.pieChartOptions.dataTable); // Check the data structure
      },
      (error) => {
        console.error('Error loading vendors by category:', error);
      }
    );
  }
  loadComplianceData(): void {
    const token = this.authService.getToken();
  
    this.entityService.getAllStatuses(token).subscribe(
      (statuses: Status[]) => {
        this.complianceService.getComplianceData(token).subscribe(
          (data: any) => {
            const years = Object.keys(data).map(year => parseInt(year, 10));
            var chartData: any[] = [
              ["Year", ...statuses.map(status => status.statusName)]
            ];
            years.forEach((year) => {
              const row = [year];
              statuses.forEach((status) => {
                row.push(data[year.toString()][status.statusName] || 0);
              });
              chartData.push(row);
            });
  
            this.columnChartOptions.dataTable = chartData;
            this.chartLabels = years.map(String);
            
            console.log('Chart Data:', chartData); // For debugging
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
