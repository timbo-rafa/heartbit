import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { CanActivate, ActivatedRoute, Params } from '@angular/router';
import { Observable  } from 'rxjs/Observable';

import { of } from 'rxjs/observable/of';

const apiurl = environment.heartbitApiUrl
const patientsUrl = apiurl + '/patients'


@Injectable()
export class HeartbitApiService implements CanActivate {

  data = [
    //{ name: 'john', age: 30, doctor: 'Smith', insurance: 'none', createdAt: Date.now().toString() },
    //{ name: 'luce', age: 18, doctor: 'Smith', insurance: 'guardme', createdAt: Date.now().toString() , garbage: 'garbage'}
  ]

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
    //console.log('addPatient ran')
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

  /*
  public clearPatientId() {
    this.patientId = null
  }
  */

  bloodComponentColor(bloodComponent, desirableColor, dangerColor='#ff4c6a') {
    var emptyIfWithinDesirableLevels: any[] = this.filterDesirableLevelsFromLastSample(bloodComponent)
    if (emptyIfWithinDesirableLevels.length > 0) return dangerColor
    return desirableColor
  }

  /* example of above function
  glucoseColor(colors) {
    var emptyIfWithinDesirableLevels: any[] = this.records.filter( (record) => {
      return this.outsideDesirableLevels(this.heartbit.levels.glucose ,record.glucose)  
    })
    if (emptyIfWithinDesirableLevels.length > 0) return colors.danger
    return colors.success
  }
  */

  filterDesirableLevelsFromLastSample (bloodComponent): any[] {
    var sortedByDateRecords = this.records.sort(this.compareRecordsByDate)
    var arrayWithLastRecord = [ sortedByDateRecords[sortedByDateRecords.length - 1] ]
    console.log('Last Record dated ', arrayWithLastRecord[0].createdAt.toString())
    return arrayWithLastRecord.filter( (record) => {
      return this.outsideDesirableLevels(this.levels[bloodComponent] ,record[bloodComponent])  
    })
  }

  compareRecordsByDate(record1, record2) {
    var date1 = new Date(record1.createdAt)
    var date2 = new Date(record2.createdAt)

    if (date1 == date2) return 0
    if (date1 >  date2) return 1
    else return -1
  }

  filterDesirableLevelsFromAll (bloodComponent): any[] {
    return this.records.filter( (record) => {
      return this.outsideDesirableLevels(this.levels[bloodComponent] ,record[bloodComponent])  
    })
  }

  outsideDesirableLevels(bloodComponent, value): boolean {
    return !this.withinDesirableLevels(bloodComponent, value)
  }

  withinDesirableLevels(bloodComponent, val): boolean {
    var value = parseFloat(val)
    if (value < bloodComponent.min) return false
    if (value > bloodComponent.max) return false
    return true
  }

  extract(bloodComponent: string) {
    var ret = 
    this.records.map( function (record) {
      return record[bloodComponent]
    })
    console.log('extract(', bloodComponent, ret)
    return ret
  }

  colors(colors) {
    if (this.records.length == 0)
      return [colors.success, colors.primary, colors.info, '#ffffff', '#000000']
    else return [
      this.bloodComponentColor('glucose', colors.success, colors.danger),
      this.bloodComponentColor('redBloodCells', colors.primary, colors.danger),
      this.bloodComponentColor('whiteBloodCells', colors.info, colors.danger),
      this.bloodComponentColor('platelet', '#ffffff', colors.danger),
      this.bloodComponentColor('iron', '#000000', colors.danger)
    ]
  }

// v2.0 for echarts-bar

  extractRecordDates() {
    return this.records.map( record => new Date(record['createdAt']).toDateString())
  }

  levelToColor(bloodComponent, val, colors): string {
    var value = parseFloat(val)
    if (value < this.levels[bloodComponent].min) return colors.danger
    if (value > this.levels[bloodComponent].max) return colors.danger
    return colors.primaryLight
  }

  extractDataForBarEChart(bloodComponent: string, colors): any[] {  
    var r = this.records.map( (record) => {
      return {
        value: record[bloodComponent],
        itemStyle: {
          normal: {
            color: this.levelToColor(bloodComponent, record[bloodComponent], colors)
            //barBorderRadius
            //barBorderWidth
          }
          //emphasis: {}
        }
      }
    })
    console.log('extractDataForBarEChart:', bloodComponent, r)
    return r
  }

  barColors(bloodComponent: string, colors): string[] {
    return this.records.map( record => {
      if (this.withinDesirableLevels(bloodComponent, record[bloodComponent])) return colors.primaryLight
      else return colors.danger
    })
  }

  extractMinLevel(bloodComponent: string) {
    var bloodComponentRecord = this.records.map( (record) => {
      return record[bloodComponent]
    })
    return Math.min(...bloodComponentRecord)
  }

  extractMaxLevel(bloodComponent: string) {
    var bloodComponentRecord = this.records.map( (record) => {
      return record[bloodComponent]
    })
    return Math.max(...bloodComponentRecord)
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

interface iRecord {
  updatedAt?: any;
  patient: string;
  lab: string;
  doctor: string;
  glucose: number;
  redBloodCells: number;
  whiteBloodCells: number;
  platelet: number;
  iron: number;
  createdAt: any;
}