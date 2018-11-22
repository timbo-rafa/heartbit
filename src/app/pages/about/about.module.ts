import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { AboutRoutingModule, routedComponents } from './about-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    AboutRoutingModule
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
  ],
})
export class AboutModule { }
