import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemDataService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/system`;

  importData(entityType: 'accounts' | 'categories' | 'currencies' | 'rates', file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/import/${entityType}`, formData);
  }

  generateData(journalCount: number, counterpartyCount: number) {
    return this.http.post(`${this.baseUrl}/generate`, {
      journalCount,
      counterpartyCount
    });
  }

  cleanDatabase() {
    return this.http.delete(`${this.baseUrl}/clean`);
  }
}
