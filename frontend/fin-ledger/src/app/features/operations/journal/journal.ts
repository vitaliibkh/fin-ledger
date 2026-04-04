import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { PagedResult, DictionaryItem } from '../../../shared/models/shared';
import { JournalEntryView } from '../../../core/models/operations';

@Component({
  standalone: false,
  selector: 'app-journal',
  templateUrl: './journal.html',
  styleUrl: './journal.scss'
})
export class Journal implements OnInit {
  // --- DEPENDENCIES ---
  private router = inject(Router);
  private authService = inject(AuthService);

  // --- STATE & FILTERS ---
  readonly pageState = signal<PagedResult<JournalEntryView>>({
    items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 1
  });

  readonly startDate = signal('');
  readonly endDate = signal('');
  readonly categoryId = signal('');
  readonly accountId = signal('');
  readonly counterpartyId = signal('');
  readonly statusFilter = signal('');

  // --- DICTIONARIES (For Dropdowns) ---
  readonly categoriesDict = signal<DictionaryItem[]>([]);
  readonly accountsDict = signal<DictionaryItem[]>([]);
  readonly counterpartiesDict = signal<DictionaryItem[]>([]);

  // --- COMPUTED STATE ---
  readonly isOperator = computed(() => this.authService.currentUser()?.role === 'Operator');

  readonly canEditStatus = computed(() => {
    const role = this.authService.currentUser()?.role;
    return role === 'Operator' || role === 'Financial Manager';
  });

  // --- LIFECYCLE ---
  ngOnInit() {
    this.loadDictionaries();
    this.loadEntries(1);
  }

  // --- DATA FETCHING ---
  loadDictionaries() {
    // TODO: GET /api/categories/dictionary
    this.categoriesDict.set([
      { id: 1, name: 'Office Supplies' },
      { id: 2, name: 'Software Licenses' }
    ]);

    // TODO: GET /api/accounts/dictionary
    this.accountsDict.set([
      { id: 1, code: '1010', name: 'Main Bank' },
      { id: 2, code: '3110', name: 'Accounts Payable' }
    ]);

    // TODO: GET /api/counterparties/dictionary
    this.counterpartiesDict.set([
      { id: 1, name: 'TechCorp LLC' },
      { id: 2, name: 'OfficeMax' }
    ]);
  }

  loadEntries(pageNumber: number) {
    // TODO: GET /api/journal?page=...&startDate=...&endDate=...&categoryId=...&accountId=...&counterpartyId=...&status=...
    const mockRes: PagedResult<JournalEntryView> = {
      items: [
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
      ],
      totalCount: 2,
      pageNumber: pageNumber,
      pageSize: this.pageState().pageSize,
      totalPages: 1
    };

    this.pageState.set(mockRes);
  }

  // --- USER ACTIONS ---
  applyFilters() {
    this.loadEntries(1);
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

    // TODO: PATCH /api/journal/{entry.id}/status
    this.pageState.update(state => ({
      ...state,
      items: state.items.map(e => e.id === entry.id ? { ...e, status: newStatus } : e)
    }));
  }
}
