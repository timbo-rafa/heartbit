import { AfterViewInit, Component, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ActivatedRoute, Params } from '@angular/router'
import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';

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

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private theme: NbThemeService, private router: ActivatedRoute, private heartbit: HeartbitApiService) {
  }

  ngAfterViewInit() {
    this.router.params
    .takeUntil(this.ngUnsubscribe)
    .subscribe(
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
    this.heartbit.listRecords(this.patientId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(
      records => {
        this.records = records
        this.plotChart()
      },
      () => this.plotChart()
    )
  }

  plotChart() {
    this.theme.getJsTheme()
    .takeUntil(this.ngUnsubscribe)
    .subscribe(config => {

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
            min: this.minY(),
            max: this.maxY()
          },
        ],
        series: [{
          name: this.bloodComponent,
          type: 'bar',
          barWidth: '60%',
          data: this.heartbit.extractDataForBarEChart(this.bloodComponent, colors)
          ,markPoint : {
            data : [
                {type : 'max', name: 'max'},
                {type : 'min', name: 'min'}
            ]
          }
          , markLine: { // not working?? <<<<<
            /*lineStyle: { // or itemStyle: ???
              normal: {
                color: "#00F"
              }
            },
            label: {
              normal: {
                show: true,
                position: 'middle',
                formatter: 'MarkLine Label'
              }
            },*/
            //symbol: 'none',
            data: [
              // 1st line we want to draw
              // Minimum Desirable threshold line
              {
                type: 'average',
                name: 'avvggg'
              },
              {
                //type: 'average',
                name: 'Minimum desirable level',
                //xAxis: 50,
                yAxis: this.heartbit.levels[this.bloodComponent].min

              },
              // 2nd line we want to draw
              // Maximum Desirable threshold line
              {
                name: 'Maximum desirable level',
                yAxis: this.heartbit.levels[this.bloodComponent].max
              }
            ]
          }
        }],
      };
    });
  }

  minY() : Number {
    var minDesirable : Number = this.heartbit.levels[this.bloodComponent].min
    var minLevel : Number = this.heartbit.extractMinLevel(this.bloodComponent)

    //return minLevel;
    return minLevel < minDesirable ? minLevel : minDesirable;
  }

  maxY() : Number {
    var maxDesirable : Number = this.heartbit.levels[this.bloodComponent].max
    var maxLevel : Number = this.heartbit.extractMaxLevel(this.bloodComponent)

    return maxLevel > maxDesirable ? maxLevel : maxDesirable;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}