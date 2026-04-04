import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DictionaryItem } from '../../shared/models/shared';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/dictionaries`;

  getCategories() {
    return this.http.get<DictionaryItem[]>(`${this.baseUrl}/categories`);
  }

  getAccounts() {
    return this.http.get<DictionaryItem[]>(`${this.baseUrl}/accounts`);
  }

  getCounterparties() {
    return this.http.get<DictionaryItem[]>(`${this.baseUrl}/counterparties`);
  }
}
