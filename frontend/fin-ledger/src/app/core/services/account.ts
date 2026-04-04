import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../shared/models/shared';
import { AccountView } from '../models/management';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/accounts`;

  getAccounts(pageNumber: number, pageSize: number, search: string, type: string, isActive: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) params = params.set('search', search);
    if (type) params = params.set('type', type);
    if (isActive) params = params.set('isActive', isActive);

    return this.http.get<PagedResult<AccountView>>(this.baseUrl, { params });
  }

  createAccount(data: any) {
    return this.http.post<AccountView>(this.baseUrl, data);
  }

  updateAccount(id: number, data: any) {
    return this.http.put<AccountView>(`${this.baseUrl}/${id}`, data);
  }

  toggleStatus(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/status`, {});
  }
}
