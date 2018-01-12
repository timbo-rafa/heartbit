import { OnInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ActivatedRoute, Params } from '@angular/router'

import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'



@Component({
  selector: 'ngx-echarts-line',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsLineComponent implements OnInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  patientId: string;
  records: any[]

  constructor(private theme: NbThemeService, private heartbit : HeartbitApiService,
              private router: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('ngOnInit')

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
    console.log('plotChart', this.records)
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: this.colors(colors),
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}',
        },
        legend: {
          left: 'left',
          data: ['Glucose (mg/dL)',
            'Red Blood Cells (mi/mm³)',
            'White Blood Cells (mi/cm³)',
            'Platelet (/cm³)',
            'Iron (ug/dL)',
            ],
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: this.extractDate(),
            //data: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'log',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: [
          {
            name: 'Glucose (mg/dL)',
            type: 'line',
            data: this.extract('glucose'),
            //data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669],
          },
          {
            name: 'Red Blood Cells (mi/mm³)',
            type: 'line',
            data: this.extract('redBloodCells'),
            //data: [1, 2, 4, 8, 16, 32, 64, 128, 256],
          },
          {
            name: 'White Blood Cells (mi/cm³)',
            type: 'line',
            data: this.extract('whiteBloodCells'),
            //data: [1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32, 1 / 64, 1 / 128, 1 / 256, 1 / 512],
          },
          {
            name: 'Platelet (/cm³)',
            type: 'line',
            data: this.extract('platelet'),
          },
          {
            name: 'Iron (ug/dL)',
            type: 'line',
            data: this.extract('iron'),
          },
        ],
      };
    },
    (error) => console.error('getJsTheme chart:', error)
    );
  }

  colors(colors) {
    if (this.records.length == 0)
      return [colors.success, colors.primary, colors.info, '#ffffff', '#000000']
    else return [
      this.bloodComponentColor('glucose', colors.success, colors.danger),
      this.bloodComponentColor('redBloodCells', colors.primary, colors.danger),
      this.bloodComponentColor('whiteBloodCells', colors.info, colors.danger),
      this.bloodComponentColor('platelet', '#ffffff', colors.danger),
      this.bloodComponentColor('iron', '#000000', colors.danger)
    ]
  }

  bloodComponentColor(bloodComponent, desirableColor, dangerColor='#ff4c6a') {
    var emptyIfWithinDesirableLevels: any[] = this.records.filter( (record) => {
      return this.outsideDesirableLevels(this.heartbit.levels[bloodComponent] ,record[bloodComponent])  
    })
    if (emptyIfWithinDesirableLevels.length > 0) return dangerColor
    return desirableColor
  }

  /* example of above function
  glucoseColor(colors) {
    var emptyIfWithinDesirableLevels: any[] = this.records.filter( (record) => {
      return this.outsideDesirableLevels(this.heartbit.levels.glucose ,record.glucose)  
    })
    if (emptyIfWithinDesirableLevels.length > 0) return colors.danger
    return colors.success
  }
  */

  outsideDesirableLevels(bloodComponent, value): boolean {
    return !this.withinDesirableLevels(bloodComponent, value)
  }
  
  withinDesirableLevels(bloodComponent, val): boolean {
    var value = parseFloat(val)
    if (value < bloodComponent.min) return false
    if (value > bloodComponent.max) return false
    return true
  }
  
  extract(bloodComponent: string) {
    var ret = 
     this.records.map( function (record) {
      return record[bloodComponent]
    })
    console.log('extract(', bloodComponent, ret)
    return ret
  }

  extractDate() {
    return this.records.map( record => new Date(record['createdAt']).toDateString())

  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
