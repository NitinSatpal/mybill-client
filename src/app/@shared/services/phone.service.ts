import { Injectable } from '@angular/core';
import { Country } from '@shared/enums/country.enum';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  static readonly defaultCountry = Country.India;
  static readonly countryDialCodes: { [propName: string]: { diallingCode: string, length: number } } = {
    India: { diallingCode: '+91', length: 10 }
  }

  static checkPhoneNumberValidity(
    phoneNumber: string,
    errors: any,
    data: any,
    key: string,
    error: string | string[],
    country: Country = Country.India,
  ): boolean {
    if (!phoneNumber) {
      errors[key] = error;
      return false;
    }
    
    if (String(phoneNumber)?.length !== PhoneService.countryDialCodes[country].length) {
      errors[key] = error;
      return false;
    }

    delete errors[key];
    data[key] = `${PhoneService.countryDialCodes[country].diallingCode}${phoneNumber}`;
    return true;
  }
}
