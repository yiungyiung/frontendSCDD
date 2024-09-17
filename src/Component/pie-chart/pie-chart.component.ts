import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges, OnInit {
  @Input() chartData: any[][] = []; // Array of arrays (flexible for different data formats)
  @Input() chartTitle: string = 'Pie Chart';

  title: string = this.chartTitle;
  type: ChartType = ChartType.PieChart;
  data: (string | number | null)[][] = []; // Use DataTable format for Google Charts
  columnNames: string[] = ['Category', 'Value'];
  options: any = { legend: { position: 'bottom' } };

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartTitle']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.title = this.chartTitle;
    this.data = this.prepareChartData(this.chartData);
  }

  private prepareChartData(data: any[][]): (string | number | null)[][] {
    if (!data || data.length === 0) {
      return []; // Handle empty data gracefully
    }

    if (data[0].length !== 2) {
      console.warn('Input data should have two columns: Category and Value');
      return data.slice(1); // Assuming valid data starts from the second row
    }

    // Check if data is already in DataTable format
    if (Array.isArray(data[0][0])) {
      // If data is an array of arrays (e.g., nested arrays), use it directly
      return data;
    }

    // Otherwise, convert data to DataTable format
    return data.slice(1).map(row => [row[0], row[1]]); // Assuming data starts from the second row
  }
}