import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly currentToast = signal<Toast | null>(null);

  show(message: string, type: 'success' | 'error' = 'error') {
    this.currentToast.set({ message, type });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.currentToast.set(null);
  }
}
