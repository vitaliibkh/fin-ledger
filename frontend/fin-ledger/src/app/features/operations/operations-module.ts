import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { Journal } from './journal/journal';
import { JournalForm } from './journal-form/journal-form';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    Journal,
    JournalForm
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'journal', component: Journal },
      { path: 'journal/new', component: JournalForm },
      { path: '', redirectTo: 'journal', pathMatch: 'full' }
    ])
  ]
})
export class OperationsModule { }
