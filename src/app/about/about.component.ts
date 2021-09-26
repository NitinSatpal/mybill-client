import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@app/@shared/services/profile.service';

import { environment } from '@env/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  version: string | null = environment.version;
  profiles: any[];

  constructor() {}
}
