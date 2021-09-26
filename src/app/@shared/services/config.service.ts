import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialsService } from '@app/auth';

const credentialsKey = 'profile';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private allEnums: any | null = null;

  constructor(private httpClient: HttpClient, private credentialsService: CredentialsService) {}

  getConfigs(): Observable<any> {
    if (!this.allEnums) {
      return this.httpClient.get(`/users/${this.credentialsService.credentials.id}/enums`).pipe(
        map((response: { enum_name: string; enum_id: number }[]) => {
          this.allEnums = { ...response };
          console.log(response);

          return response;
        })
      );
    }

    return of(this.allEnums);
  }
}
