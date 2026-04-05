import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { AccountView, Currency, AccountType } from '../../../core/models/management';
import { DictionaryItem, PagedResult } from '../../../shared/models/shared';

@Component({
  standalone: false,
  selector: 'app-accounts',
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts implements OnInit {
  // --- DEPENDENCIES ---
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // --- STATE & FILTERS ---
  readonly currencies = signal<Currency[]>([]);
  readonly allAccountsDictionary = signal<DictionaryItem[]>([]);

  readonly pageState = signal<PagedResult<AccountView>>({
    items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 1
  });

  readonly searchQuery = signal('');
  readonly typeFilter = signal('');
  readonly statusFilter = signal('true');

  readonly isModalOpen = signal(false);
  readonly editingAccountId = signal<number | null>(null);

  // --- FORMS ---
  accountForm = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    type: ['Asset' as AccountType, Validators.required],
    currencyId: [null as number | null, Validators.required],
    parentId: [null as number | null],
    isActive: [true]
  });

  // --- COMPUTED STATE ---
  readonly isManager = computed(() => this.authService.currentUser()?.role === 'Financial Manager');

  readonly availableParents = computed(() => {
    const currentId = this.editingAccountId();
    return this.allAccountsDictionary().filter(a => a.id !== currentId);
  });

  // --- LIFECYCLE ---
  ngOnInit() {
    this.loadDependencies();
    this.loadAccounts(1);
  }

  // --- DATA FETCHING ---
  loadDependencies() {
    // TODO: GET /api/currencies
    this.currencies.set([
      { id: 1, code: 'UAH', name: 'Ukrainian Hryvnia' },
      { id: 2, code: 'USD', name: 'US Dollar' }
    ]);

    // TODO: GET /api/accounts/dictionary
    this.allAccountsDictionary.set([
      { id: 1, code: '1010', name: 'Main Bank Account' },
      { id: 2, code: '3110', name: 'Accounts Payable' },
      { id: 3, code: '4000', name: 'Sales Revenue' },
    ]);
  }

  loadAccounts(pageNumber: number) {
    // TODO: GET /api/accounts?page=...&search=...&type=...&isActive=...
    const mockDbResponse: PagedResult<AccountView> = {
      items: [
        { id: 1, code: '1010', name: 'Main Bank Account', type: 'Asset', currencyId: 1, parentId: null, balance: 15000.00, isActive: true },
        { id: 2, code: '3110', name: 'Accounts Payable', type: 'Equity', currencyId: 1, parentId: null, balance: -4500.50, isActive: true }
      ],
      totalCount: 42,
      pageNumber: pageNumber,
      pageSize: this.pageState().pageSize,
      totalPages: Math.ceil(42 / this.pageState().pageSize)
    };

    this.pageState.set(mockDbResponse);
  }

  applyFilters() {
    this.loadAccounts(1);
  }

  // --- USER ACTIONS ---
  openModal(account?: AccountView) {
    if (account) {
      this.editingAccountId.set(account.id);
      this.accountForm.patchValue(account);
    } else {
      this.editingAccountId.set(null);
      this.accountForm.reset({ type: 'Asset', isActive: true });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.accountForm.reset();
  }

  saveAccount() {
    if (this.accountForm.valid) {
      // TODO: POST /api/accounts (if new) OR PUT /api/accounts/{id} (if editing)
      this.closeModal();
    } else {
      this.accountForm.markAllAsTouched();
    }
  }

  toggleStatus(account: AccountView) {
    // TODO: PATCH /api/accounts/{id}/status
    this.pageState.update(state => ({
      ...state,
      items: state.items.map(i => i.id === account.id ? { ...i, isActive: !i.isActive } : i)
    }));
  }
}
