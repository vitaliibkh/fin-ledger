import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {
  // --- DEPENDENCIES ---
  private router = inject(Router);

  // --- USER ACTIONS ---
  goHome() {
    this.router.navigate(['/']);
  }
}
