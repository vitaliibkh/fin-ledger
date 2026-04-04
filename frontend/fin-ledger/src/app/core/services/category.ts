import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../shared/models/shared';
import { CategoryView } from '../models/management';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/categories`;

  getCategories(pageNumber: number, pageSize: number, search: string, isActive: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) params = params.set('search', search);
    if (isActive) params = params.set('isActive', isActive);

    return this.http.get<PagedResult<CategoryView>>(this.baseUrl, { params });
  }

  createCategory(data: any) {
    return this.http.post<CategoryView>(this.baseUrl, data);
  }

  updateCategory(id: number, data: any) {
    return this.http.put<CategoryView>(`${this.baseUrl}/${id}`, data);
  }

  toggleStatus(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/status`, {});
  }
}
