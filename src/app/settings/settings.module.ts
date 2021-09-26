import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
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
    SettingsRoutingModule
  ],
  declarations: [SettingsComponent],
})
export class SettingsModule {}
