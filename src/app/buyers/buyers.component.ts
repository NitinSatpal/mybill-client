import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddressService } from '@app/@shared/services/address.service';

import { finalize } from 'rxjs/operators';
import { BuyersService } from './buyers.service';
import { PageNames } from '@shared/enums/page-names.enum';
import { ProductsService } from '@app/products/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PhoneService } from '@app/@shared/services/phone.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-buyers',
  templateUrl: './buyers.component.html',
  styleUrls: ['./buyers.component.scss'],
})
export class BuyersComponent implements OnInit {
  readonly pageNames: typeof PageNames = PageNames;

  isLoading = true;
  buyers: any = [];
  buyer: any = {};
  params: any = {};
  products: any = [];
  showSummary = false;
  errors: any;

  @ViewChild('buyerModalCloseButton', { read: ElementRef, static: false }) buyerModalCloseButton: ElementRef;

  constructor(private buyersService: BuyersService,
              private translate: TranslateService,
              private productsService: ProductsService) {}

  ngOnInit() {
    this.fetchBuyers();

    this.productsService.getProductsMinimal().subscribe((response: any): void => {
      this.products = [...response];
    });
  }

  fetchBuyers(): void {
    this.buyersService.getSellers(this.params).subscribe((response: any): void => {
      this.buyers = [...response];
      this.isLoading = false;
    });
  }

  initializeBuyer(): void {
    this.buyer = {};
    this.errors = {};
  }

  saveBuyer(): void {
    const payload = { ...this.buyer };

    if (!PhoneService.checkPhoneNumberValidity(
      payload.contact_phone_number,
      this.errors,
      payload,
      'contact_phone_number',
      [this.translate.instant('Please enter a valid 10 digit mobile number.')]
    )) {
      return;
    }
    
    payload.address = AddressService.getAddressObject(payload);
    this.buyersService.createSeller(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response: any) => {
      this.buyers.push(response);

      // Close modal.
      this.buyerModalCloseButton.nativeElement.click();
    }, (errors: HttpErrorResponse): void => {
      this.errors = errors.error;
    });
  }

  deleteBuyer(buyerId: number): void {
    this.buyersService.deleteBuyer(buyerId).subscribe((response: void): void => {
      const index = this.buyers.findIndex((buyer: any): boolean => buyer.id === buyerId);
      this.buyers.splice(index, 1);
    });
  }

  searchBuyers(searchValue: string): void {
    if (searchValue) {
      this.params.search = searchValue;
    } else {
      delete this.params.search;
    }
    
    this.fetchBuyers();
  }
}
