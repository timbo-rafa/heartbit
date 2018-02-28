import { AfterViewInit, Component, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ActivatedRoute, Params } from '@angular/router'
import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'


@Component({
  selector: 'ngx-echarts-bar',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsBarComponent implements AfterViewInit, OnDestroy {

  @Input()
  bloodComponent: string

  options: any = {};
  themeSubscription: any;
  records: any;
  patientId: string;

  constructor(private theme: NbThemeService, private router: ActivatedRoute, private heartbit: HeartbitApiService) {
  }

  ngAfterViewInit() {
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
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        //color: this.heartbit.barColors(this.bloodComponent, colors),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.heartbit.extractRecordDates(),
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
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            min: this.heartbit.levels[this.bloodComponent].min,
            max: this.heartbit.levels[this.bloodComponent].max
          },
        ],
        series: [
          {
            name: this.bloodComponent,
            type: 'bar',
            barWidth: '60%',
            data: this.heartbit.extractDataForBarEChart(this.bloodComponent, colors),
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}