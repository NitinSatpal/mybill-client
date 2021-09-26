import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  static readonly addressFields: string[] = ['address_line_1', 'address_line_2', 'city', 'postal_code'];

  static getAddressObject(instanceObject: any, deleteFromObject: boolean = true): any {
    const address: Record<string, any> = {};

    for (const key in instanceObject) {
      if (AddressService.addressFields.indexOf(key) > -1) {
        address[key] = instanceObject[key];

        if (deleteFromObject) {
          delete instanceObject[key];
        }
      }
    }

    return address;
  }
}
