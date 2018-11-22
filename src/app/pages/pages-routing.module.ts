import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
//import { ComponentsComponent } from './components/components.component'
//import { ComponentsModule } from './components/components.module'

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
  {
    path:'about',
    loadChildren: './about/about.module#AboutModule'
  },
    /*{
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'ui-features',
    loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
  },*/ {
    path: 'components',
    //component: ComponentsComponent,
    loadChildren: './components/components.module#ComponentsModule',
  },
  /*{
    path: 'maps',
    loadChildren: './maps/maps.module#MapsModule',
  },*/
  {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule',
  }/* {
    path: 'editors',
    loadChildren: './editors/editors.module#EditorsModule',
  }, {
    path: 'forms',
    loadChildren: './forms/forms.module#FormsModule',
  }*/, {
    path: 'tables',
    loadChildren: './tables/tables.module#TablesModule',
  }, {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    //ComponentsModule
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
