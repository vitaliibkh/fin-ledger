import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';

import { Accounts } from './accounts/accounts';
import { Counterparties } from './counterparties/counterparties';
import { Categories } from './categories/categories';
import { SharedModule } from '../../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Accounts,
    Counterparties,
    Categories,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'accounts', component: Accounts },
      { path: 'counterparties', component: Counterparties },
      {
        path: 'categories',
        component: Categories,
        canActivate: [roleGuard],
        data: { roles: ['Financial Manager'] }
      },
      { path: '', redirectTo: 'accounts', pathMatch: 'full' }
    ])
  ]
})
export class ManagementModule { }
