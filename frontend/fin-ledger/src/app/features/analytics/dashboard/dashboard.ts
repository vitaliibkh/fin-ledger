import { Component, OnInit, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netCashFlow: number;
}

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // --- STATE ---
  readonly metrics = signal<DashboardMetrics | null>(null);

  // Report Form State
  reportType = 'ledger';
  reportStartDate = '';
  reportEndDate = '';

  // --- CHART CONFIGURATION ---
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      { data: [6500, 5900, 8000, 8100, 5600, 9500], label: 'Income', backgroundColor: '#a7f3d0' },
      { data: [2800, 4800, 4000, 1900, 8600, 2700], label: 'Expenses', backgroundColor: '#fb7185' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#f8fafc',
    scales: {
      x: { grid: { color: '#242f41' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#242f41' }, ticks: { color: '#94a3b8' } }
    },
    plugins: {
      legend: { labels: { color: '#f8fafc' } }
    }
  };

  ngOnInit() {
    this.loadMetrics();
  }

  loadMetrics() {
    // TODO: GET /api/analytics/summary
    this.metrics.set({
      totalRevenue: 43600.00,
      totalExpenses: 24800.00,
      netCashFlow: 18800.00
    });
  }

  // --- CSV REPORT GENERATION ---
  generateReport() {
    console.log(`Generating ${this.reportType} from ${this.reportStartDate} to ${this.reportEndDate}...`);

    const mockLedgerData = [
      { Date: '2026-04-01', Account: 'Main Bank', Category: 'Software', Amount: -1500.00 },
      { Date: '2026-04-02', Account: 'Main Bank', Category: 'Consulting', Amount: 5000.00 }
    ];

    const mockCategoryData = [
      { Category: 'Software', TotalExpense: 1500.00 },
      { Category: 'Office Supplies', TotalExpense: 450.50 }
    ];

    const dataToExport = this.reportType === 'ledger' ? mockLedgerData : mockCategoryData;
    const filename = `${this.reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;

    this.downloadCSV(dataToExport, filename);
  }

  /**
   * Universal function to convert any array of objects into a downloaded CSV file.
   */
  private downloadCSV(data: any[], filename: string) {
    if (!data || !data.length) return;

    const separator = ',';
    const keys = Object.keys(data[0]);

    const csvContent =
      keys.join(separator) +
      '\n' +
      data.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          // Escape quotes and commas
          cell = cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
