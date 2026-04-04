import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { Dashboard } from './dashboard/dashboard';

@NgModule({
  declarations: [Dashboard],
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    CurrencyPipe,
    RouterModule.forChild([
      { path: 'dashboard', component: Dashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ])
  ],

  providers: [provideCharts(withDefaultRegisterables())]
})
export class AnalyticsModule { }
