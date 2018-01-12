import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { CanActivate } from '@angular/router'
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params }
from '@angular/router';

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
export class RecordTableComponent implements CanActivate {

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
      patient: {
        title:'Patient ID',
        'type': 'string',
      },
      id: {
        title:'Record ID',
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
            formatted = '?' + date.toString() // not showing on edit?
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
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.patientId = params['patientId']
        console.log('params', params, this.patientId)
        this.refresh()
      },
      (err) => {
        console.error('params:', err)
      }
    )
  }
  private refresh() {
    this.service.listRecords(this.patientId).subscribe(
      records => {
        console.log('listRecords:', records)
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

  private parseId(event) {
    var inputPatientId : String = event.data.patient.toString()
    if (inputPatientId.localeCompare("") == 0) {// equals "" 
      event.data.patient = this.patientId
    }
  }

  onDeleteConfirm(event) {
    
    var deleteRecordObs = this.service.deleteRecord(event.data.patient, event.data.id)
    
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
    var editRecordObs = this.service.editRecord(event.data.patient, event.data.id, event.newData)
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


  canActivate() {
    return true;
  }
}
