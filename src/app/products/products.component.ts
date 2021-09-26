import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { finalize } from 'rxjs/operators';
import { ProductsService } from './products.service';
import { PageNames } from '@shared/enums/page-names.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '@app/@shared/services/config.service';
import { InvoiceEnum } from '@app/@shared/enums/invoice.enum';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  readonly pageNames: typeof PageNames = PageNames;

  isLoading = true;
  products: any = [];
  product: any = {
    quantity_measurement_unit: InvoiceEnum.QUINTAL
  };
  params: any = {};
  errors: any;
  quantityMeasurementUnit: any[] = []


  @ViewChild('productModalCloseButton', { read: ElementRef, static: false }) productModalCloseButton: ElementRef;

  constructor(private productService: ProductsService,
              private configService: ConfigService) {}

  ngOnInit() {
    this.fetchProducts();

    this.configService.getConfigs().subscribe((response: any): void => {
      this.quantityMeasurementUnit = response.QuantityMeasurementUnit;
    });
  }

  initializeProduct(): void {
    this.product = {};
    this.errors = {};
  }

  fetchProducts(): void {
    this.productService.getProducts(this.params).subscribe((response: any): void => {
      this.products = [...response];
      this.isLoading = false;
    });
  }

  saveProduct(): void {
    this.productService.createProduct(this.product)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe((response: any) => {
        this.products.push(response);

        // Close modal.
        this.productModalCloseButton.nativeElement.click();
      }, (errors: HttpErrorResponse): void => {
        this.errors = errors.error;
      });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe((response: void): void => {
      const index = this.products.findIndex((seller: any): boolean => seller.id === productId);
      this.products.splice(index, 1);
    });
  }

  searchProducts(searchValue: string): void {
    if (searchValue) {
      this.params.search = searchValue;
    } else {
      delete this.params.search;
    }
    
    this.fetchProducts();
  }
}
