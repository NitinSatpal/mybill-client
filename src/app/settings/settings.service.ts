import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileService } from '@app/@shared/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private httpClient: HttpClient, private profileService: ProfileService) {}

  updateSettings(settingId: number, payload: any): Observable<any> {
    return this.httpClient.patch(`/profiles/${this.profileService.profile?.id}/profile-settings/${settingId}`, payload);
  }

  getProfileSettings(): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/profile-settings`);
  }
}
