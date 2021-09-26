import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialsService } from '@app/auth';

const credentialsKey = 'profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private selectedProfile: any | null = null;
  private profileSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.selectedProfile);
  // tslint:disable-next-line: member-ordering
  public profile$ = this.profileSubject.asObservable();

  constructor(private httpClient: HttpClient, private credentialsService: CredentialsService) {
    this.checkAndSetActiveProfile();
  }

  checkAndSetActiveProfile(): void {
    const savedProfile = localStorage.getItem(credentialsKey);
    if (savedProfile) {
      this.selectedProfile = JSON.parse(savedProfile);
    } else {
      this.selectedProfile = null;
    }

    this.profileSubject.next(this.selectedProfile);
  }

  /**
   * Gets the selected Profile.
   */
  get profile(): any | null {
    return this.selectedProfile;
  }

  setExtraStorage(extraData: any = {}): void {
    const savedProfile = JSON.parse(localStorage.getItem(credentialsKey));
    for (const key in extraData) {
      if (key) {
        savedProfile[key] = extraData[key];
      }
    }

    localStorage.setItem(credentialsKey, JSON.stringify(savedProfile));
    this.checkAndSetActiveProfile();
  }

  /**
   * Set the profile in storage.
   */
  setProfile(profile: any): void {
    if (profile) {
      localStorage.setItem(credentialsKey, JSON.stringify(profile));
    } else {
      localStorage.removeItem(credentialsKey);
    }
    this.checkAndSetActiveProfile();
  }

  getProfiles(overwrite: boolean = false): Observable<any[]> {
    return this.httpClient.get(`/users/${this.credentialsService.credentials.id}/profiles`).pipe(
      map((response: any[]) => {
        // By default always select 1st profile.
        if (response?.length) {
          // If some profile is already selected, do not overwrite it, unless overwrite flag is tru.
          if (!this.profile?.id || (this.profile?.id && overwrite)) {
            this.setProfile(response[0]);
          }
        } else {
          this.setProfile(null);
        }
        return response;
      })
    );
  }

  getProfile(): Observable<any> {
    return this.httpClient.get(
      `/users/${this.credentialsService.credentials.id}/profiles/${this.profile.id}`
    );
  }

  createProfile(payload: any): Observable<any> {
    return this.httpClient.post(`/users/${this.credentialsService.credentials.id}/profiles`, payload).pipe(
      map((response: any) => {
        // Whenever new profile is created, set it as active profile.
        if (response) {
          this.setProfile(response);
        }
        return response;
      })
    );
  }

  updateProfile(payload: any): Observable<any> {
    return this.httpClient.patch(
      `/users/${this.credentialsService.credentials.id}/profiles/${this.profile.id}`, payload
    );
  }

  getProfileSummary(): Observable<any> {
    if (!this.credentialsService.credentials?.id || !this.profile?.id) {
      return of({});
    }
    return this.httpClient.get(`/users/${this.credentialsService.credentials.id}/profiles/${this.profile.id}/summary`);
  }
}
