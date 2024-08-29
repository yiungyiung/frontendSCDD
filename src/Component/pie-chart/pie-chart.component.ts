import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartData: Highcharts.SeriesPieOptions[] = []; // Specify the type as SeriesPieOptions
  @Input() chartTitle: string = 'Pie Chart';

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
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
