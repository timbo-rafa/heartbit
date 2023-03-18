import { iLevels, iRecord } from "./blood-record.type";
import { defaultBloodComponentLevels } from "./default-blood-component-levels";

export class BloodComponentService {
    bloodComponentColor(records: iRecord[], bloodComponent, desirableColor, dangerColor='#ff4c6a') {
        var emptyIfWithinDesirableLevels: any[] = this.filterDesirableLevelsFromLastSample(records, bloodComponent)
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
    
      filterDesirableLevelsFromLastSample (records : iRecord[], bloodComponent): any[] {
        var sortedByDateRecords = records.sort(this.compareRecordsByDate)
        var arrayWithLastRecord = [ sortedByDateRecords[sortedByDateRecords.length - 1] ]
        return arrayWithLastRecord.filter( (record) => {
          return this.outsideDesirableLevels(defaultBloodComponentLevels[bloodComponent] ,record[bloodComponent])  
        })
      }
    
      compareRecordsByDate(record1, record2) {
        var date1 = new Date(record1.createdAt)
        var date2 = new Date(record2.createdAt)
    
        if (date1 == date2) return 0
        if (date1 >  date2) return 1
        else return -1
      }
    
      filterDesirableLevelsFromAll (records: iRecord[], bloodComponent): any[] {
        return records.filter( (record) => {
          return this.outsideDesirableLevels(defaultBloodComponentLevels[bloodComponent] ,record[bloodComponent])  
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
    
      extract(records: iRecord[], bloodComponent: string) {
        var ret = 
        records.map( function (record) {
          return record[bloodComponent]
        })
        return ret
      }
    
      colors(records: iRecord[], colors) {
        if (records.length == 0)
          return [colors.success, colors.primary, colors.info, '#ffffff', '#000000']
        else return [
          this.bloodComponentColor(records, 'glucose', colors.success, colors.danger),
          this.bloodComponentColor(records, 'redBloodCells', colors.primary, colors.danger),
          this.bloodComponentColor(records, 'whiteBloodCells', colors.info, colors.danger),
          this.bloodComponentColor(records, 'platelet', '#ffffff', colors.danger),
          this.bloodComponentColor(records, 'iron', '#000000', colors.danger)
        ]
      }
    
    // v2.0 for echarts-bar
    
      extractRecordDates(records: iRecord[]) {
        return records.map( record => new Date(record['createdAt']).toDateString())
      }
    
      levelToColor(bloodComponent, val, colors): string {
        var value = parseFloat(val)
        if (value < defaultBloodComponentLevels[bloodComponent].min) return colors.danger
        if (value > defaultBloodComponentLevels[bloodComponent].max) return colors.danger
        return colors.primaryLight
      }
    
      extractDataForBarEChart(records: iRecord[], bloodComponent: string, colors): any[] {  
        var eChartRecords = records.map( (record) => {
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
        return eChartRecords
      }
    
      barColors(records: iRecord[], bloodComponent: string, colors): string[] {
        return records.map( record => {
          if (this.withinDesirableLevels(bloodComponent, record[bloodComponent])) return colors.primaryLight
          else return colors.danger
        })
      }
    
      extractMinLevel(records: iRecord[], bloodComponent: string) {
        var bloodComponentRecord = records.map( (record) => {
          return record[bloodComponent]
        })
        return Math.min(...bloodComponentRecord)
      }
    
      extractMaxLevel(records: iRecord[], bloodComponent: string) {
        var bloodComponentRecord = records.map( (record) => {
          return record[bloodComponent]
        })
        return Math.max(...bloodComponentRecord)
      }   
}