import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { ThisProjectComponent } from './this-project/this-project.component';

const routes: Routes = [{
  path: '',
  component: AboutComponent,
  children: [{
    path: 'this-project',
    component: ThisProjectComponent,
  },
  {
    path: '',
    redirectTo: 'this-project',
    pathMatch: 'full',
  }
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule { }

export const routedComponents = [
  AboutComponent,
  ThisProjectComponent
];
