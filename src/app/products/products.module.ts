import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SearchModule } from '@app/@shared/search/search.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    PopoverModule,
    NgSelectModule,
    SearchModule,
    ProductsRoutingModule
  ],
  declarations: [ProductsComponent],
})
export class ProductsModule {}
