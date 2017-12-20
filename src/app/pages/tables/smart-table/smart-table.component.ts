import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class SmartTableComponent {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title:'Name',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number'
      },
      doctor: {
        title: 'Doctor',
        type: 'string'
      },
      insurance: {
        title: 'Insurance Company',
        type: 'string'
      },
      createdAt: {
        title: 'Created at',
        type: 'string',
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: HeartbitApiService) {
    const data = this.service.listPatientsMock()
    this.source.load(data)

    this.service.listPatients().subscribe(
      patients => this.source.load(patients),
      err => console.log('listPatients subcribe ERROR', err)
    )
    //this.service.listPatients().subscribe( function  (patients) {
    //  this.source.load(patients)
    //}.bind(this))
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
