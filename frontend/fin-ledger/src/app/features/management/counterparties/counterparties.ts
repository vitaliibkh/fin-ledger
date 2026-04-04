import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { PagedResult } from '../../../shared/models/shared';
import { CounterpartyView } from '../../../core/models/management';

@Component({
  standalone: false,
  selector: 'app-counterparties',
  templateUrl: './counterparties.html',
  styleUrl: './counterparties.scss'
})
export class Counterparties implements OnInit {
  // --- DEPENDENCIES ---
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // --- STATE & FILTERS ---
  readonly pageState = signal<PagedResult<CounterpartyView>>({
    items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 1
  });

  readonly searchQuery = signal('');
  readonly statusFilter = signal('true');

  readonly isModalOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  // --- FORMS ---
  cpForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    taxCode: ['', [Validators.maxLength(20)]],
    contactInfo: ['', [Validators.maxLength(255)]],
    isActive: [true]
  });

  // --- COMPUTED STATE ---
  readonly isManager = computed(() => this.authService.currentUser()?.role === 'Financial Manager');

  // --- LIFECYCLE ---
  ngOnInit() {
    this.loadCounterparties(1);
  }

  // --- DATA FETCHING ---
  loadCounterparties(pageNumber: number) {
    // TODO: GET /api/counterparties?page=...&search=...&isActive=...
    const mockRes: PagedResult<CounterpartyView> = {
      items: [
        { id: 1, name: 'TechCorp LLC', taxCode: '12345678', contactInfo: 'billing@techcorp.com', isActive: true },
        { id: 2, name: 'OfficeMax', taxCode: null, contactInfo: '+380501234567', isActive: true }
      ],
      totalCount: 15, pageNumber, pageSize: this.pageState().pageSize, totalPages: 2
    };

    this.pageState.set(mockRes);
  }

  applyFilters() {
    this.loadCounterparties(1);
  }

  // --- USER ACTIONS ---
  openModal(cp?: CounterpartyView) {
    if (cp) {
      this.editingId.set(cp.id);
      this.cpForm.patchValue(cp);
    } else {
      this.editingId.set(null);
      this.cpForm.reset({ isActive: true });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save() {
    if (this.cpForm.valid) {
      // TODO: POST /api/counterparties OR PUT /api/counterparties/{id}
      this.closeModal();
    } else {
      this.cpForm.markAllAsTouched();
    }
  }

  toggleStatus(cp: CounterpartyView) {
    // TODO: PATCH /api/counterparties/{id}/status
    this.pageState.update(state => ({
      ...state,
      items: state.items.map(i => i.id === cp.id ? { ...i, isActive: !i.isActive } : i)
    }));
  }
}
