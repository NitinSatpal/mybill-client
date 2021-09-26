import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileType } from '@app/@shared/enums/profile-type.enum';
import { ProfileService } from '@app/@shared/services/profile.service';
import { ConfigService } from '@app/@shared/services/config.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading = true;
  profiles: any[];
  user: any;
  profileSummary: any = {};

  // Expose enums to template.
  profileType: typeof ProfileType = ProfileType;

  newProfile: any = {};

  errors: any = {};

  businessProfile = true;
  personalProfile = false;
  selectedProfileId: any;

  @ViewChild('profileCreationCloseButton', { read: ElementRef, static: false }) profileCreationCloseButton: ElementRef;

  constructor(private configService: ConfigService, private profileService: ProfileService) {}

  ngOnInit(): void {
    // Get all the profiles of the logged in user.
    this.getProfiles();

    this.configService.getConfigs().subscribe();
  }

  getProfiles(forceFetch: boolean = false): void {
    this.isLoading = true;

    this.profileService.getProfiles().subscribe((response: any): void => {
      this.profiles = [...response];
      this.selectedProfileId = this.profileService.profile?.id;
      // Fetch summary from here since at this point the active profile is set.
      this.getProfileSummary();
      this.isLoading = false;
    }, (errors: HttpErrorResponse): void => {
      this.errors = errors.error;
      this.isLoading = false;
    });
  }

  getProfileSummary(): void {
    this.profileService.getProfileSummary().subscribe((response: any): void => {
      this.profileSummary = { ...response };
    });
  }

  /**
   * Load Selected Profile.
   */
  loadSelectedProfile(): void {
    const selectedProfile = this.profiles.find((profile: any): boolean => profile.id === this.selectedProfileId)
    this.profileService.setProfile(selectedProfile);
    this.getProfileSummary();
  }

  createProfile(): void {
    this.isLoading = true;
    if (!this.newProfile.profile_type) {
      if (this.businessProfile) {
        this.newProfile.profile_type = ProfileType.BUSINESS;
      } else {
        this.newProfile.profile_type = ProfileType.PERSONAL;
      }
    }
    this.profileService.createProfile(this.newProfile).subscribe(
      (response: any): void => {
        this.profiles.push(response);
        this.isLoading = false;
        this.getProfileSummary();

        // Close modal.
        this.profileCreationCloseButton.nativeElement.click();
      },
      (errors: HttpErrorResponse): void => {
        this.isLoading = false;
        this.errors = errors.error;
      }
    );
  }
}
