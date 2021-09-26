import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProfileService } from '@app/@shared/services/profile.service';
import { CredentialsService } from '@app/auth';

@Injectable({
  providedIn: 'root',
})
export class SellersService {
  constructor(private httpClient: HttpClient, private profileService: ProfileService) {}

  getSellers(params?: any): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/sellers`, {
      params
    });
  }

  createSeller(payload: any): Observable<any> {
    // Always add profile in the payload.
    payload.profile = this.profileService.profile?.id;
    return this.httpClient.post(`/profiles/${this.profileService.profile?.id}/sellers`, payload);
  }

  getSellersMinimal(): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/sellers/minimal`);
  }

  deleteSeller(sellerId: number): Observable<void> {
    return this.httpClient.delete<void>(`/profiles/${this.profileService.profile?.id}/sellers/${sellerId}`);
  }
}
