import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CredentialsService } from './credentials.service';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient
  ) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(payload: LoginContext): Observable<any> {
    return this.httpClient.post(`/auth/login/`, payload).pipe(
      map((response: any): any => {
        // Always clear profile on login.
        console.log('i am here');
        localStorage.getItem('profile');
        localStorage.removeItem('profile');

        this.credentialsService.setCredentials(
          {
            username: response.user.username,
            token: response.token,
            id: response.user.pk,
          },
          payload.remember
        );
        return response;
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  /**
   * Register the user.
   */
  register(payload: any): Observable<any> {
    return this.httpClient.post(`/auth/signup/`, payload);
  }
}
