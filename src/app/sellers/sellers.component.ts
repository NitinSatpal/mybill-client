import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddressService } from '@app/@shared/services/address.service';

import { finalize } from 'rxjs/operators';
import { SellersService } from './sellers.service';
import { PageNames } from '@shared/enums/page-names.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsService } from '@app/products/products.service';
import { TranslateService } from '@ngx-translate/core';
import { PhoneService } from '@app/@shared/services/phone.service';


@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss'],
})
export class SellersComponent implements OnInit {

  readonly pageNames: typeof PageNames = PageNames;

  isLoading = true;
  sellers: any = [];
  seller: any = {};
  params: any = {};
  products: any = [];
  showSummary = false;
  errors: any;


  @ViewChild('sellerModalCloseButton', { read: ElementRef, static: false }) sellerModalCloseButton: ElementRef;

  constructor(private sellerService: SellersService,
              private translate: TranslateService,
              private productsService: ProductsService) {}

  ngOnInit() {
    this.fetchSellers();

    this.productsService.getProductsMinimal().subscribe((response: any): void => {
      this.products = [...response];
    });
  }

  fetchSellers(): void {
    this.sellerService.getSellers(this.params).subscribe((response: any): void => {
      this.sellers = [...response];
      this.isLoading = false;
    });
  }

  initializeSeller(): void {
    this.seller = {};
    this.errors = {};
  }

  saveSeller(): void {
    const payload = { ...this.seller };
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

    this.sellerService.createSeller(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe((response: any) => {
        this.sellers.push(response);

        // Close modal.
        this.sellerModalCloseButton.nativeElement.click();
      }, (errors: HttpErrorResponse): void => {
        this.errors = errors.error;
      });
  }

  deleteSeller(sellerId: number): void {
    this.sellerService.deleteSeller(sellerId).subscribe((response: void): void => {
      const index = this.sellers.findIndex((seller: any): boolean => seller.id === sellerId);
      this.sellers.splice(index, 1);
    });
  }

  searchSellers(searchValue: string): void {
    if (searchValue) {
      this.params.search = searchValue;
    } else {
      delete this.params.search;
    }
    
    this.fetchSellers();
  }
}
