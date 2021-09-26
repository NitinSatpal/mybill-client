import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SellersRoutingModule } from './sellers-routing.module';
import { SellersComponent } from './sellers.component';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SearchModule } from '@app/@shared/search/search.module';
import { SummaryDetailModule } from '@app/@shared/summary-detail/summary-detail.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    PopoverModule,
    NgSelectModule,
    SearchModule,
    SummaryDetailModule,
    SellersRoutingModule
  ],
  declarations: [SellersComponent],
})
export class SellersModule {}
