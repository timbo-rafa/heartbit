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
export class GoogleChartsComponent implements OnInit {

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
      console.log(config)
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.comboChartData =  {
        chartType: 'ComboChart',
        dataTable: this.generateDataTable('glucose'),
        options: {
          title: 'Tasks',
          colors: [colors.successLight],
          backgroundColor: echarts.bg,
          chartArea: {
            backgroundColor: echarts.bg,
            height: "500px",
          },
          seriesType: 'bars',
          series: {1: {type: 'line'}},
          height: "100%",
          width: "100%",
          hAxis: {
            textStyle:{
              color: colors.fgText
            }
          },
          tooltip: {
            textStyle: {
              color: colors.fgHeading
            }
          },
          legend: {
            textStyle: {
              color: colors.fgText
            }
          },
          titleTextStyle: {
            color: colors.fgHeading
          }
        },
      };
    })
  }

  generateDataTable(bloodComponent: string) {
    var dataTable:any[] = [
      ['Date', bloodComponent]
    ]
    for (let record of this.records) {
      var row = []
      var date = new Date(record['createdAt']).toDateString()
      row.push(date)
      row.push(record[bloodComponent])
      //row.push(this.heartbit.levels[bloodComponent].min)
      dataTable.push(row)
    }
    return dataTable
  }

  public ready(event: ChartReadyEvent) {
    console.log('ChartReady', event)
  }

  public error(event: ChartErrorEvent) {
    console.log('ChartError', event)
  }
}
