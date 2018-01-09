import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ToasterModule } from 'angular2-toaster';
import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { NotificationsService } from '../components/notifications/notifications.service'

import { RecordTableComponent } from './record-table/record-table.component'



@NgModule({
  imports: [
    ThemeModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    ToasterModule
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    SmartTableService,
    NotificationsService,
    RecordTableComponent
  ],
})
export class TablesModule { }
