import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileService } from '@app/@shared/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private httpClient: HttpClient, private profileService: ProfileService) {}

  getInvoices(params?: any): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/invoices`, {
      params
    });
  }

  createInvoice(payload: any): Observable<any> {
    // Always add profile in the payload.
    payload.profile = this.profileService.profile?.id;
    return this.httpClient.post(`/profiles/${this.profileService.profile?.id}/invoices`, payload);
  }

  updateInvoicePaymentStatusInBulk(payload: any): Observable<any> {
    return this.httpClient.patch(`/profiles/${this.profileService.profile?.id}/invoices/payment-status`, payload);
  }

  deleteInvoice(invoiceId: number): Observable<void> {
    return this.httpClient.delete<void>(`/profiles/${this.profileService.profile?.id}/invoices/${invoiceId}`);
  }
}
