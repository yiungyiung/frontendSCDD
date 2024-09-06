import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartData: Highcharts.SeriesPieOptions[] = []; // Specify the type as SeriesPieOptions
  @Input() chartTitle: string = 'Pie Chart';

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: null, // Allows the chart to take the full height of the container
      width: null, // Allows the chart to take the full width of the container
    },
    title: {
      text: this.chartTitle,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: this.chartData,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartTitle']) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.chartOptions = {
      ...this.chartOptions,
      title: { text: this.chartTitle },
      series: this.chartData,
    };
  }
}
