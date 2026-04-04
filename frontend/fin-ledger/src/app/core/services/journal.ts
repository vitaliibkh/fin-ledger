import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../shared/models/shared';
import { JournalEntryView } from '../../core/models/operations';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/journal`;

  getEntries(pageNumber: number, pageSize: number, filters: any) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.accountId) params = params.set('accountId', filters.accountId);
    if (filters.counterpartyId) params = params.set('counterpartyId', filters.counterpartyId);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<PagedResult<JournalEntryView>>(this.baseUrl, { params });
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.baseUrl}/${id}/status`, { status });
  }
}
