import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'

@Component({
  selector: 'record-table',
  templateUrl: './record-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class RecordTableComponent {

  settings = {
    add: {
      addButtonContent:    '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      patientId: {
        title:'Patient',
        'type': 'string',
      },
      id: {
        title:'ID',
        'type': 'string',
      },
      lab: {
        title:'Lab',
        type: 'string',
      },
      doctor: {
        title: 'Doctor',
        type: 'string'
      },
      glucose: {
        title: 'Glucose',
        type:'number',
      },
      redBloodCells: {
        title: 'Red Blood Cells',
        type:'number',
      },
      whiteBloodCells: {
        title: 'White Blood Cells',
        type:'number',
      },
      platelet: {
        title: 'Platelet',
        type:'number',
      },
      iron: {
        title: 'Iron',
        type:'number',
      },
      createdAt: {
        title: 'Created at',
        type: 'string',
        valuePrepareFunction: (date) => {
          var raw = new Date(date);

          var formatted
          try {
            formatted = this.datePipe.transform(raw, 'dd MMM yyyy HH:mm:ss')
          }
          catch (InvalidPipeArgument) {
            formatted = '?' + date.toString()
          }
          return formatted
        }
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  patientId: string;

  constructor(private service: HeartbitApiService, private datePipe: DatePipe,
              private activatedRoute: ActivatedRoute) {
    console.log()
    //this.parseParams(activatedRoute)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        console.log('params', params)
        this.patientId = params['patientId']
        console.log('got patientId', this.patientId)
      },
      null, //error handler
      () => this.refresh()
    )
  }
  private refresh() {
    this.service.listRecords(this.patientId).subscribe(
      records => {
        this.source.load(records)
      },
      err => console.error('listRecords subcribe ERROR', err)
    );
  }

  private parseDate(event) {
    var createdAtDate = new Date(event.newData['createdAt'])
    if ( isNaN(createdAtDate.getTime())) { //valid date?
      createdAtDate = new Date(Date.now())
    } else {
      // assume canada time
      //createdAtDate.setTime(createdAtDate.getTime() + (5*60*60*1000)) //add 5 hours
    }
    event.newData['createdAt'] = createdAtDate
  }

  onDeleteConfirm(event) {
    var deleteRecordObs = this.service.deleteRecord(event.data.patientId, event.data.id)
    
    deleteRecordObs.subscribe(
      response => {
        event.confirm.resolve()
      },
      error => {
        console.error('deleteRecord:', error)
        event.confirm.reject()
      }
    )
  }

  onSaveConfirm(event) {
    this.parseDate(event)
    var editRecordObs = this.service.editRecord(event.data.patientId, event.data.id, event.newData)
    editRecordObs.subscribe(
      response => {
        console.log('editRecord:', response.json())
        event.confirm.resolve(event.newData)
      },
      error => {
        console.error('editRecord:', error)
        event.confirm.reject()
      }
    )
  }

  onCreateConfirm(event) {
    this.parseDate(event)

    var addRecordObs = this.service.addRecord(this.patientId, event.newData)
    addRecordObs.subscribe(
      response => {
        console.log('addRecord:', response.json())
        event.confirm.resolve(event.newData)
      },
      error => {
        console.error('addRecord:', error._body)
        event.confirm.reject()
      },
      () => this.refresh()
    )
  }

  onUserRowSelect(event): void {
    console.log('click', event);
  }
}
