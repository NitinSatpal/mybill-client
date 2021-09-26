import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileService } from '@app/@shared/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient, private profileService: ProfileService) {}

  getProducts(params?: any): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/products`, {
      params
    });
  }

  createProduct(payload: any): Observable<any> {
    // Always add profile in the payload.
    payload.profile = this.profileService.profile?.id;
    return this.httpClient.post(`/profiles/${this.profileService.profile?.id}/products`, payload);
  }

  getProductsMinimal(): Observable<any> {
    return this.httpClient.get(`/profiles/${this.profileService.profile?.id}/products/minimal`);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`/profiles/${this.profileService.profile?.id}/products/${productId}`);
  }
}
