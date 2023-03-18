import { iRecord } from "./blood-record.type";

export const bloodRecordMock : ({patient: string} & iRecord)[]= [
    // Rafael
    { id: 'D1CCAB11-0E40-4103-8D4D-E264A2528035', patient: '7EA95BD6-B039-485E-8ABB-D4C82238F7F7', lab: 'lab01', doctor: 'Smith', glucose: 80, redBloodCells: 5.0, whiteBloodCells: 7.0, platelet: 300, iron: 100, createdAt: new Date('2017')},
    { id: '3F0231F3-EE17-421E-BFD9-CF7B70CAEA6D', patient: '7EA95BD6-B039-485E-8ABB-D4C82238F7F7', lab: 'lab01', doctor: 'Smith', glucose: 81, redBloodCells: 5.0, whiteBloodCells: 10.0, platelet: 305, iron: 105, createdAt: new Date('2018')},
    { id: '967037B9-7569-4754-A284-AC21610C12D9', patient: '7EA95BD6-B039-485E-8ABB-D4C82238F7F7', lab: 'lab01', doctor: 'Smith', glucose: 85, redBloodCells: 4.5, whiteBloodCells: 8.0, platelet: 305, iron: 99, createdAt: new Date('2019')},
    { id: 'ABBBB26E-BDDA-4504-8234-FDBCD70D10ED', patient: '7EA95BD6-B039-485E-8ABB-D4C82238F7F7', lab: 'lab01', doctor: 'Smith', glucose: 95, redBloodCells: 4.7, whiteBloodCells: 6.4, platelet: 170, iron: 115, createdAt: new Date('2020')},
    { id: 'AFF8C3A9-79B5-4AB7-BAFD-2429C3E46415', patient: '7EA95BD6-B039-485E-8ABB-D4C82238F7F7', lab: 'lab01', doctor: 'Smith', glucose: 100, redBloodCells: 5.2, whiteBloodCells: 7.0, platelet: 200, iron: 95, createdAt: new Date('2021')},
    { id: 'AE1A220F-3DF2-4F5F-A096-E2A131AB690B', patient: '7EA95BD6-B039-485E-8ABB-D4C82238F7F7', lab: 'lab01', doctor: 'Smith', glucose: 104, redBloodCells: 4.8, whiteBloodCells: 7.2, platelet: 280, iron: 105, createdAt: new Date('2022')},

    // Max
    { id: '24862646-93D3-4182-8899-2284A9C108A2', patient: 'FB4E660F-EEA8-4D08-9EDE-3555DA57AE80', lab: 'lab01', doctor: 'Smith', glucose: 80, redBloodCells: 5.0, whiteBloodCells: 7.0, platelet: 300, iron: 100, createdAt: new Date('2017')},
    { id: 'C38D5FE9-E409-4A8E-B24F-5EFF926806B7', patient: 'FB4E660F-EEA8-4D08-9EDE-3555DA57AE80', lab: 'lab01', doctor: 'Smith', glucose: 81, redBloodCells: 5.0, whiteBloodCells: 10.0, platelet: 305, iron: 105, createdAt: new Date('2018')},
    { id: '6AC1A4CC-01D5-4B67-B453-3DD2BB178ADC', patient: 'FB4E660F-EEA8-4D08-9EDE-3555DA57AE80', lab: 'lab01', doctor: 'Smith', glucose: 85, redBloodCells: 4.5, whiteBloodCells: 8.0, platelet: 305, iron: 99, createdAt: new Date('2019')},
    { id: 'CF109293-5539-4967-8308-C805373F8B28', patient: 'FB4E660F-EEA8-4D08-9EDE-3555DA57AE80', lab: 'lab01', doctor: 'Smith', glucose: 95, redBloodCells: 4.7, whiteBloodCells: 6.4, platelet: 170, iron: 115, createdAt: new Date('2020')},
    { id: '4FADD3B1-91E7-4D21-90CE-3F764608B6FC', patient: 'FB4E660F-EEA8-4D08-9EDE-3555DA57AE80', lab: 'lab01', doctor: 'Smith', glucose: 100, redBloodCells: 5.2, whiteBloodCells: 7.0, platelet: 200, iron: 95, createdAt: new Date('2021')},
    { id: '9F16AAD6-FDD6-4D74-A908-E186457302D9', patient: 'FB4E660F-EEA8-4D08-9EDE-3555DA57AE80', lab: 'lab01', doctor: 'Smith', glucose: 104, redBloodCells: 4.8, whiteBloodCells: 7.2, platelet: 280, iron: 105, createdAt: new Date('2022')},
  ]