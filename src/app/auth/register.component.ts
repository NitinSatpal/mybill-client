import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from './authentication.service';
import { CredentialsService } from './credentials.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { PhoneService } from '@app/@shared/services/phone.service';

const log = new Logger('Register');

@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class RegisterComponent implements OnInit {
  version: string | null = environment.version;
  errors: Record<string, any> | undefined;
  registrationForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private translate: TranslateService,
  ) {
    this.createRegistrationForm();
  }

  ngOnInit() {}

  register(): void {
    this.isLoading = true;
    this.errors = {};
    const payload = this.registrationForm.value;

    if (!PhoneService.checkPhoneNumberValidity(
      payload.phone_number,
      this.errors,
      payload,
      'username',
      [this.translate.instant('Please enter a valid 10 digit mobile number.')]
    )) {
      return;
    }
    
    payload.phone_number = payload.username;
    payload.email = `${payload.phone_number}@mybill.com`;

    const register$ = this.authenticationService.register(payload);
    register$
      .pipe(
        finalize(() => {
          this.registrationForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      ).subscribe(
        (response: { user: any; token: string }) => {
          log.debug(`${response.user.username} successfully registered`);
          this.router.navigate(['/login'], { replaceUrl: true })
        }, (errors: HttpErrorResponse): void => {
          this.errors = errors.error;
        }
      );
  }

  private createRegistrationForm(): void {
    this.registrationForm = this.formBuilder.group({
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: [''],
      username: [''],
      phone_number: ['', Validators.required],
    });
  }
}
