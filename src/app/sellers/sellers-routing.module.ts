import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { SellersComponent } from './sellers.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'sellers', component: SellersComponent, data: { title: marker('Sellers') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SellersRoutingModule {}
