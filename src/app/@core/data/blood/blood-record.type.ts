export interface iRecord {
    id: string;
    updatedAt?: any;
    patient: string;
    lab: string;
    doctor: string;
    glucose: number;
    redBloodCells: number;
    whiteBloodCells: number;
    platelet: number;
    iron: number;
    createdAt: Date;
  }

  export interface iLevels  {
    glucose: {
      min: number,
      max: number,
      unit: 'mg/dL'
    },
    redBloodCells: {
      min: number,
      max: number,
      unit: 'mi/mm³'
    },
    whiteBloodCells: {
      min: number,
      max: number,
      unit: 'mi/cm³'
    },
    platelet: {
      min: number,
      max: number,
      unit: '/cm³'
    },
    iron: {
      min: number,
      max: number,
      unit: 'ug/dL'
    }
  }