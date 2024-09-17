import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
})
export class StackedBarChartComponent implements OnChanges {
  @Input() chartData: any[] = [];
  @Input() chartLabels: string[] = [];
  columnNames = [];
  public barChartOptions: any = {
    bars: 'vertical',
    isStacked: true,
    hAxis: {
      gridlines: {
        color: 'transparent'
      },
      title: 'Year',
      format: '0',
      slantedText: true, // Enable text slanting for better visibility
      slantedTextAngle: 45, // Adjust the angle as needed
      textStyle: {
        color: '#000000', // Set text color
        fontSize: 12 // Adjust font size
      }
    },
    vAxis: {
      title: 'Total Vendors',
      textStyle: {
        color: '#000000', // Set text color
        fontSize: 12 // Adjust font size
      }
    },
    legend: { position: 'bottom' },
  };
  public chartType: ChartType = ChartType.ColumnChart;
  public formattedChartData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels']) {
      this.updateChart();
    }
  }

  private updateChart() {
    console.log('Original Chart Data:', this.chartData);
    
    if (this.chartData && this.chartData.length > 1) {
      // Preserve the header row (legend information)
      const headerRow = this.chartData[0];
      
      // Process the data rows
      const dataRows = this.chartData.slice(1).map(row => {
        if (typeof row[0] === 'string') {
          return [parseInt(row[0], 10), ...row.slice(1)];
        }
        return row;
      });

      // Combine the header row with the processed data rows
      this.formattedChartData = [ ...dataRows];
      this.columnNames=headerRow
      console.log(this.columnNames);
    }
    
    console.log('Formatted Chart Data:', this.formattedChartData);
  }
}