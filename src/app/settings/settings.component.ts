import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { SettingsService } from './settings.service';
import { ConfigService } from '@app/@shared/services/config.service';
import { SettingTab } from '@app/@shared/enums/setting-tab.enum';
import { SettingAction } from '@app/@shared/enums/setting-action.enum';
import { ProfileService } from '@app/@shared/services/profile.service';
import { InvoiceEnum } from '@app/@shared/enums/invoice.enum';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  readonly settingTab: typeof SettingTab = SettingTab;
  readonly settingAction: typeof SettingAction = SettingAction;
  readonly invoiceEnum: typeof InvoiceEnum = InvoiceEnum;

  readonly businessProfileOptions: Record<string, string>[] = [
    { name: SettingAction.UPDATE_ADDRESS, id: SettingAction.UPDATE_ADDRESS },
    { name: SettingAction.ADD_COMMON_COMMISSION, id: SettingAction.ADD_COMMON_COMMISSION },
  ];

  selectedTab: SettingTab = SettingTab.ACCOUNT;
  selectedAction: string;

  profileSettings: any;

  profile: any = {
    address: {}
  };
  showSeparateCommissionSection = false;
  priceCommissionAndDiscountApplicability: any[] = [];
  commissionAndDiscountType: any[] = [];

  commissionApplicability: any[] = [
    { enum_name: 'Both Seller and Buyer', enum_id: InvoiceEnum.BOTH_SELLER_AND_BUYER },
    { enum_name: 'Only to Seller', enum_id: InvoiceEnum.ONLY_SELLER },
    { enum_name: 'Only to Buyer', enum_id: InvoiceEnum.ONLY_BUYER },
  ];

  success = false;
  errors: any;

  constructor(private settingsService: SettingsService,
              private profileService: ProfileService,
              private configService: ConfigService) {}

  ngOnInit() {
    this.fetchProfile();
    this.fetchProfileSettings();
    console.log(this.profile);

    this.configService.getConfigs().subscribe((response: any): void => {
      this.priceCommissionAndDiscountApplicability = response.PriceCommissionAndDiscountApplicability;
      this.commissionAndDiscountType = response.CommissionAndDiscountType;
    });
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe((response: any): void => {
      if (!response.address) {
        response.address = {};
      }
      this.profile = response;
    });
  }

  fetchProfileSettings(): void {
    this.settingsService.getProfileSettings().subscribe((response: any): void => {
      this.profileSettings = { ...response };
      
      this.decideChargeApplicableTo();
    });
  }


  decideChargeApplicableTo(): void {
    if (this.profileSettings.only_seller_commission) {
      this.profileSettings.charge_applicable_to = InvoiceEnum.ONLY_SELLER;
    } else if (this.profileSettings.only_buyer_commission) {
      this.profileSettings.charge_applicable_to = InvoiceEnum.ONLY_BUYER;
    } else {
      this.profileSettings.charge_applicable_to = InvoiceEnum.BOTH_SELLER_AND_BUYER;
    }

    this.showSeparateCommissionSection = this.profileSettings.separate_commission_for_seller_and_buyer;
  }

  selectSettingTab(tab: SettingTab): void {
    this.selectedTab = tab;
    this.success = false;
    this.selectedAction = null;
  }

  onActionSelect(): void {
    this.success = false;
  }

  saveProfileAddress(): void {
    this.profileService.updateProfile(this.profile).subscribe((response: any): void => {
      this.success = true;
    });
  }

  resetProfileSettings(): any {
    this.profileSettings.seller_commission_value = null;
    this.profileSettings.seller_commission_applied_to = null;
    this.profileSettings.seller_commission_type = InvoiceEnum.FIXED;
    this.profileSettings.seller_price_for_commission = null;
    this.profileSettings.seller_price_for_commission_applied_to = null;
    this.profileSettings.buyer_commission_value = null;
    this.profileSettings.buyer_commission_applied_to = null;
    this.profileSettings.buyer_commission_type = InvoiceEnum.FIXED;
    this.profileSettings.buyer_commission_value = null;
    this.profileSettings.buyer_price_for_commission_applied_to = null;
  }

  toggleSeparateCommissionSection(showSeparateCommissionSection: boolean): void {
    this.showSeparateCommissionSection = showSeparateCommissionSection;
    this.profileSettings.separate_commission_for_seller_and_buyer = showSeparateCommissionSection;
    this.resetProfileSettings();
  }

  onChargeCommissionToChange(): void {
    this.resetProfileSettings();
    if (
      this.profileSettings.charge_applicable_to === InvoiceEnum.ONLY_SELLER ||
      this.profileSettings.charge_applicable_to === InvoiceEnum.ONLY_BUYER
    ) {
      this.toggleSeparateCommissionSection(false);
    }
  }

  onPerInvoiceCommissionFlagChange(): void {
    if (this.profileSettings.set_commission_per_invoice) {
      this.resetProfileSettings();
    }
  }

  saveProfileCommission(): void {
    this.errors = {};
    const payload = { ...this.profileSettings };

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

    this.settingsService.updateSettings(this.profileSettings.id, payload).subscribe((response: any): void => {
      this.success = true;
      this.profileSettings = { ...response };
      this.decideChargeApplicableTo();
    },(errors: HttpErrorResponse): void => {
      this.errors = errors.error;
    });
  }

  copySellerCommissionDataToBuyer(payload: any): void {
    payload.buyer_commission_value = payload.seller_commission_value;
    payload.buyer_commission_applied_to = payload.seller_commission_applied_to;
    payload.buyer_commission_type = payload.seller_commission_type;
    payload.buyer_price_for_commission = payload.seller_price_for_commission;
    payload.buyer_price_for_commission_applied_to = payload.seller_price_for_commission_applied_to;
  }
}
