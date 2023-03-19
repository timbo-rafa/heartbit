import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CanActivate, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BloodComponentService } from './blood/blood-component.service';
import { bloodRecordMock } from './blood/blood-record.mock';
import { iRecord } from './blood/blood-record.type';
import { HeartbitApiService } from './heartbit-api';
import { patientsMock } from './patient.mock';
import {v4 as uuidv4} from 'uuid'

@Injectable()
export class HeartbitApiMockService implements CanActivate {

  protected patientsData = [...patientsMock]

  protected bloodRecordData = [...bloodRecordMock]

  public patientId;
  public records : iRecord[];

  levels = {
    glucose: {
      min: 70,
      max: 99,
      unit: 'mg/dL'
    },
    redBloodCells: {
      min: 4.3,
      max: 5.7,
      unit: 'mi/mm³'
    },
    whiteBloodCells: {
      min: 3.5,
      max: 10.5,
      unit: 'mi/cm³'
    },
    platelet: {
      min: 150,
      max: 450,
      unit: '/cm³'
    },
    iron: {
      min: 49,
      max: 181,
      unit: 'ug/dL'
    }
  }

  constructor( private http: Http, private route: ActivatedRoute) {
    this.patientsData = [...patientsMock]
  this.bloodRecordData = [...bloodRecordMock]
    this.patientId = null;
    
   }

  // Patients
  public listPatients() {
    return Observable.of([...this.patientsData])
  }

  public addPatient(patient) {
    const id = patient.id || uuidv4();
    const newPatient = {...patient, id};
    this.patientsData.push(newPatient);
    return Observable.of(newPatient);
  }

  public deletePatient(id) {
    this.patientsData = this.patientsData.filter(patient => patient.id !== id)
    return Observable.of(this.patientsData)
  }

  public editPatient(id, newData) {
    const idx = this.patientsData.findIndex(patient => patient.id === id)

    if (idx) {
      this.patientsData[idx] = newData
    }
    return Observable.of(newData)
  }

  //Records
  public listRecords(patientId) {
    return Observable.of(this.bloodRecordData.filter(record => record.patient === patientId))
  }
  public addRecord(patientId, record) {
    const id = record.id || uuidv4();
    const newRecord = {createdAt: new Date(), ...record, patient: patientId, id};
    this.bloodRecordData.push(newRecord)
    this.bloodRecordData.sort((r1, r2) => r1.createdAt.getTime() - r2.createdAt.getTime())
    return Observable.of(newRecord)
  }
  public deleteRecord(patientId, id) {
    this.bloodRecordData = this.bloodRecordData.filter(record => record.patient !== patientId || record.id !== id)
    return Observable.of(this.bloodRecordData)
  }
  public editRecord(patientId, id, editedRecord) {
    const idx = this.bloodRecordData.findIndex(record => record.patient !== patientId || record.id !== id)

    if (idx) {
      this.bloodRecordData[idx] = editedRecord
      this.bloodRecordData.sort((r1, r2) => r1.createdAt.getTime() - r2.createdAt.getTime())
    }
    return Observable.of(editedRecord)
  }

  public isPatientSelected(): boolean {
    return this.patientId != null
  }

  public setPatientId(id) {
    this.patientId = id
  }

  public canActivate(): boolean {
    return true;
  }
}
