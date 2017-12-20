import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';

const apiurl = environment.heartbitApiUrl
const patientsUrl = apiurl + '/patients'

@Injectable()
export class HeartbitApiService {

  data = [
    { name: 'john', age: 30, doctor: 'Smith', insurance: 'none', createdAt: Date.now() },
    { name: 'luce', age: 18, doctor: 'Smith', insurance: 'guardme', createdAt: Date.now(), garbage: 'garbage'}
  ]

  constructor( private http: Http) {
   }

  public listPatientsMock() {
    this.listPatients().subscribe(
      res => console.log('res>', res),
      error => console.log('err', error)
    )
    return this.data;
  }
  public listPatients() {
    return this.http.get(patientsUrl)
      .map( (patients) => patients.json())
  }
}
