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

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  errors: Record<string, any> | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private translate: TranslateService,
  ) {
    this.createLoginForm();
  }

  ngOnInit() {}

  login(): void {
    this.isLoading = true;
    this.errors = {};
    if (String(this.loginForm.get('username').value).length !== 10) {
      this.errors.username = [
        this.translate.instant('Please enter a valid 10 digit mobile number.')
      ]
      this.isLoading = false;
      return;
    }

    const payload = this.loginForm.value;
    payload.username = `+91${payload.username}`
    const login$ = this.authenticationService.login(payload);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (response: { user: any; token: string }) => {
          this.router.navigate(['/home']);
        },
        (errors: HttpErrorResponse) => {
          this.errors = errors.error;
        }
      );
  }

  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
