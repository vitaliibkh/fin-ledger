import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  netCashFlow: number;
}

export interface ChartDataPoint {
  label: string;
  income: number;
  expense: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/analytics`;

  getDashboardSummary() {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getChartData(months: number = 6) {
    return this.http.get<ChartDataPoint[]>(`${this.baseUrl}/chart?months=${months}`);
  }
}
