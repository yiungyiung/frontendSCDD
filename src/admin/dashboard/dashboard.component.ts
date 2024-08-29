import { Component, OnInit } from '@angular/core';
import { VendorHierarchy } from '../../model/vendorHierarchy';
import { VendorHierarchyService } from '../../services/VendorHierarchyService/vendorHierarchy.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { DataFetchService } from '../../services/DataFetchService/DataFetch.service';
import * as Highcharts from 'highcharts';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
    {
      name: 'Series C',
      data: [3, 4, 4, 2, 5],
      type: 'column',
    },
  ];
  assignments: QuestionnaireAssignment[] = [];

  constructor(
    private vendorHierarchyService: VendorHierarchyService,
    private authService: AuthService,
    private dataFetchService: DataFetchService
  ) {}

  loadAllAssignments(): void {
    this.dataFetchService.loadAssignments().subscribe(
      (data: QuestionnaireAssignment[]) => {
        this.assignments = data;
        console.log(this.assignments);
      },
      (error) => {
        console.error('Error fetching assignments', error);
      }
    );
  }

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

  ngOnInit(): void {
    console.log(this.authService.getRoleFromToken(this.authService.getToken()));
    this.loadVendorHierarchy();
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

  isModal: boolean = false;
  currentCard: number | null = null;

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
