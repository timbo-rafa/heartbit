import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';

const apiurl = environment.heartbitApiUrl
const patientsUrl = apiurl + '/patients'

@Injectable()
export class HeartbitApiService {

  data = [
    //{ name: 'john', age: 30, doctor: 'Smith', insurance: 'none', createdAt: Date.now().toString() },
    //{ name: 'luce', age: 18, doctor: 'Smith', insurance: 'guardme', createdAt: Date.now().toString() , garbage: 'garbage'}
  ]

  constructor( private http: Http) {
   }

  private patientUrl(id) {
    return patientsUrl + '/' + id
  }
  public listPatientsMock() {
    this.listPatients().subscribe(
      res => console.log('listPatients:', res),
      error => console.error('listPatients error:', error)
    )
    return this.data;
  }
  public listPatients() {
    return this.http.get(patientsUrl)
      .map( (patients) => patients.json())
  }

  public addPatient(patient) {
    //console.log('addPatient ran')
    return this.http.post(patientsUrl, patient)
  }

  public deletePatient(id) {
    return this.http.delete(this.patientUrl(id))
  }

  public editPatient(id, newData) {
    return this.http.put(this.patientUrl(id), newData)
  }
}
