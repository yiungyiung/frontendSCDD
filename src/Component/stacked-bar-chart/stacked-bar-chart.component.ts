import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css'],
})
export class StackedBarChartComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartData: Highcharts.SeriesOptionsType[] = [];
  @Input() chartLabels: string[] = [];

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column', // Changed from 'bar' to 'column' for vertical bars
    },
    title: {
      text: 'SCDD Overall Status',
    },
    xAxis: {
      categories: this.chartLabels,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Vendors',
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color:
            (Highcharts.defaultOptions.title?.style &&
              Highcharts.defaultOptions.title.style.color) ||
            'gray',
        },
      },
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    series: this.chartData,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels']) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.chartOptions = {
      ...this.chartOptions,
      xAxis: { categories: this.chartLabels },
      series: this.chartData,
    };
  }
}
