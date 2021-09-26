import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryDetailComponent } from './summary-detail.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [SummaryDetailComponent],
  exports: [SummaryDetailComponent],
})
export class SummaryDetailModule {}
