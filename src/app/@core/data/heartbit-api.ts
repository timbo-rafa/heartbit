import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { CanActivate, ActivatedRoute} from '@angular/router';
import { BloodComponentService } from './blood/blood-component.service';
import { iRecord } from './blood/blood-record.type';

const apiurl = environment.heartbitApiUrl
const patientsUrl = apiurl + '/patients'


@Injectable()
export class HeartbitApiService extends BloodComponentService implements CanActivate {

  data = [
    //{ name: 'john', age: 30, doctor: 'Smith', insurance: 'none', createdAt: Date.now().toString() },
    //{ name: 'luce', age: 18, doctor: 'Smith', insurance: 'guardme', createdAt: Date.now().toString() , garbage: 'garbage'}
  ]

  public patientId;
  public records : iRecord[];

  constructor( private http: Http, private route: ActivatedRoute) {
    super()
    this.patientId = null;
   }

  private patientUrl(id) {
    return patientsUrl + '/' + id
  }
  private recordsUrl(patientId) {
    return this.patientUrl(patientId) + '/records'
  }
  private recordUrl(patientId, recordId) {
    return this.recordsUrl(patientId) + '/' + recordId
  }

  public listPatientsMock() {
    this.listPatients().subscribe(
      res => console.log('listPatients:', res),
      error => console.error('listPatients error:', error)
    )
    return this.data;
  }

  // Patients
  public listPatients() {
    return this.http.get(patientsUrl)
      .map( (patients) => patients.json())
  }

  public addPatient(patient) {
    return this.http.post(patientsUrl, patient)
  }

  public deletePatient(id) {
    return this.http.delete(this.patientUrl(id))
  }

  public editPatient(id, newData) {
    return this.http.put(this.patientUrl(id), newData)
  }

  //Records
  public listRecords(patientId) {
    return this.http.get(this.recordsUrl(patientId))
      .map( (records) => {
        this.records = records.json()
        return records.json()
      })
  }
  public addRecord(patientId, record) {
    return this.http.post(this.recordsUrl(patientId), record)
  }
  public deleteRecord(patientId, id) {
    return this.http.delete(this.recordUrl(patientId, id))
  }
  public editRecord(patientId, id, newRecord) {
    return this.http.put(this.recordUrl(patientId, id), newRecord)
  }

  public isPatientSelected(): boolean {
    return this.patientId != null
  }

  public setPatientId(id) {
    this.patientId = id
  }

  public canActivate(): boolean {
    /*
    var obs = new Observable<boolean>();
    this.route.params.first(
      (params : Params) => {
        var pId = params['patientId']
        if (pId) {
          this.patientId = pId;
        }
        console.log('heartbit canActivate', this.patientId, this.isPatientSelected())
        obs.of(this.patientId)
        obs.complete()
        return this.isPatientSelected();
      }
    )
    */

    return true;
    //return this.isPatientSelected();
  }
}