import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPatientsComponent } from './add-patients/add-patients.component';
import { ListPatientsComponent } from './list-patients/list-patients.component';

const components = [
  AddPatientsComponent,
  ListPatientsComponent
]

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ...components,
  ],
  declarations: [
    ...components]
})
export class PatientsModule { }
