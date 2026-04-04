import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { PagedResult, DictionaryItem } from '../../../shared/models/shared';
import { CategoryView } from '../../../core/models/management';

@Component({
  standalone: false,
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {
  // --- DEPENDENCIES ---
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // --- STATE & FILTERS ---
  readonly allCategoriesDict = signal<DictionaryItem[]>([]);

  readonly pageState = signal<PagedResult<CategoryView>>({
    items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 1
  });

  readonly searchQuery = signal('');
  readonly statusFilter = signal('');

  readonly isModalOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  // --- FORMS ---
  catForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    parentId: [null as number | null],
    isActive: [true]
  });

  // --- COMPUTED STATE ---
  readonly isManager = computed(() => this.authService.currentUser()?.role === 'Financial Manager');

  readonly availableParents = computed(() =>
    this.allCategoriesDict().filter(c => c.id !== this.editingId())
  );

  // --- LIFECYCLE ---
  ngOnInit() {
    this.loadDictionary();
    this.loadCategories(1);
  }

  // --- DATA FETCHING ---
  loadDictionary() {
    // TODO: GET /api/categories/dictionary
    this.allCategoriesDict.set([
      { id: 1, name: 'Operating Expenses' },
      { id: 2, name: 'Revenue' },
      { id: 3, name: 'Office Supplies', parentId: 1 }
    ]);
  }

  loadCategories(pageNumber: number) {
    // TODO: GET /api/categories?page=...&search=...&isActive=...
    const mockRes = {
      items: [
        { id: 1, name: 'Operating Expenses', parentId: null, isActive: true },
        { id: 3, name: 'Office Supplies', parentId: 1, parentName: 'Operating Expenses', isActive: true },
        { id: 2, name: 'Revenue', parentId: null, isActive: true }
      ],
      totalCount: 3, pageNumber, pageSize: 10, totalPages: 1
    };

    this.pageState.set(mockRes);
  }

  applyFilters() {
    this.loadCategories(1);
  }

  // --- USER ACTIONS ---
  openModal(cat?: CategoryView) {
    if (cat) {
      this.editingId.set(cat.id);
      this.catForm.patchValue(cat);
    } else {
      this.editingId.set(null);
      this.catForm.reset({ isActive: true });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save() {
    if (this.catForm.valid) {
      // TODO: POST /api/categories OR PUT /api/categories/{id}
      this.closeModal();
    } else {
      this.catForm.markAllAsTouched();
    }
  }

  toggleStatus(cat: CategoryView) {
    // Business Logic Check: Prevent deactivating parents
    if (cat.isActive) {
      const hasChildren = this.allCategoriesDict().some(c => c.parentId === cat.id);
      if (hasChildren) {
        alert(`Cannot deactivate "${cat.name}" because it is a parent to other categories. Reassign or deactivate the children first.`);
        return;
      }
    }

    // TODO: PATCH /api/categories/{id}/status
    this.pageState.update(state => ({
      ...state,
      items: state.items.map(i => i.id === cat.id ? { ...i, isActive: !i.isActive } : i)
    }));
  }
}
