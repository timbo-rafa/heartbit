import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { NbThemeService } from '@nebular/theme';

import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'
import { ActivatedRoute, Params } from '@angular/router'


@Component({
  selector: 'timbo-google-charts',
  templateUrl: './google-charts.component.html',
  styleUrls: ['./google-charts.component.scss']
})
export class GoogleChartsComponent implements OnInit{

  comboChartData: any
  themeSubscription: any
  patientId: string;
  records: any[]

  constructor(private theme: NbThemeService, private heartbit : HeartbitApiService, private router: ActivatedRoute) {
  }

  ngOnInit() {
    
    this.router.params.subscribe(
      (params: Params) => {
        var paramPatientId = params['patientId']
        if (paramPatientId) {
          this.patientId = paramPatientId
          this.heartbit.patientId = this.patientId
        }
        this.listRecords()
      },
    )
  }

  
  listRecords() {
    this.heartbit.listRecords(this.patientId).subscribe(
      records => {
        this.records = records
        this.plotChart()
      },
      () => this.plotChart()
    )
  }

  plotChart() {
    console.log('google-charts.plotChart', this.records)
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.comboChartData =  {
        chartType: 'ComboChart',
        dataTable: [
          ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
          ['2004/05',  165,      938,         522,             998,           450,      614.6],
          ['2005/06',  135,      1120,        599,             1268,          288,      682],
          ['2006/07',  157,      1167,        587,             807,           397,      623],
          ['2007/08',  139,      1110,        615,             968,           215,      609.4],
          ['2008/09',  136,      691,         629,             1026,          366,      569.6]
       ],
        options: {
          title: 'Tasks',
          backgroundColor: echarts.bg,
          chartArea: {
            backgroundColor: echarts.bg,
            height: "500px",
          },
          seriesType: 'bars',
          series: {5: {type: 'line'}},
          height: "100%",
          width: "100%"
        },
      };
    })
  }

  public ready(event: ChartReadyEvent) {
    console.log('ChartReady', event)
  }

  public error(event: ChartErrorEvent) {
    console.log('ChartError', event)
  }
}
