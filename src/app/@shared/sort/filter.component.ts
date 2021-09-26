import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyersService } from '@app/buyers/buyers.service';
import { ProductsService } from '@app/products/products.service';
import { SellersService } from '@app/sellers/sellers.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  
  @Input() showSeller = false;
  @Input() sellers?: any[];
  @Input() showBuyer = false;
  @Input() buyers?: any[];
  @Input() showProduct = false;
  @Input() products?: any[];
  @Input() showDateRange = false;

  // By default 4 drop-downs per row .
  @Input() dropdownPercentWidth = 25

  dropDowns: any = [];
  changeRowFactor = 0;
  columnWidthClass = 'col-cs-25';

  @Output() readonly filterChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private sellersService: SellersService,
              private buyersService: BuyersService,
              private productsService: ProductsService) {}

  ngOnInit() {
    if (this.showSeller) {
      if (!this.sellers) {
        this.sellersService.getSellersMinimal().subscribe((response: any): void => {
          this.createDropdownEntry(response, 'seller', 'All Sellers');
        });
      } else {
        this.createDropdownEntry(this.sellers, 'seller', 'All Sellers');
      }
    }

    if (this.showSeller) {
      if (!this.buyers) {
        this.buyersService.getBuyersMinimal().subscribe((response: any): void => {
          this.createDropdownEntry(response, 'buyer', 'All Buyers');
        });
      } else {
        this.createDropdownEntry(this.buyers, 'buyer', 'All Buyers');
      }
    }

    if (this.showProduct) {
      if (!this.products) {
        this.productsService.getProductsMinimal().subscribe((response: any): void => {
          this.createDropdownEntry(response, 'product', 'All Products');
        });
      } else {
        this.createDropdownEntry(this.products, 'product', 'All Products');
      }
    }

    // Starting from index 0, after the following index, new row should be created.
    this.changeRowFactor = (100 / this.changeRowFactor) -1;
    
    // Set the column width class based on width in percent.
    this.columnWidthClass = `col-cs-${this.dropdownPercentWidth}`;
  }

  createDropdownEntry(
    options: any,
    model: string,
    placeholder: string,
    bindLabel: string = 'name',
    bindValue: string = 'id'
  ): void {
    this.dropDowns.push({
      options,
      model,
      placeholder,
      bindLabel,
      bindValue
    })
  }

  emitSort(): void {
    const params: any = {};

    for (const dropdown of this.dropDowns) {
      console.log(dropdown);
      params[dropdown.model] = dropdown[dropdown.model];
    }

    this.filterChanged.emit(params);
  }
}
