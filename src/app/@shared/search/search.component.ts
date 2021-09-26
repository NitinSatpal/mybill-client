import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  
  search: string = null
  @Output() readonly searchTextChanged: EventEmitter<string | null> = new EventEmitter<string | null>();


  constructor() {}

  ngOnInit() {}

  emitSearch(): void {

    if (this.search?.length >= 3) {
      // Start searching once user typed at least 3 characters.
      this.searchTextChanged.emit(this.search);
    } else {
      this.searchTextChanged.emit(null);
    }
  }
}
