import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '@app/@shared/services/config.service';
import { DateTimeService } from '@app/@shared/services/date-time.service';
import { BuyersService } from '@app/buyers/buyers.service';
import { SellersService } from '@app/sellers/sellers.service';

import { Logger } from '@core';
import { finalize } from 'rxjs/operators';
import { InvoicesService } from './invoices.service';
import { InvoiceEnum } from '@shared/enums/invoice.enum';
import { PageNames } from '@shared/enums/page-names.enum';
import { ProductsService } from '@app/products/products.service';
import { ProfileService } from '@app/@shared/services/profile.service';
import { SettingsService } from '@app/settings/settings.service';


const log = new Logger('Invoice');

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  readonly invoiceEnum: typeof InvoiceEnum = InvoiceEnum;
  readonly pageNames: typeof PageNames = PageNames;

  isLoading = true;
  invoices: any;
  invoice: any = {
    quantity_measurement_unit: InvoiceEnum.QUINTAL,
    seller_commission_type: InvoiceEnum.FIXED,
    buyer_commission_type: InvoiceEnum.FIXED,
    commission_type: InvoiceEnum.FIXED,
    discount_type: InvoiceEnum.FIXED,
    charge_applicable_to: InvoiceEnum.BOTH_SELLER_AND_BUYER,
  };
  sellersMinimal: any[] = [];
  sellersLoading = true;
  buyersMinimal: any[] = [];
  buyersLoading = true;
  productsMinimal: any[] = [];
  productsLoading = true;
  paymentStatus: any[] = [];
  quantityMeasurementUnit: any[] = [];
  priceCommissionAndDiscountApplicability: any[] = [];
  commissionAndDiscountType: any[] = [];
  showDiscountSection = false;
  showSeparateCommissionSection = false;
  finalPrice: number;
  params: any = {};
  errors: any;
  showSummary = false;
  selectedInvoices: any[] = [];
  selectedPaymentStatus: any;
  filtersApplied = false;
  profileSettings: any = {};

  commissionApplicability: any[] = [
    { enum_name: 'Both Seller and Buyer', enum_id: InvoiceEnum.BOTH_SELLER_AND_BUYER },
    { enum_name: 'Only to Seller', enum_id: InvoiceEnum.ONLY_SELLER },
    { enum_name: 'Only to Buyer', enum_id: InvoiceEnum.ONLY_BUYER },
  ];

  @ViewChild('invoiceModalCloseButton', { read: ElementRef, static: false }) invoiceModalCloseButton: ElementRef;
  @ViewChild('invoicePaymentModalButton', { read: ElementRef, static: false }) invoicePaymentModalButton: ElementRef;
  @ViewChild(
    'invoicePaymentModalCloseButton', { read: ElementRef, static: false }
  ) invoicePaymentModalCloseButton: ElementRef;

  constructor(
    private invoicesService: InvoicesService,
    private sellersService: SellersService,
    private buyersService: BuyersService,
    private configService: ConfigService,
    private productsService: ProductsService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit() {

    this.settingsService.getProfileSettings().subscribe((response: any): void => {
      if (response) {
        this.profileSettings = { ...response };
      }
    });
    this.fetchInvoices();

    this.sellersService.getSellersMinimal().subscribe(
      (response: any[]): void => {
        this.sellersMinimal = response;
        this.sellersLoading = false;
      }, (errors: HttpErrorResponse): void => {
        this.sellersLoading = false;
        log.info(errors.error);
      }
    );

    this.buyersService.getBuyersMinimal().subscribe(
      (response: any[]): void => {
        this.buyersMinimal = response;
        this.buyersLoading = false;
      }, (errors: HttpErrorResponse): void => {
        this.buyersLoading = false;
        log.info(errors.error);
      }
    );

    this.productsService.getProductsMinimal().subscribe((response: any): void => {
      this.productsMinimal = [...response];
      this.productsLoading = false;
    });

    this.configService.getConfigs().subscribe((response: any): void => {
      this.quantityMeasurementUnit = response.QuantityMeasurementUnit;
      this.priceCommissionAndDiscountApplicability = response.PriceCommissionAndDiscountApplicability;
      this.commissionAndDiscountType = response.CommissionAndDiscountType;
      this.paymentStatus = response.PaymentStatus;
    });
  }

  fetchInvoices(): void {
    this.invoicesService.getInvoices(this.params).subscribe((response: any): void => {
      this.invoices = [...response];
      this.isLoading = false;
    });
  }

  initializeInvoice(): any {
    this.invoice = {
      quantity_measurement_unit: 1,
      seller_commission_type: InvoiceEnum.FIXED,
      buyer_commission_type: InvoiceEnum.FIXED,
      discount_type: InvoiceEnum.FIXED,
      charge_applicable_to: InvoiceEnum.BOTH_SELLER_AND_BUYER,
    };
    this.errors = {};
  }

  resetInvoice(): any {
    this.invoice.seller_commission_value = null;
    this.invoice.seller_commission_applied_to = null;
    this.invoice.seller_commission_type = InvoiceEnum.FIXED;
    this.invoice.seller_price_for_commission = null;
    this.invoice.seller_price_for_commission_applied_to = null;
    this.invoice.buyer_commission_value = null;
    this.invoice.buyer_commission_applied_to = null;
    this.invoice.buyer_commission_type = InvoiceEnum.FIXED;
    this.invoice.buyer_commission_value = null;
    this.invoice.buyer_price_for_commission_applied_to = null;
  }

  toggleDiscountSection(showDiscountSection: boolean): void {
    this.showDiscountSection = showDiscountSection;
    this.invoice.discount_value = null;
    this.finalPrice = null;
  }

  toggleSeparateCommissionSection(showSeparateCommissionSection: boolean): void {
    this.showSeparateCommissionSection = showSeparateCommissionSection;
    this.invoice.separate_commission_for_seller_and_buyer = showSeparateCommissionSection;
    this.resetInvoice();
  }

  onChargeCommissionToChange(): void {
    this.resetInvoice();
    if (
      this.invoice.charge_applicable_to === InvoiceEnum.ONLY_SELLER ||
      this.invoice.charge_applicable_to === InvoiceEnum.ONLY_BUYER
    ) {
      this.toggleSeparateCommissionSection(false);
    }
  }

  calculateDiscount(): void {
    if (!this.invoice.total_price) {
      this.showDiscountSection = false;
      return;
    }

    if (this.invoice.discount_value && this.invoice.discount_type) {
      if (this.invoice.discount_type === InvoiceEnum.FIXED) {
        this.finalPrice = this.invoice.total_price - this.invoice.discount_value;
      } else if (this.invoice.discount_type === InvoiceEnum.PERCENT) {
        this.finalPrice = this.invoice.total_price - (this.invoice.total_price * this.invoice.discount_value) / 100;
      }
    }
  }

  saveInvoice(): void {
    const payload = { ...this.invoice };
    if (payload.invoice_date) {
      payload.invoice_date = DateTimeService.getDateString(payload.invoice_date);
    }

    if (payload.charge_applicable_to === InvoiceEnum.ONLY_SELLER) {
      payload.only_seller_commission = true;
      payload.only_buyer_commission = false;
    } else if (payload.charge_applicable_to === InvoiceEnum.ONLY_BUYER) {
      payload.only_buyer_commission = true;
      payload.only_seller_commission = false;
      this.copySellerCommissionDataToBuyer(payload);
    } else if (
      payload.charge_applicable_to === InvoiceEnum.BOTH_SELLER_AND_BUYER &&
      !this.showSeparateCommissionSection
    ) {
      payload.only_buyer_commission = false;
      payload.only_seller_commission = false;
      this.copySellerCommissionDataToBuyer(payload);
    }

    delete payload.charge_applicable_to;

    if (this.showDiscountSection && !this.invoice.discount_value) {
      this.invoice.discount_value = 0;
    }

    this.invoicesService.createInvoice(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response: any): void => {
      this.invoices.push(response);

      // Close modal.
      this.invoiceModalCloseButton.nativeElement.click();
    },(errors: HttpErrorResponse): void => {
      this.errors = errors.error;
    });
  }


  deleteInvoice(invoiceId: number): void {
    this.invoicesService.deleteInvoice(invoiceId).subscribe((response: void): void => {
      const index = this.invoices.findIndex((invoice: any): boolean => invoice.id === invoiceId);
      this.invoices.splice(index, 1);
    });
  }

  copySellerCommissionDataToBuyer(payload: any): void {
    payload.buyer_commission_value = payload.seller_commission_value;
    payload.buyer_commission_applied_to = payload.seller_commission_applied_to;
    payload.buyer_commission_type = payload.seller_commission_type;
    payload.buyer_price_for_commission = payload.seller_price_for_commission;
    payload.buyer_price_for_commission_applied_to = payload.seller_price_for_commission_applied_to;
  }

  searchInvoices(searchValue: string): void {
    if (searchValue) {
      this.params.search = searchValue;
    } else {
      delete this.params.search;
    }

    if (Object.keys(this.params)?.length) {
      this.filtersApplied = true;
    } else {
      this.filtersApplied = false;
    }
    
    this.fetchInvoices();
  }

  filterInvoices(params: any) {
    for (const key in params) {
      if (params[key]) {
        this.params[key] = params[key];
      } else {
        delete this.params[key];
      }
    }

    if (Object.keys(this.params)?.length) {
      this.filtersApplied = true;
    } else {
      this.filtersApplied = false;
    }

    this.fetchInvoices();
  }

  onInvoiceSelect(invoice: any): void {
    if (invoice.selected) {
      this.selectedInvoices.push(invoice);
    } else if (!invoice.selected) {
      const index = this.selectedInvoices.findIndex((selectedInvoice: any): boolean => {
        return selectedInvoice.id === invoice.id;
      });
      this.selectedInvoices.splice(index, 1);
    }
  }

  initializePartialPaidInvoices(changeSelectedTo: boolean = null): void {
    this.errors = null;
    for (const invoice of this.selectedInvoices) {
      invoice.seller_commission_paid_amount = null;
      invoice.buyer_commission_paid_amount = null;

      if (changeSelectedTo !== null) {
        invoice.selected = changeSelectedTo;
      }
    }
  }

  cancelPartialPayment(): void {
    this.initializePartialPaidInvoices(false);
    this.selectedPaymentStatus = null;
  }

  onPaymentStatusSelected(): void {
    if (this.selectedPaymentStatus === InvoiceEnum.PAID || this.selectedPaymentStatus === InvoiceEnum.UNPAID) {
      // If Paid or Unpaid, just make the payload and call the PATCH method.
      this.updatePaymentStatus();
    } else if (this.selectedPaymentStatus === InvoiceEnum.PARTIAL_PAID) {
      /**
       * If partially paid is selected, ask user to enter partial paid amount for seller commission
       * as well as buyer commission.
       */
      this.invoicePaymentModalButton.nativeElement.click();
    }
  }

  preparePayloadForPaymentStatusChange(): any {
    const payload = [];
    for (const invoice of this.selectedInvoices) {
      const record: Record<string, any> = {
        id: invoice.id,
        payment_status: this.selectedPaymentStatus,
        profile: invoice.profile,
      }

      if (invoice.seller_commission_paid_amount_now) {
        record.seller_commission_paid_amount_now = invoice.seller_commission_paid_amount_now;
      }

      if (invoice.buyer_commission_paid_amount_now) {
        record.buyer_commission_paid_amount_now = invoice.buyer_commission_paid_amount_now;
      }
      payload.push(record);
    }

    return payload
  }

  updatePaymentStatus(): void {
    this.invoicesService.updateInvoicePaymentStatusInBulk(
      this.preparePayloadForPaymentStatusChange()
    ).subscribe((response: any): void => {
      this.selectedInvoices.length = 0;
      this.selectedPaymentStatus= null;
      this.fetchInvoices();
      this.invoicePaymentModalCloseButton.nativeElement.click();
    }, (errors: HttpErrorResponse): void => {
      this.errors = errors.error;
    });
  }

  onSellerScrollToEnd() {
    // For now do nothing.
  }

  onSellerScroll({}: Record<string, number>) {
    // For now do nothing.
  }

  onBuyerScrollToEnd() {
    // For now do nothing.
  }

  onBuyerScroll({}: Record<string, number>) {
    // For now do nothing.
  }
}
