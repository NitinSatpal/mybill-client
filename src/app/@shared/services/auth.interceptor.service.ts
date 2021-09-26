import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/auth';
import { Router } from '@angular/router';

/**
 * Authentication Interceptor
 *
 * Add the authentication headers when making an API call and user is authenticated.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.credentialsService?.credentials?.token;
    if (token) {
      return next.handle(this.addToken(request, this.credentialsService.credentials.token));
    } else {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse): Observable<any> => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return next.handle(this.addToken(request, this.credentialsService.credentials.token));
          } else {
            return throwError(error);
          }
        })
      );
    }
  }

  /**
   * Add authentication token to the Http Headers.
   * @param request Current request.
   * @param token Token string.
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `JWT ${token}`,
      },
    });
  }
}
