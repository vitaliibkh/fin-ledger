import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' = 'error') {
    const id = this.nextId++;

    this.toasts.update(currentToasts => [...currentToasts, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}
