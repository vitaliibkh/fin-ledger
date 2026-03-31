import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole, User } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class Auth {
  private router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  /**
   * TODO: Implement HTTP POST to ASP.NET /api/login
   * Backend will check credentials and return User + JWT
   */
  async login(username: string, password: string): Promise<void> {
    const mockUser: User = { id: 1, username, role: 'Operator' };

    localStorage.setItem('token', 'fake-jwt-token');

    this.currentUser.set(mockUser);
    this.redirectByRole(mockUser.role);
  }

  private redirectByRole(role: UserRole) {
    const routes: Record<UserRole, string> = {
      'Operator': '/operations',
      'Financial Manager': '/management',
      'Analyst': '/analytics'
    };

    this.router.navigate([routes[role]]);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }
}
