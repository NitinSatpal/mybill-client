import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProfileService } from '@app/@shared/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class BuyersService {
  constructor(private httpClient: HttpClient, private profileService: ProfileService) {}

  getSellers(params?: any): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/buyers`, {
      params
    });
  }

  createSeller(payload: any): Observable<any> {
    return this.httpClient.post(`/profiles/${this.profileService.profile?.id}/buyers`, payload);
  }

  getBuyersMinimal(): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/buyers/minimal`);
  }

  deleteBuyer(buyerId: number): Observable<void> {
    return this.httpClient.delete<void>(`/profiles/${this.profileService.profile?.id}/buyers/${buyerId}`);
  }
}
