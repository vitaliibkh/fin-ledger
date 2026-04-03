import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

export interface JournalEntryView {
  id: number;
  date: string;
  amount: number;
  debitAccountCode: string;
  creditAccountCode: string;
  categoryName: string;
  counterpartyName?: string;
  status: string;
  comment?: string;
}

@Component({
  standalone: false,
  selector: 'app-journal',
  templateUrl: './journal.html',
  styleUrl: './journal.scss'
})
export class Journal implements OnInit {
  private router = inject(Router);
  private authService = inject(Auth);

  readonly entries = signal<JournalEntryView[]>([]);
  readonly isOperator = computed(() => this.authService.currentUser()?.role === 'Operator');
  readonly canEditStatus = computed(() => {
    const role = this.authService.currentUser()?.role;
    return role === 'Operator' || role === 'Financial Manager';
  });

  ngOnInit() {
    this.loadEntries();
  }

  /**
   * TODO: Implement HTTP GET request to ASP.NET API.
   * e.g., this.http.get<JournalEntryView[]>('/api/journal?startDate=...&endDate=...')
   */
  loadEntries() {
    this.entries.set([
      {
        id: 1,
        date: new Date().toISOString(),
        amount: 1500.00,
        debitAccountCode: '1010',
        creditAccountCode: '3110',
        categoryName: 'Software Licenses',
        counterpartyName: 'TechCorp LLC',
        status: 'Completed',
        comment: 'Annual subscription'
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(),
        amount: 450.50,
        debitAccountCode: '1010',
        creditAccountCode: '6010',
        categoryName: 'Office Supplies',
        status: 'Pending'
      }
    ]);
  }

  openAddModal() {
    this.router.navigate(['/operations/journal/new']);
  }

  updateStatus(entry: JournalEntryView, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    if (newStatus === 'Reversed') {
      selectElement.value = entry.status;

      this.router.navigate(['/operations/journal/new'], {
        queryParams: { reverseOf: entry.id }
      });

      return;
    }

    console.log(`Updating entry ${entry.id} to status: ${newStatus}`);
    // TODO: Call API to patch status
    this.entries.update(entries =>
      entries.map(e => e.id === entry.id ? { ...e, status: newStatus } : e)
    );
  }
}
