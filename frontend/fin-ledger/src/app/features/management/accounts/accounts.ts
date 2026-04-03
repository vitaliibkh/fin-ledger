import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { AccountView, Currency, AccountType } from '../../../core/models/management';
import { DictionaryItem, PagedResult } from '../../../shared/models/shared';

@Component({
  standalone: false,
  selector: 'app-accounts',
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts implements OnInit {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);

  readonly isManager = computed(() => this.authService.currentUser()?.role === 'Financial Manager');

  readonly currencies = signal<Currency[]>([]);
  readonly isModalOpen = signal(false);
  readonly editingAccountId = signal<number | null>(null);

  readonly allAccountsDictionary = signal<DictionaryItem[]>([]);

  readonly pageState = signal<PagedResult<AccountView>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1
  });

  accountForm = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    type: ['Active' as AccountType, Validators.required],
    currencyId: [null as number | null, Validators.required],
    parentId: [null as number | null],
    isActive: [true]
  });

  readonly availableParents = computed(() => {
    const currentId = this.editingAccountId();
    return this.allAccountsDictionary().filter(a => a.id !== currentId);
  });

  ngOnInit() {
    this.loadDependencies();
    this.loadAccounts(1);
  }

  loadDependencies() {
    this.currencies.set([
      { id: 1, code: 'UAH', name: 'Ukrainian Hryvnia' },
      { id: 2, code: 'USD', name: 'US Dollar' }
    ]);

    console.log('Fetching lightweight Account Dictionary for dropdowns...');
    // TODO: this.http.get<DictionaryItem[]>('/api/accounts/dictionary')
    this.allAccountsDictionary.set([
      { id: 1, code: '1010', name: 'Main Bank Account' },
      { id: 2, code: '3110', name: 'Accounts Payable' },
      { id: 3, code: '4000', name: 'Sales Revenue' },
    ]);
  }

  loadAccounts(pageNumber: number) {
    console.log(`Fetching Accounts from ASP.NET API - Page: ${pageNumber}`);

    const mockDbResponse: PagedResult<AccountView> = {
      items: [
        { id: 1, code: '1010', name: 'Main Bank Account', type: 'Active', currencyId: 1, parentId: null, balance: 15000.00, isActive: true },
        { id: 2, code: '3110', name: 'Accounts Payable', type: 'Passive', currencyId: 1, parentId: null, balance: -4500.50, isActive: true }
      ],
      totalCount: 42,
      pageNumber: pageNumber,
      pageSize: this.pageState().pageSize,
      totalPages: Math.ceil(42 / this.pageState().pageSize)
    };

    this.pageState.set(mockDbResponse);
  }

  openModal(account?: AccountView) {
    if (account) {
      this.editingAccountId.set(account.id);
      this.accountForm.patchValue({
        code: account.code,
        name: account.name,
        type: account.type,
        currencyId: account.currencyId,
        parentId: account.parentId,
        isActive: account.isActive
      });
    } else {
      this.editingAccountId.set(null);
      this.accountForm.reset({ type: 'Active', isActive: true });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.accountForm.reset();
  }

  saveAccount() {
    if (this.accountForm.valid) {
      const formData = this.accountForm.value;
      console.log('Submitting to ASP.NET:', formData);
      // TODO: POST /api/accounts or PUT /api/accounts/{id}
      this.closeModal();
    } else {
      this.accountForm.markAllAsTouched();
    }
  }

  toggleStatus(account: AccountView) {
    // TODO: PATCH /api/accounts/{id}/status
    this.pageState().items.find(acc => acc.id === account.id)!.isActive = !account.isActive;
  }
}
