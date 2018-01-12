import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import { HeartbitApiService } from '../../../@core/data/heartbit-api.service'
import { Notification, NotificationsService } from '../../components/notifications/notifications.service'


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent {

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
      id: {
        title:'ID',
        'type': 'string',
        //filter: false,
      },
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
        type: 'string',
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

  constructor(private service: HeartbitApiService, private datePipe: DatePipe, private router: Router
    , private notification: NotificationsService
  ) {
    const data = this.service.listPatientsMock()
    this.refresh()
  }

  private refresh() {
    this.service.listPatients().subscribe(
      patients => {
        this.source.load(patients)
        
      },
      err => console.error('listPatients subcribe ERROR', err)
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
    var deletePatientObs = this.service.deletePatient(event.data.id)
    
    deletePatientObs.subscribe(
      response => {
        event.confirm.resolve()
      },
      error => {
        console.error('deletePatient:', error)
        event.confirm.reject()
      }
    )
  }

  onSaveConfirm(event) {
    this.parseDate(event)
    var editPatientObs = this.service.editPatient(event.data.id, event.newData)
    editPatientObs.subscribe(
      response => {
        console.log('editPatient:', response.json())
        event.confirm.resolve(event.newData)
      },
      error => {
        console.error('editPatient:', error)
        event.confirm.reject()
      }
    )
  }

  onCreateConfirm(event) {
    this.parseDate(event)

    var addPatientObs = this.service.addPatient(event.newData)
    addPatientObs.subscribe(
      response => {
        console.log('addPatient:', response.json())
        event.confirm.resolve(event.newData)
      },
      error => {
        console.error('addPatient:', error._body)
        event.confirm.reject()
      },
      () => this.refresh()
    )
  }

  onUserRowSelect(event): void {
    console.log('onUserRowSelect', event)
    //console.log('event', event.data._id, event.data.id)
    this.service.patientId = event.data.id
    this.service.setPatientId(event.data.id)
    
    //var note : any = new Notification('info', 'TEST', 'test content')
    //this.notification.notify( note )
  }

  showTable() {
    this.router.navigate([ '/pages/tables/record-table/' + this.service.patientId ]);
  }

  showChart() {
    this.router.navigate([ '/pages/charts/echart/' + this.service.patientId ])
  }

  public isPatientSelected(): boolean {
    return this.service.isPatientSelected()
  }
}
