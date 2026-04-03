import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-journal-form',
  templateUrl: './journal-form.html',
  styleUrl: './journal-form.scss'
})
export class JournalForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  entryForm = this.fb.group({
    date: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: ['', Validators.required],
    debitAccountId: ['', Validators.required],
    creditAccountId: ['', Validators.required],
    counterpartyId: [''],
    comment: ['', Validators.maxLength(255)],
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['reverseOf']) {
        this.setupReversal(Number(params['reverseOf']));
      } else {
        const today = new Date().toISOString().split('T')[0];
        this.entryForm.patchValue({ date: today });
      }
    });
  }

  goBack() {
    this.router.navigate(['/operations/journal']);
  }

  setupReversal(originalId: number) {
    // TODO: Fetch the original entry details from ASP.NET API
    // e.g., this.http.get(`/api/journal/${originalId}`).subscribe(original => ...)

    const original = {
      amount: 1500.00,
      categoryId: '2',
      debitAccountId: '1',
      creditAccountId: '2',
      counterpartyId: '1'
    };

    this.entryForm.patchValue({
      date: new Date().toISOString().split('T')[0],
      amount: original.amount,
      categoryId: original.categoryId,
      counterpartyId: original.counterpartyId,
      debitAccountId: original.creditAccountId,
      creditAccountId: original.debitAccountId,
      comment: `Reversal of Entry #${originalId}`
    });

    this.entryForm.get('amount')?.disable();
    this.entryForm.get('categoryId')?.disable();
    this.entryForm.get('counterpartyId')?.disable();
    this.entryForm.get('debitAccountId')?.disable();
    this.entryForm.get('creditAccountId')?.disable();
  }

  onSubmit() {
    if (this.entryForm.valid) {
      const formData = this.entryForm.getRawValue();
      console.log('Submitting new entry to ASP.NET API...', formData);

      // TODO: Call the backend API via a service
      this.router.navigate(['/operations/journal']);
    } else {
      this.entryForm.markAllAsTouched();
    }
  }
}
