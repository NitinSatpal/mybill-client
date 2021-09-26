import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
selector: 'app-summary-detail',
  templateUrl: './summary-detail.component.html',
  styleUrls: ['./summary-detail.component.scss'],
})
export class SummaryDetailComponent implements OnInit {

  isSummary = false;
  @Input() page: string;

  @Output() readonly summaryDetailFlagChanged: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private profileService: ProfileService) {
    setTimeout((): void => {
      console.log(this.profileService.profile[this.page])
      this.isSummary = Boolean(this.profileService.profile[this.page]);
      this.summaryDetailFlagChanged.emit(this.isSummary);
    });
  }

  ngOnInit() {}

  onSummaryDetailFlagChange(): void {
    this.summaryDetailFlagChanged.emit(this.isSummary);
    const extraData = {}
    extraData[this.page] = this.isSummary;
    this.profileService.setExtraStorage(extraData)
  }
}
