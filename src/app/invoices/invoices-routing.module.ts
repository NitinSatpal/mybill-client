import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { InvoicesComponent } from './invoices.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'invoices', component: InvoicesComponent, data: { title: marker('Invoices') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class InvoicesRoutingModule {}
