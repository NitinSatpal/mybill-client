import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { BuyersComponent } from './buyers.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'buyers', component: BuyersComponent, data: { title: marker('Buyers') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class BuyersRoutingModule {}
