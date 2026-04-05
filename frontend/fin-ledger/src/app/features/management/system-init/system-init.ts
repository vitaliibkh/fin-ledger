import { Component, inject, signal } from '@angular/core';
import { SystemDataService } from '../../../core/services/system-data';
import { ToastService } from '../../../core/services/toast';

@Component({
  standalone: false,
  selector: 'app-system-init',
  templateUrl: './system-init.html',
  styleUrl: './system-init.scss'
})
export class SystemInit {
  // --- DEPENDENCIES ---
  private systemService = inject(SystemDataService);
  private toastService = inject(ToastService);

  // --- STATE ---
  readonly journalCount = signal<number>(2000);
  readonly counterpartyCount = signal<number>(50);

  readonly isUploading = signal<Record<string, boolean>>({});
  readonly isGenerating = signal(false);
  readonly isCleaning = signal(false);

  private selectedFiles: Record<string, File | null> = {
    accounts: null,
    categories: null,
    currencies: null,
    rates: null
  };

  // --- METHODS ---

  onFileSelected(event: Event, type: 'accounts' | 'categories' | 'currencies' | 'rates') {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFiles[type] = element.files[0];
    } else {
      this.selectedFiles[type] = null;
    }
  }

  uploadFile(type: 'accounts' | 'categories' | 'currencies' | 'rates') {
    const file = this.selectedFiles[type];
    if (!file) {
      this.toastService.show(`Please select a file for ${type} first.`, 'error');
      return;
    }

    this.isUploading.update(state => ({ ...state, [type]: true }));

    this.systemService.importData(type, file).subscribe({
      next: () => {
        this.toastService.show(`Successfully imported ${type}.`, 'success');
        this.isUploading.update(state => ({ ...state, [type]: false }));
      },
      error: () => {
        this.isUploading.update(state => ({ ...state, [type]: false }));
      }
    });
  }

  generateData() {
    if (!confirm('Are you sure? This will generate thousands of records. Ensure dictionaries are imported first.')) return;

    this.isGenerating.set(true);

    this.systemService.generateData(this.journalCount(), this.counterpartyCount()).subscribe({
      next: () => {
        this.toastService.show('Test data generated successfully!', 'success');
        this.isGenerating.set(false);
      },
      error: () => this.isGenerating.set(false)
    });
  }

  cleanDatabase() {
    const code = prompt('DANGER: Type "DELETE" to confirm complete database wipe.');
    if (code !== 'DELETE') {
      this.toastService.show('Confirmation failed. Wipe aborted.', 'error');
      return;
    }

    this.isCleaning.set(true);

    this.systemService.cleanDatabase().subscribe({
      next: () => {
        this.toastService.show('Database successfully cleaned.', 'success');
        this.isCleaning.set(false);
      },
      error: () => this.isCleaning.set(false)
    });
  }
}
