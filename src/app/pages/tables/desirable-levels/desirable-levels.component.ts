import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { CanActivate } from '@angular/router'
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params }
from '@angular/router';

import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'

@Component({
  selector: 'desirable-levels',
  templateUrl: './desirable-levels.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class DesirableLevelsComponent {

  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      desirableLevel: {
        title:'Desirable Level',
        'type': 'string',
      },
      glucose: {
        title: 'Glucose (mg/dL)',
        type:'number',
      },
      redBloodCells: {
        title: 'Red Blood Cells (mi/mm³)',
        type:'number',
      },
      whiteBloodCells: {
        title: 'White Blood Cells (mg/dL)',
        type:'number',
      },
      platelet: {
        title: 'Platelet (/cm³)',
        type:'number',
      },
      iron: {
        title: 'Iron (ug/dL)',
        type:'number',
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  patientId: string;

  constructor(private service: HeartbitApiService, private datePipe: DatePipe,
              private activatedRoute: ActivatedRoute) {
    
    
    const data = [
    ]
    const min : any = {}
    const max : any = {}

    min.desirableLevel = "Minimum"
    Object.keys(service.levels).forEach( function (bloodComponent) {
      min[bloodComponent] = service.levels[bloodComponent].min
    })
    max.desirableLevel = "Maximum"
    Object.keys(service.levels).forEach( function (bloodComponent) {
      max[bloodComponent] = service.levels[bloodComponent].max
    })

    data.push(min)
    data.push(max)

    this.source.load(data);

  }
}
