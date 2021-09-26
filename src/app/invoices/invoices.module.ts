import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SearchModule } from '@app/@shared/search/search.module';
import { FilterModule } from '@app/@shared/sort/filter.module';
import { SummaryDetailModule } from '@app/@shared/summary-detail/summary-detail.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    InvoicesRoutingModule,
    BrowserAnimationsModule,
    PopoverModule,
    SearchModule,
    FilterModule,
    SummaryDetailModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [InvoicesComponent],
})
export class InvoicesModule {}
