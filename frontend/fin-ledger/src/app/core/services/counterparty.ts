import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../shared/models/shared';
import { CounterpartyView } from '../models/management';

@Injectable({
  providedIn: 'root'
})
export class CounterpartyService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/counterparties`;

  getCounterparties(pageNumber: number, pageSize: number, search: string, isActive: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) params = params.set('search', search);
    if (isActive) params = params.set('isActive', isActive);

    return this.http.get<PagedResult<CounterpartyView>>(this.baseUrl, { params });
  }

  createCounterparty(data: any) {
    return this.http.post<CounterpartyView>(this.baseUrl, data);
  }

  updateCounterparty(id: number, data: any) {
    return this.http.put<CounterpartyView>(`${this.baseUrl}/${id}`, data);
  }

  toggleStatus(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/status`, {});
  }
}
