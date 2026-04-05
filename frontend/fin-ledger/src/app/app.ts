import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth';
import { ToastService } from './core/services/toast';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthService);
  toastService = inject(ToastService);

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'monitoring', route: '/analytics/dashboard', roles: ['Analyst'] },
    { label: 'Journal', icon: 'receipt_long', route: '/operations/journal', roles: ['Operator', 'Financial Manager', 'Analyst'] },
    { label: 'Accounts', icon: 'account_balance_wallet', route: '/management/accounts', roles: ['Operator', 'Financial Manager', 'Analyst'] },
    { label: 'Counterparties', icon: 'groups', route: '/management/counterparties', roles: ['Operator', 'Financial Manager', 'Analyst'] },
    { label: 'Categories', icon: 'category', route: '/management/categories', roles: ['Financial Manager'] },
    { label: 'System Data', icon: 'database', route: '/management/system', roles: ['Financial Manager'] }
  ];

  readonly visibleNavItems = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];

    return this.allNavItems.filter(item => item.roles.includes(user.role));
  });
}
