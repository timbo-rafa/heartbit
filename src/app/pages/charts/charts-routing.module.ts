import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsComponent } from './charts.component';
import { EchartsComponent } from './echarts/echarts.component';
import { HeartbitApiService } from '../../@core/data/heartbit-api.service'

const routes: Routes = [{
  path: '',
  component: ChartsComponent,
  children: [{
    path: 'echart/:patientId',
    component: EchartsComponent,
    canActivate: [ HeartbitApiService ],
  }, 
  /*{
    path: 'd3',
    component: D3Component,
  }, {
    path: 'chartjs',
    component: ChartjsComponent,
  }*/
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule { }

export const routedComponents = [
  ChartsComponent,
  EchartsComponent
];
